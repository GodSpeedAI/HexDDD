import { readFileSync } from 'fs';

describe('backend-api Nx project', () => {
  it('should define serve/test/type-check targets using run-commands', () => {
    const json = JSON.parse(readFileSync('apps/backend-api/project.json', 'utf-8'));
    expect(json.targets['serve'].executor).toBe('@nx/workspace:run-commands');
    expect(json.targets['test'].executor).toBe('@nx/workspace:run-commands');
    expect(json.targets['type-check'].executor).toBe('@nx/workspace:run-commands');
  });
});

