import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { enforceYarnNodeScript } from './enforce-yarn-node-script';
import { addContentToPackageJson, addFilesToProject } from '../utils';
import { Files, PkgJsonContent } from '../utils/interface';

const pkgJsonContent: PkgJsonContent = {
  pkgJsonScripts: [
    { npmScriptKey: "preinstall", npmScriptValue: "node scripts/enforce-yarn.js" }
  ]
};

const files: Files = [
  {
    path: "scripts/enforce-yarn.js",
    content: enforceYarnNodeScript
  }
];


export function enforceYarn(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    addContentToPackageJson(tree, _context, pkgJsonContent);
    addFilesToProject(tree, _context, files);
    // const enforceScriptPath = "scripts/enforce-yarn.js";
    // tree.create(enforceScriptPath, Buffer.from(enforceYarnNodeScript));
    // _context.logger.log('info', `enforce:yarn - added enforce yarn node script to ${enforceScriptPath}`);

    return tree;
  };
}
