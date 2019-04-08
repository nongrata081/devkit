// import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
// import { createEmptyNpmProject } from '../utils';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';
import { Schema as ApplicationOptions } from '@schematics/angular/application/schema';

const workspaceOptions: WorkspaceOptions = {
  name: 'workspace',
  newProjectRoot: 'projects',
  version: '6.0.0'
};
const appOptions: ApplicationOptions = {
  name: 'bar',
  inlineStyle: false,
  inlineTemplate: false,
  routing: false,
  skipTests: false,
  skipPackageJson: false
};

const collectionPath = path.join(__dirname, '../collection.json');
const runner = new SchematicTestRunner('schematics', collectionPath);
let appTree: UnitTestTree;
let tree: any;
let packageJsonObj: any;

describe('Schematic: gitflow', () => {

  beforeEach(() => {
    appTree = runner.runExternalSchematic(
        '@schematics/angular',
        'workspace',
        workspaceOptions
    );
    appTree = runner.runExternalSchematic(
        '@schematics/angular',
        'application',
        appOptions,
        appTree
    );
    tree = runner.runSchematic('gitflow', {}, appTree);
    packageJsonObj = JSON.parse(tree.readContent('/package.json'));
  });

  it('should create devDependencies in package.json', () => {
    expect(packageJsonObj.devDependencies.husky).toEqual("latest");
    expect(packageJsonObj.devDependencies["enforce-gitflow-branches"]).toEqual("latest");
  });

  it('should add enforce:gitflow script to scripts in package.json', () => {
    expect(packageJsonObj.scripts["enforce:gitflow"]).toEqual("node ./node_modules/.bin/enforce-gitflow-branches");
  });

  it('should add pre-push script to husky.hooks in package.json', () => {
    expect(packageJsonObj.husky.hooks["pre-push"]).toEqual("npm run enforce:gitflow");
  });
});
