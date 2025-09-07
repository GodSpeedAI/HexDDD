import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree } from '@nx/devkit';
import webAppGenerator from '../../../../libs/ddd/src/generators/web-app/generator';

describe('webAppGenerator (Next.js path)', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should create shared web library files', async () => {
    await webAppGenerator(tree, {
      name: 'web-next',
      framework: 'next',
      apiClient: true,
      includeExamplePage: true,
      routerStyle: 'app',
    });

    expect(tree.exists('libs/shared/web/src/lib/client.ts')).toBe(true);
    expect(tree.exists('libs/shared/web/src/lib/errors.ts')).toBe(true);
    expect(tree.exists('libs/shared/web/src/lib/schemas.ts')).toBe(true);
    expect(tree.exists('libs/shared/web/src/lib/env.ts')).toBe(true);
    expect(tree.exists('libs/shared/web/src/index.ts')).toBe(true);
  });

  it('should be idempotent on re-run', async () => {
    await webAppGenerator(tree, { name: 'web-next', framework: 'next', apiClient: true, routerStyle: 'app' });
    const before = tree.read('libs/shared/web/src/lib/client.ts')!.toString();
    await webAppGenerator(tree, { name: 'web-next', framework: 'next', apiClient: true, routerStyle: 'app' });
    const after = tree.read('libs/shared/web/src/lib/client.ts')!.toString();
    expect(after).toEqual(before);
  });
});

describe('webAppGenerator (Remix path)', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should create shared web library files even if remix plugin missing', async () => {
    await webAppGenerator(tree, {
      name: 'web-remix',
      framework: 'remix',
      apiClient: true,
      includeExamplePage: true,
    });

    expect(tree.exists('libs/shared/web/src/lib/client.ts')).toBe(true);
    expect(tree.exists('libs/shared/web/src/lib/errors.ts')).toBe(true);
    expect(tree.exists('libs/shared/web/src/lib/schemas.ts')).toBe(true);
    expect(tree.exists('libs/shared/web/src/lib/env.ts')).toBe(true);
    expect(tree.exists('libs/shared/web/src/index.ts')).toBe(true);
  });
});
