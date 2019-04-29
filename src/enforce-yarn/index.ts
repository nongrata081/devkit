import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { enforceYarnNodeScript } from './enforce-yarn-node-script';
import { addContentToPackageJson} from '../utils';
import { Files, PkgJsonContent } from '../utils/interface';
import { addFilesToProject } from '../utils/helpers';

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
    return tree;
  };
}
