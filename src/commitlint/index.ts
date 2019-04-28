import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { addContentToPackageJson } from '../utils';
import { PkgJsonContent } from '../utils/interface';

let pkgJsonContent: PkgJsonContent = {
  pkgJsonDependencies: {
    devDependencies: [
      { pkgName: "@commitlint/cli", version: "latest" },
      { pkgName: "@commitlint/config-conventional", version: "latest" },
      { pkgName: "husky", version: "latest" }
    ]
  },
  customObj: {
    key: "commitlint",
    value: {
      extends: [
        "@commitlint/config-conventional"
      ]
    }
  },
  husky: {
    huskyHooks: [
      { hook: "commit-msg", cmd: "commitlint -E HUSKY_GIT_PARAMS" }
    ]
  }
};

export function commitlint(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    addContentToPackageJson(tree, _context, pkgJsonContent);
    return tree;
  };
}
