import * as fs from 'fs';
import * as path from 'path';

describe('supabase-devstack project targets', () => {
  const projectPath = path.resolve(__dirname, '../../../../tools/supabase/project.json');
  let project: any;

  beforeAll(() => {
    const raw = fs.readFileSync(projectPath, 'utf8');
    project = JSON.parse(raw);
  });

  it('defines expected run-command targets', () => {
    expect(project.targets).toBeDefined();
    const keys = Object.keys(project.targets ?? {});
    expect(keys).toEqual(expect.arrayContaining(['start', 'stop', 'reset', 'status']));
  });

  it('wires commands through docker compose file', () => {
    const commands = Object.values(project.targets ?? {}).map((target: any) => target?.options?.command ?? '');
    commands.forEach((command) => {
      expect(command).toContain('docker compose');
      expect(command).toContain('docker/docker-compose.supabase.yml');
    });
  });
});
