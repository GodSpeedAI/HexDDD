import { DbToTypeScript } from '../../../../tools/type-generator/src/generators/types/db-to-typescript';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

describe('Postgres to TypeScript Type Mapping', () => {
  let generator: DbToTypeScript;

  beforeEach(() => {
    generator = new DbToTypeScript();
  });

  it('should map uuid to string', () => {
    const result = generator.mapPostgresToTypeScript('uuid');
    expect(result).toBe('string');
  });

  it('should map bigint to string', () => {
    const result = generator.mapPostgresToTypeScript('bigint');
    expect(result).toBe('string');
  });

  it('should map timestamptz to string', () => {
    const result = generator.mapPostgresToTypeScript('timestamptz');
    expect(result).toBe('string');
  });

  it('should map integer to number', () => {
    const result = generator.mapPostgresToTypeScript('integer');
    expect(result).toBe('number');
  });

  it('should map boolean to boolean', () => {
    const result = generator.mapPostgresToTypeScript('boolean');
    expect(result).toBe('boolean');
  });

  it('should map text to string', () => {
    const result = generator.mapPostgresToTypeScript('text');
    expect(result).toBe('string');
  });

  it('should handle nullable types with | null', () => {
    const result = generator.mapPostgresToTypeScript('uuid', true);
    expect(result).toBe('string | null');
  });

  it('should handle array types with []', () => {
    const result = generator.mapPostgresToTypeScript('uuid', false, true);
    expect(result).toBe('string[]');
  });

  it('should handle nullable array types', () => {
    const result = generator.mapPostgresToTypeScript('uuid', true, true);
    expect(result).toBe('string[] | null');
  });

  describe('Schema parsing and generation', () => {
    it('should generate types from schema', () => {
      const schemaPath = path.join(__dirname, '../../../fixtures/database-schema.json');
      const types = generator.generate(schemaPath);

      expect(types).toBeDefined();
      expect(types.Users).toBeDefined();
      expect(types.Users.id).toBe('string');
      expect(types.Users.name).toBe('string');
      expect(types.Posts).toBeDefined();
      expect(types.Posts.title).toBe('string');
    });

    it('should generate types with file output', () => {
      const schemaPath = path.join(__dirname, '../../../fixtures/database-schema.json');
      const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'typegen-test-'));

      try {
        const types = generator.generate(schemaPath, tempDir);

        // Check that files were created
        const usersFile = path.join(tempDir, 'users.ts');
        const postsFile = path.join(tempDir, 'posts.ts');
        const commentsFile = path.join(tempDir, 'comments.ts');

        expect(fs.existsSync(usersFile)).toBe(true);
        expect(fs.existsSync(postsFile)).toBe(true);
        expect(fs.existsSync(commentsFile)).toBe(true);

        // Check file content
        const usersContent = fs.readFileSync(usersFile, 'utf-8');
        expect(usersContent).toContain('export interface Users {');
        expect(usersContent).toContain('id: string;');
        expect(usersContent).toContain('name: string;');

        const postsContent = fs.readFileSync(postsFile, 'utf-8');
        expect(postsContent).toContain('export interface Posts {');
        expect(postsContent).toContain('title: string;');
        expect(postsContent).toContain('content: string | null;');

        const commentsContent = fs.readFileSync(commentsFile, 'utf-8');
        expect(commentsContent).toContain('export interface Comments {');
        expect(commentsContent).toContain('id: string;');
        expect(commentsContent).toContain('content: string;');
      } finally {
        // Clean up
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    });
  });
});
