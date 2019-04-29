import { SchematicContext, Tree } from '@angular-devkit/schematics';
import { PkgJsonContent } from './interface';
import { addDependencies, addHuskyHooks, addScripts } from './helpers';

export function addContentToPackageJson(
  tree: Tree,
  _context: SchematicContext,
  content: PkgJsonContent
) {
  const pkgJsonBuffer =  tree.read("package.json");

  if (pkgJsonBuffer) {
    const pkgJson = JSON.parse(pkgJsonBuffer!.toString('utf-8'));

    // Scripts
    addScripts(_context, pkgJson, content.pkgJsonScripts);

    // Dependencies & DevDependencies
    if (content.pkgJsonDependencies) {
      if (content.pkgJsonDependencies.dependencies)
        addDependencies(_context, pkgJson, "dependencies", content.pkgJsonDependencies.dependencies);
      if (content.pkgJsonDependencies.devDependencies)
        addDependencies(_context, pkgJson, "devDependencies", content.pkgJsonDependencies.devDependencies);
    }

    // Custom Object
    if (content.customObj) {
      pkgJson[content.customObj.key] = content.customObj.value;
      _context.logger.log('info', `✅️ Added into package.json: custom object ${JSON.stringify(content.customObj.value)} to "${content.customObj.key}"`);
    }

    // Husky
    if (content.husky) addHuskyHooks(_context, pkgJson, content.husky.huskyHooks);

    tree.overwrite('package.json', JSON.stringify(pkgJson, null, 2));
    return tree;

  } else {
    _context.logger.log('error', `⚠️️ Not an npm project. Couldn't find package.json`);
  }
}
