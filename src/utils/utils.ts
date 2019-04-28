import { SchematicContext, Tree } from '@angular-devkit/schematics';
import { PkgJsonContent } from './interface';

function sortObjectByKeys(obj: any) {
  return Object.keys(obj)
    .sort()
    .reduce((result: any, key) => {
      result[key] = obj[key];
      return result;
    }, {});
}

export function addContentToPackageJson(
  tree: Tree,
  _context: SchematicContext,
  content: PkgJsonContent
) {
  const pkgJsonBuffer =  tree.read("package.json");

  if (pkgJsonBuffer) {
    const pkgJson = JSON.parse(pkgJsonBuffer!.toString('utf-8'));

    // Scripts
    if (content.pkgJsonScripts !== undefined && content.pkgJsonScripts.length) {
      if (!pkgJson.scripts) pkgJson.scripts = {};
      content.pkgJsonScripts.forEach(script => {
        pkgJson.scripts[script.npmScriptKey] = script.npmScriptValue;
        _context.logger.log('info', `✅️ Added into scripts: "${script.npmScriptKey}":"${script.npmScriptValue}"`);
      });
    }

    // Dependencies
    if (content.pkgJsonDependencies.dependencies) {
      if (!pkgJson.dependencies) pkgJson.dependencies = {};
      content.pkgJsonDependencies.dependencies.forEach(dependency => {
        pkgJson.dependencies[dependency.pkgName] = dependency.version;
        _context.logger.log('info', `✅️ Added into dependencies: "${dependency.pkgName}":"${dependency.version}"`);
      });
      pkgJson.dependencies = sortObjectByKeys(pkgJson.dependencies);
    }

    // DevDependencies
    if (content.pkgJsonDependencies.devDependencies) {
      if (!pkgJson.devDependencies) pkgJson.devDependencies = {};
      content.pkgJsonDependencies.devDependencies.forEach(dependency => {
        pkgJson.devDependencies[dependency.pkgName] = dependency.version;
        _context.logger.log('info', `✅️ Added into devDependencies: "${dependency.pkgName}":"${dependency.version}"`);
      });
      pkgJson.devDependencies = sortObjectByKeys(pkgJson.devDependencies);
    }

    // Custom Object
    if (content.customObj) {
      pkgJson[content.customObj.key] = content.customObj.value;
      _context.logger.log('info', `✅️ Added into package.json: custom object ${JSON.stringify(content.customObj.value)} to "${content.customObj.key}"`);
    }

    // TODO refactor husky block to use a function for repitive actions ("commit-msg" & "pre-push")

    // Husky
    if (content.husky) {
      if (!pkgJson.husky) {
        pkgJson.husky = {};
      }
      if (!pkgJson.husky.hooks) {
        pkgJson.husky.hooks = {};
      }
      content.husky.huskyHooks.forEach(huskyHook => {
        if (huskyHook.hook === "commit-msg") {
          if (!pkgJson.husky.hooks["commit-msg"]) {
            pkgJson.husky.hooks["commit-msg"] = huskyHook.cmd;
            _context.logger.log('info', `✅️ Added into package.json: husky hook "${huskyHook.hook}":"${huskyHook.cmd}"`);
          } else {
            if (!pkgJson.husky.hooks["commit-msg"].includes(huskyHook.cmd)) {
              pkgJson.husky.hooks["commit-msg"] = huskyHook.cmd + " && " + pkgJson.husky.hooks["commit-msg"];
              _context.logger.log('info', `✅️ Prepended in package.json: existing husky hook "${huskyHook.hook}" with "${huskyHook.cmd}"`);
            } else {
              _context.logger.log('info', `✅️ Existing husky hook "${huskyHook.hook}" already has "${huskyHook.cmd}", skipping this step`);
            }
          }
        }
        if (huskyHook.hook === "pre-push") {
          if (!pkgJson.husky.hooks["pre-push"]) {
            pkgJson.husky.hooks["pre-push"] = huskyHook.cmd;
            _context.logger.log('info', `✅️ Added into package.json: husky hook "${huskyHook.hook}":"${huskyHook.cmd}"`);
          } else {
            if (!pkgJson.husky.hooks["pre-push"].includes(huskyHook.cmd)) {
              pkgJson.husky.hooks["pre-push"] = huskyHook.cmd + " && " + pkgJson.husky.hooks["pre-push"];
              _context.logger.log('info', `✅️ Prepended in package.json: existing husky hook "${huskyHook.hook}" with "${huskyHook.cmd}"`);
            } else {
              _context.logger.log('info', `✅️ Existing husky hook "${huskyHook.hook}" already has "${huskyHook.cmd}", skipping this step`);
            }
          }
        }
      });

    }

    tree.overwrite('package.json', JSON.stringify(pkgJson, null, 2));
    return tree;

  } else {
    _context.logger.log('error', `⚠️️ Not an npm project. Couldn't find package.json`);
  }
}
