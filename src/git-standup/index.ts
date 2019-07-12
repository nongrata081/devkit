import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { addContentToPackageJson } from '../utils';
import { PkgJsonContent } from '../utils/interface';

let pkgJsonContent: PkgJsonContent = {
  pkgJsonDependencies: {
    devDependencies: [
      { pkgName: "git-standup", version: "latest" }
    ]
  },
  pkgJsonScripts: [
    { npmScriptKey: "git-standup", npmScriptValue: "./node_modules/git-standup/git-standup -D rfc" }
  ]
};

export function gitStandup(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    addContentToPackageJson(tree, _context, pkgJsonContent);
    return tree;
  };
}
