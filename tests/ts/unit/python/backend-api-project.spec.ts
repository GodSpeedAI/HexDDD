import { readFileSync } from 'fs';

describe('backend-api Nx project', () => {
  it('should define serve/test/type-check targets using run-commands', () => {
    const json = JSON.parse(readFileSync('apps/backend-api/project.json', 'utf-8'));
    const execServe = json.targets['serve'].executor;
    const execTest = json.targets['test'].executor;
    const execTypeCheck = json.targets['type-check'].executor;
    const valid = ['@nx/workspace:run-commands', 'nx:run-commands'];
    expect(valid).toContain(execServe);
    expect(valid).toContain(execTest);
    expect(valid).toContain(execTypeCheck);
  });
});

