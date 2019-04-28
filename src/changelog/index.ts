import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { PkgJsonContent } from '../utils/interface';
import { addContentToPackageJson } from '../utils';

let pkgJsonContent: PkgJsonContent = {
  pkgJsonDependencies: {
    devDependencies: [
      { pkgName: "conventional-changelog-cli", version: "latest" },
    ]
  },
  pkgJsonScripts: [
    { npmScriptKey: "generate:changelog", npmScriptValue: "./node_modules/.bin/conventional-changelog -p angular -i CHANGELOG.md -s -r 0" }
  ]
};

export function changelog (_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    addContentToPackageJson(tree, _context, pkgJsonContent);
    return tree;
  };
}
