import { Tree } from '@angular-devkit/schematics';
import {SchematicTestRunner} from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');
const runner = new SchematicTestRunner('schematics', collectionPath);
let tree: any;

describe('enforce yarn', () => {
  beforeEach(() => {
    tree = runner.runSchematic('enforce-yarn', {}, Tree.empty());
  });
  it('works', () => {
    expect(tree.files.length).toEqual(1);
  });
});
