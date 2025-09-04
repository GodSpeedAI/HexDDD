import { ESLint } from 'eslint';

// Jest globals are available via tsconfig.json types
describe('ESLint Dependency Constraints', () => {
  const eslint = new ESLint({
    useEslintrc: true,
    cwd: process.cwd(),
  });

  it('should trigger lint error when domain imports infrastructure', async () => {
    const filePath = 'tests/fixtures/hex-architecture/domain/src/lib/invalid-import.ts';
    const results = await eslint.lintFiles([filePath]);

    // Should have at least one lint error
    expect(results[0].messages.length).toBeGreaterThan(0);
    expect(results[0].messages[0].ruleId).toBe('@nx/enforce-module-boundaries');
  });

  it('should pass when infrastructure imports domain', async () => {
    const filePath = 'tests/fixtures/hex-architecture/infrastructure/src/lib/user.repository.ts';
    const results = await eslint.lintFiles([filePath]);

    // Should have no lint errors (infrastructure can import domain)
    expect(results[0].messages.length).toBe(0);
  });

  it('should pass when application imports domain', async () => {
    const filePath = 'tests/fixtures/hex-architecture/application/src/lib/user.service.ts';
    const results = await eslint.lintFiles([filePath]);

    // Should have no lint errors (application can import domain)
    expect(results[0].messages.length).toBe(0);
  });
});
