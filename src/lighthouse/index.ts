import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { addContentToPackageJson } from '../utils';
import {Files, PkgJsonContent} from '../utils/interface';
import {addFilesToProject} from '../utils/helpers';

let pkgJsonContent: PkgJsonContent = {
  pkgJsonDependencies: {
    devDependencies: [
      { pkgName: "lighthouse", version: "latest" }
    ]
  },
  pkgJsonScripts: [
    { npmScriptKey: "lighthouse:mobile", npmScriptValue: "node ./node_modules/.bin/lighthouse http://localhost:4200 --output-path=./lighthouse/mobile/report.html --view" },
    { npmScriptKey: "lighthouse:desktop", npmScriptValue: "node ./node_modules/.bin/lighthouse http://localhost:4200 --emulated-form-factor=none --output-path=./lighthouse/desktop/report.html --view" }
  ]
};

const files: Files = [
  {
    path: "lighthouse/mobile/report.html",
    content: ''
  },
  {
    path: "lighthouse/desktop/report.html",
    content: ''
  }
];

export function lighthouse(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    addContentToPackageJson(tree, _context, pkgJsonContent);
    addFilesToProject(tree, _context, files);
    return tree;
  };
}
