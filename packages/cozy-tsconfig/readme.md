<h1 align="center"><a href="https://cozy.io/"><img alt="Cozy" src="https://cozy.io/fr/images/cozy-logo-name-horizontal-blue.svg"></a>&nbsp;TypeScript Configuration</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/cozy-tsconfig" target="_blank"><img alt="npm" src="https://img.shields.io/npm/v/cozy-tsconfig"></a>
  <a href="https://github.com/cozy/cozy-libs/blob/feat--Add-cozy-tsconfig-lib/LICENSE"><img alt="GitHub" src="https://img.shields.io/github/license/cozy/cozy-libs"></a>
</p>

> Shared [TypeScript config](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) for Cozy projects.

## 🖥️ Install

```sh
yarn add --dev cozy-tsconfig
```

*This config requires TypeScript 4.5 or later*

## 📦 What's included by default

- \[x] `strict` mode is enabled.
- \[x] Only emit declaration files, no transpiling, you need Babel or another transpiler to do that.
- \[x] JavaScript files are not ignored, meaning automatic declaration files *will* be emitted for them.
- \[x] `jsx` is supported and set to `react`.

## 🚀 Usage

### Typechecking in the IDE

The basic usage is to extend the configuration file to have Typechecking in your IDE.<br/>

To use it, create a `tsconfig.json` file in the root of your project and extend the configuration. Please note that you have to provide paths to your source and output directories, as it can not be provided by the configuration file itself.<br/>

Here is an example where your work is in `src` and `test` and your output is in `dist`.
Obviously, you don't want to typecheck `dist` files so you ignore them alongside `node_modules` or anything else unwanted.

```json
{
  "extends": "cozy-tsconfig",
  "include": ["src/**/*", "test/**/*"],
  "exclude": [
    "node_modules",
    "dist"
  ]
}
```

### Typechecking in the CI/CD pipeline (optional)

If you want to use TypeScript in your CI/CD pipeline (for instance if you just run linter and tests without building yet), you can use the following script to check your codebase:

```json
{
  "scripts": {
    "typecheck": "yarn tsc --noEmit"
  }
}
```

### Emit declaration files (useful for libraries)

To emit declaration files, create a **new** file in the root of your project, for instance `tsconfig-build.json`.<br/>

This file will be used to emit declarations, it will extend the base config but only include the files you want to actually emit declarations for.<br/>

Here is a basic example of what you can do:

```json
{
  "extends": "./tsconfig.json",
  "include": [
    "src/**/*",
  ],
  "exclude": [
    "**/*.spec.js",
    "**/*.spec.jsx",
    "**/*.spec.ts",
    "**/*.spec.tsx",
    "**/*.test.js"
    "**/*.test.jsx",
    "**/*.test.ts",
    "**/*.test.tsx",
    "tests"
  ]
}
```

Following the example above where we typechecked our tests, we now only emit declaration files for the `src` directory, and we ignore all test files. We don't want to emit declaration files for our tests, as they are not part of the public API of our library.<br/>

Then, you can use the following scripts to build your project and your declarations in sequence:

```json
{
  "scripts": {
    "build": "yarn build:js && yarn build:types",
    "build:js": "babel ./src -d ./dist",
    "build:types": "yarn tsc -p tsconfig-build.json"
  }
}
```

This will use the build config to emit declaration files (the build config ignores test files and won't emit declaration files for them). As mentionned earlier, TypeScript will not transpile your code, so you need to use another tool to do that. In this example, we used Babel to transpile our code.<br/>

Do not forget to update your `package.json` accordingly. You need to point to the `dist` directory for the `main` field, and to the `dist/index.d.ts` file for the `types` field (assuming your build directory is called `dist`).

```json
{
  "name": "my-cozy-package",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts"
}
```

### Overriding the configuration

If the provided configuration file don't exactly fit your needs, you can override it.<br/>

For example, if you want to disable strict mode, you can do:

```json
{
  "extends": "cozy-tsconfig",
  "compilerOptions": {
    "strict": false
  }
}
```

Please refer to the [TypeScript documentation](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) for more information.

## 💡 Recommendations

- Keep [eslint-config-cozy-app](https://github.com/cozy/cozy-libs/blob/master/packages/eslint-config-cozy-app/README.md) as up-to-date as possible. While it's not a direct dependency of this package, it's recommended to use it to keep your codebase consistent with the rest of the Cozy ecosystem. It will add a lot of TypeScript checks to your codebase that aren't handled by TypeScript itself.

- Don't hesitate to start adding TypeScript files to a 100% JavaScript project. It's a great way to start using TypeScript without having to rewrite everything at once. You can also start by adding TypeScript files to your tests, as they are not part of the public API of your library and won't be transpiled.

- If you struggle with typings errors, you can use the `@ts-expect-error`, `@ts-ignore` or even `@ts-nocheck` directives to ignore them on a line/file basis. Please refer to the [TypeScript documentation](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-9.html#-ts-expect-error-comments) for more information. Alternatively, you can use the `@ts-check` directive to enable typechecking for a file, and disable it for the rest of the project by adding `"checkJs": false` to your `tsconfig.json` file. Ultimately, try to fix the errors, as they are there for a reason, but practically, each project will have its own needs so it's up to you to decide what's best for it.

- For pure TypeScript files, it is recommended to fix every type error and stick to strict mode, otherwise it defeats the purpose of using TypeScript in the first place.

## 📝 License

Copyright © 2023 [Cozy.io](https://cozy.io/).<br/>

This project is [MIT](https://github.com/cozy/cozy-libs/blob/feat--Add-cozy-tsconfig-lib/packages/cozy-tsconfig/readme.md) licensed.
