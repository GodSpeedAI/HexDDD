import * as fs from 'fs';
import * as path from 'path';

describe('supabase run-command env wiring', () => {
  const projectPath = path.resolve(__dirname, '../../../../tools/supabase/project.json');
  let commands: string[];

  beforeAll(() => {
    const raw = fs.readFileSync(projectPath, 'utf8');
    const project = JSON.parse(raw);
    commands = Object.values(project.targets ?? {}).map((target: any) => target?.options?.command ?? '');
  });

  it('forces --env-file .env.supabase.local for each command', () => {
    commands.forEach((command) => {
      expect(command).toContain('--env-file .env.supabase.local');
    });
  });
});
