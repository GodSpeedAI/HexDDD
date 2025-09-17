import {
  Tree,
  formatFiles,
  installPackagesTask,
  names,
} from '@nx/devkit';
import { libraryGenerator as jsLibraryGenerator } from '@nx/js';
import { componentGenerator as reactComponentGenerator } from '@nx/react';
import { FeatureOptions } from './schema';
import { getNpmScope } from '../utils/npm';

export default async function (tree: Tree, options: FeatureOptions) {
  const npmScope = getNpmScope(tree);
  const domainName = names(options.domain).fileName;
  const featureName = names(options.name).fileName;

  const domainDirectory = options.directory
    ? `${options.directory}/${domainName}`
    : domainName;

  const featureDirectoryName = `feature-${featureName}`;
  const featureProjectName = `${domainName}-${featureDirectoryName}`;
  const featureDirectory = `libs/${domainDirectory}/${featureDirectoryName}`;

  const importPath = `${npmScope}/${domainDirectory}/${featureDirectoryName}`;

  await jsLibraryGenerator(tree, {
    name: featureProjectName,
    directory: featureDirectory,
    tags: `domain:${domainName},type:feature`,
    publishable: false,
    buildable: false,
    importPath: importPath,
  });

  await reactComponentGenerator(tree, {
    name: featureName,
    project: featureProjectName,
    style: 'scss',
    export: true,
  });

  await formatFiles(tree);
  return () => {
    installPackagesTask(tree);
  };
}
