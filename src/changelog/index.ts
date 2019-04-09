import { Rule, SchematicContext, SchematicsException, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

export function changelog(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {

    const packageJsonBuffer = tree.read("package.json");
    if (!packageJsonBuffer) {
      throw new SchematicsException("Not an npm project. Couldn't find package.json");
    }

    const packageJson = JSON.parse(packageJsonBuffer.toString());

    const scripts = "scripts";
    const changelogScript = "changelog";
    const changelogScriptCmd = "./node_modules/.bin/conventional-changelog -p angular -i CHANGELOG.md -s -r 0";
    if (!packageJson[scripts]) {
      packageJson[scripts] = {};
    }
    packageJson[scripts][changelogScript] = changelogScriptCmd;

    const devDeps = "devDependencies";
    const changelog = "conventional-changelog-cli";
    const version = "latest";
    if (!packageJson[devDeps]) {
      packageJson[devDeps] = {};
    }
    if (!packageJson[devDeps][changelog]) {
      packageJson[devDeps][changelog] = version;
    }

    tree.overwrite('package.json', JSON.stringify(packageJson, null, 2));
    _context.logger.log('info', `Added "${changelogScript}" to "${scripts}" in package.json`);
    _context.logger.log('info', `Added "${changelog}@${version}" to ${devDeps}`);
    _context.addTask(new NodePackageInstallTask());

    return tree;
  };
}
