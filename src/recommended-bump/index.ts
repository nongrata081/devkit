import { Rule, SchematicContext, SchematicsException, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

export function recommendedBump(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {

    const packageJsonBuffer = tree.read("package.json");
    if (!packageJsonBuffer) {
      throw new SchematicsException("Not an npm project. Couldn't find package.json");
    }

    const packageJson = JSON.parse(packageJsonBuffer.toString());

    const scripts = "scripts";
    const recommendedVersionBumpScript = "recommended:bump";
    const recommendedVersionBumpScriptCmd = "conventional-recommended-bump --preset=angular";
    if (!packageJson[scripts]) {
      packageJson[scripts] = {};
    }
    packageJson[scripts][recommendedVersionBumpScript] = recommendedVersionBumpScriptCmd;

    const devDeps = "devDependencies";
    const recommendedVersionBump = "conventional-recommended-bump";
    const version = "latest";
    if (!packageJson[devDeps]) {
      packageJson[devDeps] = {};
    }

    if (!packageJson[devDeps][recommendedVersionBump]) {
      packageJson[devDeps][recommendedVersionBump] = version;
    }

    tree.overwrite('package.json', JSON.stringify(packageJson, null, 2));

    _context.logger.log('info', `
    recommended:version:bump
        added "${recommendedVersionBumpScript}" to "${scripts}" to package.json
        added "${recommendedVersionBump}@${version}" to ${devDeps} to package.json
    `);

    _context.addTask(new NodePackageInstallTask({packageManager: "yarn"}));

    return tree;
  };
}
