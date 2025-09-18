import { Tree, formatFiles, names } from '@nx/devkit';
import { libraryGenerator as jsLibraryGenerator } from '@nx/js';
import { Api } from './schema';
import { getWorkspaceScope } from '../utils/get-workspace-scope';

export default async function (tree: Tree, options: Api) {

  const workspaceName = getWorkspaceScope(tree);

  const libName = options.name
    ? `api-${names(options.name).fileName}`
    : 'api';
  const libDirectory = options.directory
    ? names(options.directory).fileName
    : libName;
  const domainName = options.shared ? 'shared' : options.domain;
  const isPublishableLib = options.type === 'publishable';

  const finalName = `${domainName}-${libName}`;
  const finalDirectory = `libs/${domainName}/${libDirectory}`;

  const importPath = `${workspaceName}/${domainName}/${libDirectory}`;

  await jsLibraryGenerator(tree, {
    name: finalName,
    directory: finalDirectory,
    tags: `domain:${domainName},domain:${domainName}/${libName},type:api`,
    publishable: isPublishableLib,
    buildable: options.type === 'buildable',
    importPath: options.importPath ?? importPath,
  });

  console.info(
    `\nHINT: Don't forget to extend the rules in your "eslint.config.js" to allow selected domains to access this API.\nFor this, add the tag domain:${domainName}/${libName} to the respective domains' rule sets.\n `
  );

  await formatFiles(tree);
}
