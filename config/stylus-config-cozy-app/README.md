<h1 align="center">Stylus Config Cozy App</h1>

## What's rsbuild-config-cozy-app?

An opinionated configurations for [Stylus](https://stylus-lang.com/) to build Cozy Applications.

## Quick Start

To install:

```bash
yarn add -D stylus-config-cozy-app
```

Add `scripts` inside your `package.json` file as follows:

```json
"scripts": {
  "lint:styles": "stylint src --config ./node_modules/stylus-config-cozy-app/.stylintrc"
}
```

You can now lint your application's stylus files using `yarn lint:styles`
