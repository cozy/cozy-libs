# rslint-config-cozy-app

Shared [Rslint](https://rslint.rs) and `rs fmt` config for Cozy applications, run through the [Rstack](https://rstack.rs) CLI `rs`. It replaces `eslint-config-cozy-app` and prettier.

## Install

```sh
yarn add -D rstack rslint-config-cozy-app
```

Pin `rstack` to an exact version: it is not 1.0 yet.

## Usage

In `rstack.config.mjs`, at the root of the app:

```js
import { define } from 'rstack'
import fmt from 'rslint-config-cozy-app/fmt'
import react from 'rslint-config-cozy-app/react'

define.lint(lint => [
  { ignores: ['build/**'] },
  ...react(lint)
  // app overrides
])

define.fmt(fmt)
```

Then in `package.json`:

```json
"fmt": "rs fmt '{src,test}/**/*.{js,jsx,ts,tsx}'",
"lint": "rs lint src test && rs fmt --check '{src,test}/**/*.{js,jsx,ts,tsx}'"
```

`define.lint()` passes every export of `rstack/lint` (`js`, `ts`, `reactPlugin`, `globals`, …) to its callback. The presets are functions of that object, so this package does not depend on `rstack`.

## Exports

- `rslint-config-cozy-app/basics`, also exported by `rslint-config-cozy-app`:
  - `default`: function returning the config for JavaScript code (core, promise, import and jest rules);
  - `importOrderOptions`: the options of the `import/order` rule;
  - `noUnusedVarsOptions`: the options of the `no-unused-vars` rules;
  - `testFiles`: the globs of test files (`*.spec.*`, `*.test.*` and the files under `__tests__/`).
- `rslint-config-cozy-app/react`: function returning `basics` plus the React, React Hooks, React Compiler and type-aware TypeScript rules. The React rules apply to `.js`, `.jsx` and `.tsx` files. The TypeScript rules apply to `.ts`, `.tsx`, `.mts` and `.cts` files, with `projectService: true`.
- `rslint-config-cozy-app/fmt`: the formatting options for `define.fmt()`.

## Extend `import/order`

Spread `importOrderOptions` and rebuild `pathGroups`:

```js
import { importOrderOptions } from 'rslint-config-cozy-app/basics'

define.lint(lint => [
  ...react(lint),
  {
    rules: {
      'import/order': [
        'warn',
        {
          ...importOrderOptions,
          pathGroups: [
            { pattern: '**/*.styl', group: 'index', position: 'after' },
            ...importOrderOptions.pathGroups,
            { pattern: 'components/**/*', group: 'index' }
          ]
        }
      ]
    }
  }
])
```

The first path group that matches an import wins. Put specific groups such as `**/*.styl` before `...importOrderOptions.pathGroups`, or `@/x.styl` falls into the `@/**` group.

## Differences with eslint-config-cozy-app

- Rslint does not implement these rules, which are no longer checked:
  - `prettier/prettier`: run `rs fmt --check` instead;
  - `spaced-comment` and `import/no-extraneous-dependencies`.
- Rslint implements only `react-hooks/rules-of-hooks` and `react-hooks/exhaustive-deps`, and reserves the `react-hooks` prefix. The React Compiler rules of eslint-plugin-react-hooks 7 (`static-components`, `refs`, `set-state-in-effect`, `immutability`, `purity`, …) run as a JS plugin under the `react-compiler` prefix:
  - rename them in disable comments, e.g. `// eslint-disable-next-line react-compiler/set-state-in-effect`;
  - they run in JavaScript, so they take most of the lint time.
- Rslint skips unknown rules without any warning: check that the rules of an app config exist on [rslint.rs](https://rslint.rs).
- Rslint ignores `react/jsx-uses-react`, so `no-unused-vars` ignores a variable named `React`.
- The jest rules only apply to test files (`testFiles`): elsewhere, Rslint takes a regex `.test()` call for a test without a body. In a test file, disable the rule on that line with a comment giving the reason.
- `import/order`:
  - eslint-plugin-import could not resolve the `@/` alias and sorted it last; the `@/**` path group keeps that order;
  - Rslint sorts `./x` before `../x`;
  - `rs lint --fix` moves an import without the comment above it, such as a `// @ts-expect-error`, and can leave two blank lines: check the diff and run `rs fmt` after it.
- A rule can be reported on another line than with ESLint, so an `eslint-disable-line` comment may have to move. Rslint honours `eslint-disable` comments.
- Type-aware rules run on typescript-go (TypeScript 7):
  - it no longer includes every `@types` package by default: list the global types, such as `"types": ["jest", "node"]`, in the tsconfig of the files that need them;
  - with `parserOptions.project`, it does not resolve imports into a project reference that is not built: keep `projectService: true`;
  - `@typescript-eslint/no-unnecessary-type-assertion` reports more cases than with TypeScript 5. Check each removal with `tsc`: an assertion on the `initialState` of a Redux slice sets the state type the slice infers, and is not unnecessary.
- `rs fmt`:
  - it runs prettier with the SWC parser, and formats a few constructs differently, such as multi-line unions;
  - it does not read `.prettierrc` or `.prettierignore`: port the ignores to the `ignorePatterns` option of `define.fmt()`.
- A JS plugin, such as `@tanstack/eslint-plugin-query`, may load `eslint` through `@typescript-eslint/utils`: keep `eslint` installed for it.
- `eslint-plugin-react-hooks` declares `eslint` up to 9 as a peer dependency, but does not load it. Without `eslint` in the app, yarn warns about the missing peer, and npm installs `eslint` 9 under the plugin. With `eslint` 10 in an npm app, add `"overrides": { "eslint": "$eslint" }` to `package.json` to avoid a second copy.
