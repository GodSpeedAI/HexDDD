import {
  Tree,
  formatFiles,
  installPackagesTask,
  joinPathFragments,
  names,
} from '@nx/devkit';
import { libraryGenerator as jsLibraryGenerator } from '@nx/js';
import { applicationGenerator as reactApplicationGenerator } from '@nx/react';
import { Domain } from './schema';
import { updateDepConst } from '../utils/update-dep-const';
import { getNpmScope } from '../utils/npm';

export default async function (tree: Tree, options: Domain) {
  const npmScope = getNpmScope(tree);
  const domainName = names(options.name).fileName;

  const domainNameAndDirectory = options.directory
    ? `${options.directory}/${domainName}`
    : domainName;

  const finalName = `${domainName}-domain`;
  const finalDirectory = `libs/${domainNameAndDirectory}/domain`;
  const libSrcFolder = `${finalDirectory}/src`;
  const libLibFolder = `${libSrcFolder}/lib`;

  const importPath = `${npmScope}/${domainNameAndDirectory}/domain`;

  await jsLibraryGenerator(tree, {
    name: finalName,
    directory: finalDirectory,
    tags: `domain:${domainName},type:domain-logic`,
    publishable: options.type === 'publishable',
    buildable: options.type === 'buildable',
    importPath: options.importPath ?? importPath,
  });

  updateDepConst(tree, (depConst) => {
    depConst.push({
      sourceTag: `domain:${domainName}`,
      onlyDependOnLibsWithTags: [`domain:${domainName}`, 'domain:shared'],
    });
  });

  tree.write(joinPathFragments(libLibFolder, 'application/.gitkeep'), '');
  tree.write(joinPathFragments(libLibFolder, 'entities/.gitkeep'), '');
  tree.write(joinPathFragments(libLibFolder, 'infrastructure/.gitkeep'), '');

  if (options.addApp) {
    const appName = names(options.name).fileName;
    const appDirectory = options.appDirectory
      ? `${options.appDirectory}/${appName}`
      : appName;

    await reactApplicationGenerator(tree, {
      name: appName,
      directory: `apps/${appDirectory}`,
      tags: `domain:${appName},type:app`,
      style: 'scss',
      e2eTestRunner: 'none',
      linter: 'eslint',
    });
  }

  await formatFiles(tree);
  return () => {
    installPackagesTask(tree);
  };
}
