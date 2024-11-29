<h1 align="center">Rsbuild Config Cozy App</h1>

## What's rsbuild-config-cozy-app?

An opinionated configurations for [Rsbuild](https://rsbuild.dev/) to build Cozy Applications.

The project should follow the structure of Cozy Applications. You can get an example inside [cozy-app-template](https://github.com/cozy/cozy-app-template)

To complete the build, you can add :

- eslint with eslint-cozy-app configuration to lint your application
- jest for your unit test

## Quick Start

To install:

```bash
yarn add @rsbuild/core rsbuild-config-cozy-app -D
```

Create a config file named `rsbuild.config.mjs` with the following content:

```javascript
import { defineConfig } from '@rsbuild/core'
import { getRsbuildConfig } from 'rsbuild-config-cozy-app'

const config = getRsbuildConfig({
  title: 'Your application name',
  hasServices: true
})

export default defineConfig(config)
```

Add `scripts` inside your `package.json` file as follows:

```json
"scripts": {
  "build": "rsbuild build",
  "watch": "rsbuild build --watch",
  "analyze": "RSDOCTOR=true yarn build"
}
```

You can now access your application using the [cozy-stack](https://github.com/cozy/cozy-stack)

## Best Practices

- Keep extensions into import for all the file that's are not `.js` or `.ts`, especially for `.styl` files.
- Place any files that need to be included in the build package but are not used in the React build inside the root `public` folder. This ensures that these files are copied into a assets folder. If it needs to be used inside a public context you just need to add
  ```
    "/assets": {
      "folder": "/assets",
      "public": true
    }
  ```
- Use a common alias like `@/` for `./src`. You can put it into your `tsconfig.json`

## Migrating from cozy-scripts

### Install dependencies

Run the following command to install the necessary dependencies:

```bash
yarn add @rsbuild/core rsbuild-config-cozy-app -D
```

### Create a configuration file

Create a file named `rsbuild.config.mjs` in your project directory with the following content:

```javascript
import { defineConfig } from '@rsbuild/core'
import { getRsbuildConfig } from 'rsbuild-config-cozy-app'

const config = getRsbuildConfig({
  title: 'Your application name',
  hasServices: true
})

export default defineConfig(config)
```

### Update Scripts in package.json

Modify the `scripts` section in your `package.json` file as follows:

```json
"scripts": {
  "build": "rsbuild build",
  "watch": "rsbuild build --watch",
  "analyze": "RSDOCTOR=true yarn build"
}
```

### Migrate Assets

Move assets that are not used in the React build to the `/public` directory. This directory will be copied to a public folder. For example, move assets from `/src/targets/vendor/assets` to `/public`. Ensure the `/public` directory exists. By default, Rsbuild copies the content of the public directory to the `distPath`. To comply with cozy-stack constraints, disable this behavior and copy the public directory to a separate folder called `assets` so it can be shared between public and private.

### Update index.ejs

Remove all references to webpack in your `index.ejs` file. Here is an example of an updated `index.ejs`:

```html
<!DOCTYPE html>
<html lang="{{.Locale}}">
<head>
  <meta charset="utf-8">
  <title><%= htmlPlugin.options.title %></title>
  <link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-touch-icon.png">
  <link rel="icon" type="image/png" href="/assets/favicon-32x32.png" sizes="32x32">
  <link rel="icon" type="image/png" href="/assets/favicon-16x16.png" sizes="16x16">
  <link rel="manifest" href="/assets/manifest.json" crossorigin="use-credentials">
  <link rel="mask-icon" href="/assets/safari-pinned-tab.svg" color="#297EF2">
  <meta name="color-scheme" content="light dark" />
  <meta name="theme-color" content="#ffffff">
  <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1, viewport-fit=cover">
  <link rel="stylesheet" type="text/css" href="//{{.Domain}}/assets/fonts/fonts.css">
  {{.ThemeCSS}}
</head>
<body>
  <div role="application" data-cozy="{{.CozyData}}"></div>
</body>
</html>
```

### Step-by-Step Changes

1. Change `<title><%= htmlWebpackPlugin.options.title %></title>` to `<title><%= htmlPlugin.options.title %></title>`.
2. Remove `_.forEach` for importing CSS and JS files, as RSBuild handles this directly.
3. Import fonts using `<link rel="stylesheet" type="text/css" href="//{{.Domain}}/assets/fonts/fonts.css">`.
4. Prefix assets import with `/assets`

### Define Aliases

Ensure all aliases are defined in the `tsconfig.json`.

### Handling public targets

If your app have a public target, you need to declare the assets as public route inside your manifest.webapp :

```javascript
     "/assets": {
        "folder": "/assets",
        "public": true
    }
```

**Note :** You can found more info into the cozy-stack [documentation](https://github.com/cozy/cozy-stack/blob/2cbb312271732663e18802079870747e3a03d03e/docs/apps.md?plain=1#L51)

### Add packages used through cozy-scripts

The package `identity-obj-proxy` is used inside jest config to mock css module file

```bash
yarn add identity-obj-proxy --dev
```
