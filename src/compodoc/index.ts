import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { addContentToPackageJson } from '../utils';
import { PkgJsonContent } from '../utils/interface';

let pkgJsonContent: PkgJsonContent = {
  pkgJsonDependencies: {
    devDependencies: [
      { pkgName: "@compodoc/compodoc", version: "latest" }
    ]
  },
  pkgJsonScripts: [
    { npmScriptKey: "compodoc", npmScriptValue: "npx compodoc -p path/to/tsconfig.app.json -d path/to/output -s -o" }
  ]
};

export function compodoc(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    addContentToPackageJson(tree, _context, pkgJsonContent);
    return tree;
  };
}
