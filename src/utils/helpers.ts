import { SchematicContext, Tree } from '@angular-devkit/schematics';
import { Files, HuskyHook, PkgJsonScript } from './interface';

function sortObjectByKeys(obj: any) {
  return Object.keys(obj)
    .sort()
    .reduce((result: any, key) => {
      result[key] = obj[key];
      return result;
    }, {});
}

export function addFilesToProject(tree: Tree, _context: SchematicContext, files: Files) {
  files.forEach(file => {
    if (tree.exists(file.path)) {
      tree.overwrite(file.path, file.content);
      _context.logger.log('info', `✅ Overwritten ${file.path}`);
    } else {
      tree.create(file.path, file.content);
      _context.logger.log('info', `✅ Created ${file.path}`);
    }
  });
  return tree;
}

export function addHuskyHooks(_context: SchematicContext, pkgJson: any, huskyHooks: HuskyHook[]) {
  if (!pkgJson.husky) pkgJson.husky = {};
  if (!pkgJson.husky.hooks) pkgJson.husky.hooks = {};
  huskyHooks.forEach(huskyHook => {
    if (!pkgJson.husky.hooks[huskyHook.hook]) {
      pkgJson.husky.hooks[huskyHook.hook] = huskyHook.cmd;
      _context.logger.log('info', `✅️ Added into package.json: husky hook "${huskyHook.hook}":"${huskyHook.cmd}"`);
    } else {
      if (!pkgJson.husky.hooks[huskyHook.hook].includes(huskyHook.cmd)) {
        pkgJson.husky.hooks[huskyHook.hook] = `${huskyHook.cmd} && ${pkgJson.husky.hooks[huskyHook.hook]}`;
        _context.logger.log('info', `✅️ Prepended in package.json: existing husky hook "${huskyHook.hook}" with "${huskyHook.cmd}"`);
      } else {
        _context.logger.log('info', `✅️ Existing husky hook "${huskyHook.hook}" already has "${huskyHook.cmd}", skipping this step`);
      }
    }
  });
}

export function addDependencies(_context: SchematicContext, pkgJson: any, depsType: string, dependencies: any[]) {
  if (!pkgJson[depsType]) pkgJson[depsType] = {};
  dependencies.forEach(dep => {
    pkgJson[depsType][dep.pkgName] = dep.version;
    _context.logger.log('info', `✅️ Added into ${depsType}: "${dep.pkgName}":"${dep.version}"`);
  });
  pkgJson[depsType] = sortObjectByKeys(pkgJson[depsType]);
}

export function addScripts(_context: SchematicContext, pkgJson: any, pkgJsonScripts?: PkgJsonScript[]) {
  if (pkgJsonScripts !== undefined && pkgJsonScripts.length) {
    if (!pkgJson.scripts) pkgJson.scripts = {};
    pkgJsonScripts.forEach(script => {
      if (script.npmScriptKey === "preinstall") {
        if (pkgJson.scripts[script.npmScriptKey] && pkgJson.scripts[script.npmScriptKey].includes(script.npmScriptValue)) {
          pkgJson.scripts[script.npmScriptKey] = `${script.npmScriptValue} && ${pkgJson.scripts[script.npmScriptKey]}`;
        } else {
          pkgJson.scripts[script.npmScriptKey] = script.npmScriptValue;
        }
      } else {
        pkgJson.scripts[script.npmScriptKey] = script.npmScriptValue;
      }
      _context.logger.log('info', `✅️ Added into scripts: "${script.npmScriptKey}":"${script.npmScriptValue}"`);
    });
  }
}
