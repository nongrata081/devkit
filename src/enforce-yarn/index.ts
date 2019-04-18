import { Rule, SchematicContext, SchematicsException, Tree } from '@angular-devkit/schematics';
import { enforceYarnNodeScript } from './enforce-yarn-node-script';

export function enforceYarn(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {

    const packageJsonBuffer = tree.read("package.json");
    if (!packageJsonBuffer) {
      throw new SchematicsException("Not an npm project. Couldn't find package.json");
    }

    const packageJson = JSON.parse(packageJsonBuffer.toString());

    const scripts = "scripts";
    const preinstallScript = "preinstall";
    const preinstallScriptCmd = "node scripts/enforce-yarn.js";
    if (!packageJson[scripts]) {
      packageJson[scripts] = {};
    }
    packageJson[scripts][preinstallScript] = preinstallScriptCmd;

    tree.overwrite('package.json', JSON.stringify(packageJson, null, 2));

    const enforceScriptPath = "scripts/enforce-yarn.js";

    tree.create(enforceScriptPath, Buffer.from(enforceYarnNodeScript));

    _context.logger.log('info', `
    enforce:yarn
        added "${preinstallScript}" to "${scripts}" to package.json
        added enforce yarn node script to ${enforceScriptPath}
    `);

    return tree;
  };
}
