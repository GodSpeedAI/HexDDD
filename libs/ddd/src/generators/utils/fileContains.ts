import { Tree } from '@nx/devkit';

export function fileContains(
  tree: Tree,
  appModulePath: string,
  subStr: string
) {
  const content = tree.read(appModulePath);
  return content ? content.toString('utf-8').indexOf(subStr) !== -1 : false;
}
