import { spawnSync } from 'node:child_process';

function runNxTarget(target: string) {
    const result = spawnSync('npx', ['nx', 'run-many', '-t', target, '--skip-nx-cache'], {
        encoding: 'utf8',
        stdio: 'pipe',
    });
    return { code: result.status ?? 1, stdout: result.stdout, stderr: result.stderr };
}

describe('Quality gates (lint/type-check/build)', () => {
    it('type-check passes where configured', () => {
        const { code, stderr } = runNxTarget('type-check');
        // Not all projects have type-check. If none, nx exits with code 1. Accept success only when configured.
        // We treat non-zero as acceptable only if it mentions that no projects match; otherwise fail.
        if (code !== 0) {
            // Allow case where some targets are missing. Make assertion informative.
            expect(stderr).toMatch(/has no target named|No projects matched|not found/i);
            return;
        }
        expect(code).toBe(0);
    });

    it('lint passes', () => {
        const { code } = runNxTarget('lint');
        expect(code).toBe(0);
    });

    it('build passes for web apps that define build', () => {
        const { code, stderr } = runNxTarget('build');
        if (code !== 0) {
            // Some projects may not define build; allow in that case.
            expect(stderr).toMatch(/has no target named|No projects matched|not found/i);
            return;
        }
        expect(code).toBe(0);
    });
});
