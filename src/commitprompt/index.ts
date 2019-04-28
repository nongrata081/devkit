import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
// import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { PkgJsonContent } from '../utils/interface';
import { addContentToPackageJson } from '../utils';

let pkgJsonContent: PkgJsonContent = {
  pkgJsonDependencies: {
    devDependencies: [
      { pkgName: "commitizen", version: "latest" },
      { pkgName: "cz-conventional-changelog", version: "latest" }
    ]
  },
  pkgJsonScripts: [
    { npmScriptKey: "commit", npmScriptValue: "git-cz" }
  ],
  customObj: {
    key: "config",
    value: {
      commitizen: {
        path: "cz-conventional-changelog"
      }
    }
  }
};

export function commitprompt(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    addContentToPackageJson(tree, _context, pkgJsonContent);
    return tree;
  };
}
