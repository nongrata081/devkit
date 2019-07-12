import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { addContentToPackageJson } from '../utils';
import {Files, PkgJsonContent} from '../utils/interface';
import {endpoints} from './endpoints';
import {addFilesToProject} from '../utils/helpers';

let pkgJsonContent: PkgJsonContent = {
  pkgJsonDependencies: {
    devDependencies: [
      { pkgName: "json-server", version: "latest" }
    ]
  },
  pkgJsonScripts: [
    { npmScriptKey: "fake:rest:api", npmScriptValue: "./node_modules/json-server/lib/cli/bin.js --watch fake-rest-api/endpoints.json" }
  ]
};

const files: Files = [
  {
    path: "fake-rest-api/endpoints.json",
    content: endpoints
  }
];

export function jsonServer(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    addContentToPackageJson(tree, _context, pkgJsonContent);
    addFilesToProject(tree, _context, files);
    return tree;
  };
}
