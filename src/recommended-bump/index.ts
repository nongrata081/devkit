import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { addContentToPackageJson } from '../utils';
import { PkgJsonContent } from '../utils/interface';

let pkgJsonContent: PkgJsonContent = {
  pkgJsonDependencies: {
    devDependencies: [
      { pkgName: "conventional-recommended-bump", version: "latest" },
    ]
  },
  pkgJsonScripts: [
    { npmScriptKey: "recommended:bump", npmScriptValue: "conventional-recommended-bump --preset=angular" }
  ]
};

export function recommendedBump(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    addContentToPackageJson(tree, _context, pkgJsonContent);
    return tree;
  };
}
