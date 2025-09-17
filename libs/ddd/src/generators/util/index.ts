import { Tree, formatFiles, names } from '@nx/devkit';
import { libraryGenerator as jsLibraryGenerator } from '@nx/js';
import { UtilOptions } from './schema';
import { validateInputs } from '../utils/validate-inputs';
import { getWorkspaceScope } from '../utils/get-workspace-scope';

export default async function (tree: Tree, options: UtilOptions) {
  validateInputs(options);

  const workspaceName = getWorkspaceScope(tree);

  const libName = `util-${names(options.name).fileName}`;
  const libDirectory = options.directory ? names(options.directory).fileName : libName;
  const domainName = options.shared ? 'shared' : options.domain;
  const isPublishableLib = options.type === 'publishable';

  const finalName = `${domainName}-${libName}`;
  const finalDirectory = `libs/${domainName}/${libDirectory}`;

  const importPath = `${workspaceName}/${domainName}/${libDirectory}`;

  await jsLibraryGenerator(tree, {
    name: finalName,
    directory: finalDirectory,
    tags: `domain:${domainName},type:util`,
    publishable: isPublishableLib,
    buildable: options.type === 'buildable',
    importPath: options.importPath ?? importPath,
  });

  await formatFiles(tree);
}
