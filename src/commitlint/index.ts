import { Rule, SchematicContext, SchematicsException, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

export function commitlint(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {

    const packageJsonBuffer = tree.read("package.json");
    if (!packageJsonBuffer) {
      throw new SchematicsException("Not an npm project. Couldn't find package.json");
    }

    const packageJson = JSON.parse(packageJsonBuffer.toString());

    const devDeps = "devDependencies";
    const commitlintCliDep = "@commitlint/cli";
    const configConventionalDep = "@commitlint/config-conventional";
    const husky = "husky";
    const hooks = "hooks";
    const commitMsgHook = "commit-msg";
    const commitMsgScript = "commitlint -E HUSKY_GIT_PARAMS";
    const version = "latest";
    const commitlint = "commitlint";
    const commitLintextends = "extends";

    if (!packageJson[devDeps]) {
      packageJson[devDeps] = {};
    }
    if (!packageJson[devDeps][husky]) {
      packageJson[devDeps][husky] = version;
    }
    if (!packageJson[devDeps][commitlintCliDep]) {
      packageJson[devDeps][commitlintCliDep] = version;
    }
    if (!packageJson[devDeps][configConventionalDep]) {
      packageJson[devDeps][configConventionalDep] = version;
    }
    if (!packageJson[commitlint]) {
      packageJson[commitlint] = {};
      packageJson[commitlint][commitLintextends] = [configConventionalDep];
    } else {
      if (!packageJson[commitlint][commitLintextends]) {
        packageJson[commitlint][commitLintextends] = [configConventionalDep];
      } else {
        if (packageJson[commitlint][commitLintextends].indexOf(configConventionalDep) === -1) {
          _context.logger.log('info', `commit lint extends non-conventional config, rewriting to enforce conventional config`);
          packageJson[commitlint][commitLintextends] = [configConventionalDep];
        }
      }
    }

    if (!packageJson[husky]) {
      packageJson[husky] = {};
      packageJson[husky][hooks] = {};
      packageJson[husky][hooks][commitMsgHook] = commitMsgScript;
    } else {
      if (!packageJson[husky][hooks]) {
        packageJson[husky][hooks] = {};
        packageJson[husky][hooks][commitMsgHook] = commitMsgScript;
      } else {
        if (packageJson[husky][hooks][commitMsgHook] !== commitMsgScript) {
          _context.logger.log('info', `husky commit-msg hook is present & different from commitlint, rewriting to enforce commitlint`);
          packageJson[husky][hooks][commitMsgHook] = commitMsgScript;
        }
      }
    }

    tree.overwrite('package.json', JSON.stringify(packageJson, null, 2));

    _context.logger.log('info', `
    commit:lint
        added ${commitlintCliDep}@${version}, ${configConventionalDep}@${version}, ${husky}@${version} to ${devDeps} to package.json
        added ${commitMsgScript} to husky.hooks.commit-msg to package.json
    `);

    _context.addTask(new NodePackageInstallTask({packageManager: "yarn"}));

    return tree;
  };
}
