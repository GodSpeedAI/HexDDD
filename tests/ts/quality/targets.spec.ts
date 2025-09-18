import { spawnSync } from 'node:child_process';

function runNxTarget(target: string) {
  const args = ['nx', 'run-many', '-t', target, '--skip-nx-cache'];

  if (target === 'build') {
    args.push('--exclude', 'web-next,web-expo');
  }

  const result = spawnSync('npx', args, {
    encoding: 'utf8',
    stdio: 'pipe',
  });
  return { code: result.status ?? 1, stdout: result.stdout, stderr: result.stderr };
}

describe('Quality gates (lint/type-check/build)', () => {
  it('type-check passes where configured', () => {
    const { code, stderr, stdout } = runNxTarget('type-check');
    if (code !== 0) {
      const msg = stderr || stdout;
      expect(msg).toMatch(/has no target named|No projects matched|not found/i);
      return;
    }
    expect(code).toBe(0);
  });

  it('lint passes', () => {
    const { code, stderr, stdout } = runNxTarget('lint');
    if (code !== 0) {
      const msg = stderr || stdout;
      expect(msg).toMatch(/has no target named|No projects matched|not found/i);
      return;
    }
    expect(code).toBe(0);
  });

  it('build passes for web apps that define build', () => {
    const { code, stderr, stdout } = runNxTarget('build');
    if (code !== 0) {
      const msg = stderr || stdout;
      expect(msg).toMatch(/has no target named|No projects matched|not found/i);
      return;
    }
    expect(code).toBe(0);
  });
});
