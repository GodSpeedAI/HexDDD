import { Tree, formatFiles, generateFiles, joinPathFragments, names } from '@nx/devkit';
import { WebAppGeneratorSchema } from './schema';

async function tryGenerateNextApp(tree: Tree, options: WebAppGeneratorSchema) {
  try {
    // Dynamically require the Next.js application generator to avoid hard dependency during tests
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { applicationGenerator } = require('@nx/next/src/generators/application/application');
    const appNames = names(options.name);
    const directory = joinPathFragments('apps', appNames.fileName);
    const appDir = options.routerStyle !== 'pages';
    await applicationGenerator(tree, {
      name: appNames.fileName,
      directory,
      style: 'css',
      unitTestRunner: 'jest',
      linter: 'eslint',
      appDir,
    });
  } catch (e) {
    // If plugin not installed, skip external scaffolding; shared lib wiring still proceeds
    // eslint-disable-next-line no-console
    console.warn('[web-app] @nx/next not available or failed, proceeding with shared lib only');
  }
}

async function tryGenerateRemixApp(tree: Tree, options: WebAppGeneratorSchema) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { applicationGenerator } = require('@nx/remix/generators');
    const appNames = names(options.name);
    const directory = joinPathFragments('apps', appNames.fileName);
    await applicationGenerator(tree, {
      name: appNames.fileName,
      directory,
      linter: 'eslint',
      unitTestRunner: 'jest',
      // Additional options can be passed if supported by plugin version
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[web-app] @nx/remix not available or failed, proceeding with shared lib only');
  }
}

async function tryGenerateExpoApp(tree: Tree, options: WebAppGeneratorSchema) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const gen = require('@nx/expo/src/generators/application/application').default;
    const appNames = names(options.name);
    const directory = joinPathFragments('apps', appNames.fileName);
    await gen(tree, {
      name: appNames.fileName,
      directory,
      linter: 'eslint',
      unitTestRunner: 'jest',
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[web-app] @nx/expo not available or failed, proceeding with shared lib only');
  }
}

function ensureSharedWeb(tree: Tree, opts: WebAppGeneratorSchema) {
  const base = 'libs/shared/web/src/lib';
  const files: Record<string, string> = {
    [`${base}/client.ts`]: `// Shared typed API client\nexport async function fetchJson<T>(url: string): Promise<T> {\n  const res = await fetch(url);\n  if (!res.ok) throw new Error('NetworkError');\n  return (await res.json()) as T;\n}\n\n// <hex-web-client-exports>\n`,
    [`${base}/errors.ts`]: `export type ValidationError = { type: 'ValidationError'; message: string };\nexport type NetworkError = { type: 'NetworkError'; message: string };\nexport type UnexpectedError = { type: 'UnexpectedError'; message: string };\nexport type AppError = ValidationError | NetworkError | UnexpectedError;\n`,
    [`${base}/schemas.ts`]: `// Place zod schemas here and export inferred types\n`,
    [`${base}/env.ts`]: `export const ENV = {\n  API_URL: process.env.NX_API_URL ?? '/api'\n};\n`,
    ['libs/shared/web/src/index.ts']: `export * from './lib/client';\nexport * from './lib/errors';\nexport * from './lib/schemas';\nexport * from './lib/env';\n`,
  };

  for (const [path, content] of Object.entries(files)) {
    if (!tree.exists(path)) {
      tree.write(path, content);
    }
  }
}

export async function webAppGenerator(tree: Tree, options: WebAppGeneratorSchema) {
  if (options.framework === 'next') {
    await tryGenerateNextApp(tree, options);
  } else if (options.framework === 'remix') {
    await tryGenerateRemixApp(tree, options);
  } else if (options.framework === 'expo') {
    await tryGenerateExpoApp(tree, options);
  }

  if (options.apiClient !== false) {
    ensureSharedWeb(tree, options);
  }

  // Optionally add example page wiring in future; keep minimal and idempotent for now
  await formatFiles(tree);
}

export default webAppGenerator;
