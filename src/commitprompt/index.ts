import { Rule, SchematicContext, SchematicsException, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

export function commitprompt(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {

    const packageJsonBuffer = tree.read("package.json");
    if (!packageJsonBuffer) {
      throw new SchematicsException("Not an npm project. Couldn't find package.json");
    }

    const packageJson = JSON.parse(packageJsonBuffer.toString());

    const scripts = "scripts";
    const commitScript = "commit";
    const commitScriptCmd = "git-cz";
    if (!packageJson[scripts]) {
      packageJson[scripts] = {};
    }
    packageJson[scripts][commitScript] = commitScriptCmd;

    const devDeps = "devDependencies";
    const commitizen = "commitizen";
    const commitizenConfig = "cz-conventional-changelog";
    const path = "path";
    const version = "latest";
    if (!packageJson[devDeps]) {
      packageJson[devDeps] = {};
    }
    if (!packageJson[devDeps][commitizen]) {
      packageJson[devDeps][commitizen] = version;
    }
    if (!packageJson[devDeps][commitizenConfig]) {
      packageJson[devDeps][commitizenConfig] = version;
    }

    const config = "config";
    if (!packageJson[config]) {
      packageJson[config] = {};
      packageJson[config][commitizen] = {};
      packageJson[config][commitizen][path] = commitizenConfig;
    } else {
      if (!packageJson[config][commitizen]) {
        packageJson[config][commitizen] = {};
        packageJson[config][commitizen][path] = commitizenConfig;
      } else {
        if (packageJson[config][commitizen][path] !== commitizenConfig) {
          _context.logger.log('info', `commitizen uses a non-conventional config, rewriting to enforce ${commitizenConfig}`);
          packageJson[config][commitizen][path] = commitizenConfig;
        }
      }
    }

    tree.overwrite('package.json', JSON.stringify(packageJson, null, 2));
    _context.logger.log('info', `Added "${commitizen}@${version}" to "${devDeps}" in package.json`);
    _context.logger.log('info', `Added "${commitizenConfig}@${version}" to "${devDeps}" in package.json`);
    _context.logger.log('info', `Added "${commitizenConfig}" to "config.commitizen.path" in package.json`);
    _context.addTask(new NodePackageInstallTask());

    return tree;
  };
}
