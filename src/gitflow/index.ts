import { Rule, SchematicContext, SchematicsException, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

export function gitflow(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {

    const packageJsonBuffer = tree.read("package.json");
    if (!packageJsonBuffer) {
      throw new SchematicsException("Not an npm project. Couldn't find package.json");
    }

    const packageJson = JSON.parse(packageJsonBuffer.toString());

    const scripts = "scripts";
    const gitFlowScript = "enforce:gitflow";
    const gitFlowScriptCmd = "node ./node_modules/.bin/enforce-gitflow-branches";
    if (!packageJson[scripts]) {
      packageJson[scripts] = {};
    }
    packageJson[scripts][gitFlowScript] = gitFlowScriptCmd;

    const devDeps = "devDependencies";
    const gitflowDep = "enforce-gitflow-branches";
    const huskyDep = "husky";
    const version = "latest";
    if (!packageJson[devDeps]) {
      packageJson[devDeps] = {};
    }

    if (!packageJson[devDeps][huskyDep]) {
      packageJson[devDeps][huskyDep] = version;
    }
    if (!packageJson[devDeps][gitflowDep]) {
      packageJson[devDeps][gitflowDep] = version;
    }

    const hooks = "hooks";
    const prepush = "pre-push";
    const huskyGitFlowCmd = "npm run enforce:gitflow";
    if (!packageJson[huskyDep]) {
      packageJson[huskyDep] = {};
      packageJson[huskyDep][hooks] = {};
      packageJson[huskyDep][hooks][prepush] = huskyGitFlowCmd;
    } else {
      if (packageJson[huskyDep][hooks][prepush] && packageJson[huskyDep][hooks][prepush].indexOf(gitFlowScript) === -1) {
        packageJson[huskyDep][hooks][prepush] = huskyGitFlowCmd + " && " + packageJson[huskyDep][hooks][prepush];
      }
    }

    tree.overwrite('package.json', JSON.stringify(packageJson, null, 2));
    _context.logger.log('info', `Added "${gitFlowScript}" to "${scripts}" in package.json`);
    _context.logger.log('info', `Added "${huskyDep}@${version}", "${gitflowDep}@${version}" to ${devDeps}`);
    _context.addTask(new NodePackageInstallTask());

    return tree;
  };
}
