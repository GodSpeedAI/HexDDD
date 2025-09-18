import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'yaml';

describe('docker/docker-compose.supabase.yml', () => {
  const composePath = path.resolve(__dirname, '../../../../docker/docker-compose.supabase.yml');
  let services: Record<string, any>;
  let volumes: Record<string, any>;

  beforeAll(() => {
    const raw = fs.readFileSync(composePath, 'utf8');
    const doc = parse(raw) as { services: Record<string, any>; volumes?: Record<string, any> };
    services = doc.services ?? {};
    volumes = doc.volumes ?? {};
  });

  it('defines the expected supabase service set', () => {
    expect(Object.keys(services)).toEqual(
      expect.arrayContaining([
        'db',
        'auth',
        'rest',
        'realtime',
        'storage',
        'inbucket',
        'edge-runtime',
        'kong',
        'studio',
      ]),
    );
  });

  it('references the shared env template for each active service', () => {
    Object.entries(services).forEach(([name, svc]) => {
      // Some services are placeholders (hello-world) until registry login is configured.
      if (svc?.image === 'hello-world') {
        return;
      }

      const envFiles = svc?.env_file ?? [];
      const envList = Array.isArray(envFiles) ? envFiles : [envFiles];
      expect(envList).toContain('../.env.supabase.local');
    });
  });

  it('declares named volumes for stateful services', () => {
    expect(Object.keys(volumes)).toEqual(expect.arrayContaining(['supabase-db', 'supabase-storage', 'supabase-kong']));
  });
});
