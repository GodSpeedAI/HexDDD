import { Tree, formatFiles, names } from '@nx/devkit';
import { libraryGenerator as reactLibraryGenerator } from '@nx/react';
import { Ui } from './schema';
import { validateInputs } from '../utils/validate-inputs';
import { getWorkspaceScope } from '../utils/get-workspace-scope';

export default async function (tree: Tree, options: Ui) {
  validateInputs(options);

  const workspaceName = getWorkspaceScope(tree);

  const libName = `ui-${names(options.name).fileName}`;
  const libDirectory = options.directory ? names(options.directory).fileName : libName;
  const domainName = options.shared ? 'shared' : options.domain;
  const isPublishableLib = options.type === 'publishable';

  const finalName = `${domainName}-${libName}`;
  const finalDirectory = `libs/${domainName}/${libDirectory}`;

  const importPath = `${workspaceName}/${domainName}/${libDirectory}`;

  await reactLibraryGenerator(tree, {
    name: finalName,
    directory: finalDirectory,
    tags: `domain:${domainName},type:ui`,
    publishable: isPublishableLib,
    buildable: options.type === 'buildable',
    importPath: options.importPath ?? importPath,
    style: 'scss',
    component: true,
    linter: 'eslint',
  });

  await formatFiles(tree);
}
