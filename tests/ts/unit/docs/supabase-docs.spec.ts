import * as fs from 'fs';
import * as path from 'path';

describe('Supabase documentation coverage', () => {
  it('README surfaces local supabase workflow', () => {
    const readme = fs.readFileSync(path.resolve(__dirname, '../../../../README.md'), 'utf8');
    expect(readme).toContain('Local Supabase Stack');
    expect(readme).toContain('nx run supabase-devstack:start');
  });

  it('TDD plan tracks supabase tasks', () => {
    const tdd = fs.readFileSync(path.resolve(__dirname, '../../../../docs/TDD-Plan-hex-react-python.md'), 'utf8');
    expect(tdd).toContain('Phase 0: Local Supabase Dev Stack');
    expect(tdd).toContain('supabase-devstack:status');
  });
});
