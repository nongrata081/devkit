# devkit schematics usage
Install angular schematics globally
```
yarn global add @angular-devkit/schematics-cli
```

# Getting Started With Schematics

This repository is a basic Schematic implementation that serves as a starting point to create and publish Schematics to NPM.

### Testing

To test locally, install `@angular-devkit/schematics-cli` globally and use the `schematics` command line tool. That tool acts the same as the `generate` command of the Angular CLI, but also has a debug mode.

Check the documentation with
```bash
schematics --help
```

### Unit Testing

`npm run test` will run the unit tests, using Jasmine as a runner and test framework.

### Publishing

To publish, simply do:

```bash
npm run build
npm publish
```

## Building and testing locally

After cloning the project: 

```
npm i --ignore-scripts
```

You can publish the schematic locally to test against any Nx workspace using [verdaccio](https://www.npmjs.com/package/verdaccio):

```
npm i -g verdaccio
verdaccio  // to start the private local npm registry
```

1. Publish the schematic to `verdaccio` with the following:

```
npm run build
npm publish --registry http://localhost:4873
```

2. Setup a fresh Nx workspace to test with:

```
create-nx-workspace myworkspace
```

3. Open the workspace and add `.npmrc` to root with the following:

```
@nstudio:registry=http://localhost:4873
```

4. You can now install your schematic changes with:

```
npm i @nstudio/schematics -D --registry http://localhost:4873 --force
```

Anytime you make further changes to the schematic just rebuild/republish:

```
npm run build
npm publish --registry http://localhost:4873
// then repeat Step #4 to install latest 
```

If you get this error:

```
npm ERR! code EPUBLISHCONFLICT
npm ERR! publish fail Cannot publish over existing version.
npm ERR! publish fail Update the 'version' field in package.json and try again.
npm ERR! publish fail 
npm ERR! publish fail To automatically increment version numbers, see:
npm ERR! publish fail     npm help version
```

You can simply unpublish and publish like this:

```
npm unpublish --registry http://localhost:4873 --force
npm publish --registry http://localhost:4873
```

### Unit Tests

```
npm test
```

All tests must pass. Please add tests for any new functionality.

---

In order to test schematics locally in debug mode (without writing files) run
```
schematics .:schematicName
```

or in normal mode
```
schematics .:schematicName --debug=false
```
