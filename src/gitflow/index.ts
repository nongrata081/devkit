import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { addContentToPackageJson } from '../utils';
import { PkgJsonContent } from '../utils/interface';

let pkgJsonContent: PkgJsonContent = {
  pkgJsonDependencies: {
    devDependencies: [
      { pkgName: "enforce-gitflow-branches", version: "latest" },
      { pkgName: "husky", version: "latest" }
    ]
  },
  pkgJsonScripts: [
    { npmScriptKey: "enforce:gitflow", npmScriptValue: "node ./node_modules/.bin/enforce-gitflow-branches" }
  ],
  husky: {
    huskyHooks: [
      { hook: "pre-push", cmd: "npm run enforce:gitflow" }
    ]
  }
};

export function gitflow(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    addContentToPackageJson(tree, _context, pkgJsonContent);
    return tree;
  };
}
