import { chain, noop, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { changelog } from '../changelog';
import { gitflow } from '../gitflow/index';
import { commitlint } from '../commitlint';
import { commitprompt } from '../commitprompt';
import { enforceYarn } from '../enforce-yarn';
import { node } from '../node/index';
import { recommendedBump } from '../recommended-bump/index';
import { gitStandup } from '../git-standup';
import { jsonServer } from '../json-server/index';
import { compodoc } from '../compodoc';
import { lighthouse } from '../lighthouse';

export default function (_options: any): Rule {
  // @ts-ignore
  return (tree: Tree, _context: SchematicContext) => {

    const chains = [
      _options.tools.indexOf("commit:lint") > -1 ? commitlint({}) : noop(),
      _options.tools.indexOf("commit:prompt") > -1 ? commitprompt({}) : noop(),
      _options.tools.indexOf("generate:changelog") > -1 ? changelog({}) : noop(),
      _options.tools.indexOf("recommended:version:bump") > -1 ? recommendedBump({}) : noop(),
      _options.tools.indexOf("enforce:gitflow") > -1 ? gitflow({}) : noop(),
      _options.tools.indexOf("enforce:yarn") > -1 ? enforceYarn({}) : noop(),
      _options.tools.indexOf("enforce:node:version") > -1 ? node({}) : noop(),
      _options.tools.indexOf("git:standup") > -1 ? gitStandup({}) : noop(),
      _options.tools.indexOf("json:server") > -1 ? jsonServer({}) : noop(),
      _options.tools.indexOf("compodoc") > -1 ? compodoc({}) : noop(),
      _options.tools.indexOf("lighthouse") > -1 ? lighthouse({}) : noop()
    ];

    return chain(chains);
  };
}

