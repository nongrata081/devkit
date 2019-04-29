/**
* Restrict using `npm` for installing packages
*/
if (process.env.npm_execpath.indexOf('yarn') === -1) {
  console.error(`
  
  This repo uses programmatic enforcing of yarn. Please use yarn to install dependencies:
    $ yarn install
  
  `);
  process.exit(1);
}
