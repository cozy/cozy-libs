<h1 align="center">Babel Preset Cozy App</h1>

<div align="center">
  <a href="https://www.npmjs.com/package/babel-preset-cozy-app">
    <img src="https://img.shields.io/npm/v/babel-preset-cozy-app.svg" alt="npm version" />
  </a>
  <a href="https://github.com/cozy/cozy-libs/blob/master/packages/babel-preset-cozy-app/LICENSE">
    <img src="https://img.shields.io/npm/l/babel-preset-cozy-app.svg" alt="license" />
  </a>
  <a href="https://npmcharts.com/compare/babel-preset-cozy-app">
    <img src="https://img.shields.io/npm/dm/babel-preset-cozy-app.svg" alt="npm downloads" />
  </a>
  <a href="https://david-dm.org/cozy/cozy-libs?path=packages/babel-preset-cozy-app">
    <img src="https://david-dm.org/cozy/cozy-libs/status.svg?path=packages/babel-preset-cozy-app" alt="david-dm" />
  </a>
  <a href="https://renovateapp.com/">
    <img src="https://img.shields.io/badge/renovate-enabled-brightgreen.svg" alt="renovate" />
  </a>
</div>

### What's babel-preset-cozy-app?

A shareable configuration for Cozy Applications or Scripts.

This package is a Babel preset already used by [`create-cozy-app`](https://github.com/CPatchane/create-cozy-app).

To install:

```
yarn add --dev babel-preset-cozy-app
```

### Usage with a Create Cozy App projects

If you started your project using [`create-cozy-app`](https://github.com/CPatchane/create-cozy-app), you don't need to do anything, you should already have a `.babelrc` configured to used this preset.

### Usage with other projects

If you want to use this preset, you first need to have Babel installed (cf [documentation](https://babeljs.io/docs/setup/)).

Then, in a file named `.babelrc` (the Babel configuration file), you can use the preset using the following way:

```json
{
    "presets": ["cozy-app"]
}
```

### Options

#### `node` (boolean): `false` by default

By default, this babel preset targets browsers but you can target node by using the `node` option:

```json
{
    "presets": [
        ["cozy-app", {
            "node": true
        }]
    ]
}
```

#### `react` (boolean): `true` by default

By default, this babel preset uses the `react` preset ([`babel-preset-react`](https://babeljs.io/docs/plugins/preset-react/#top)) but you can disable this behaviour with the `react` option to `false` as following:

```json
{
    "presets": [
        ["cozy-app", {
            "react": false
        }]
    ]
}
```

#### `transformRegenerator` (boolean): `true` by default (for browsers only)

By default, this babel preset uses [`babel-plugin-transform-runtime`](https://babeljs.io/docs/en/babel-plugin-transform-runtime.html) to transform regenerator functions on the runtime. But sometimes (not always) it could break CSPs due to some eval usage so you can disable this behaviour with the `transformRegenerator` option to `false` as following:

```json
{
    "presets": [
        ["cozy-app", {
            "transformRegenerator": false
        }]
    ]
}
```

#### Preset and plugin options

You can have control on the options passed to `babel-preset-env` and `babel-plugin-transform-runtime`:

* `presetEnv` will be passed to `babel-preset-env`
* `transformRuntime` will be passed to `babel-plugin-transform-runtime`

```json
{
  "presets": [
    ["cozy-app", {
      "presetEnv": { "modules": false },
      "transformRuntime": { "helpers": true }
    }]
  ]
}
```

In this case, we do not want `preset-env` to touch to `import/export` and want the inlined Babel helpers
to be replaced by imports from `babel-runtime`.

See the options on the official docs :

https://babeljs.io/docs/en/babel-preset-env#modules
https://babeljs.io/docs/en/babel-plugin-transform-runtime#helpers 

## Community

### What's Cozy?

<div align="center">
  <a href="https://cozy.io">
    <img src="https://cdn.rawgit.com/cozy/cozy-site/master/src/images/cozy-logo-name-horizontal-blue.svg" alt="cozy" height="48" />
  </a>
 </div>
 </br>

[Cozy] is a platform that brings all your web services in the same private space.  With it, your webapps and your devices can share data easily, providing you with a new experience. You can install Cozy on your own hardware where no one's tracking you.

### Get in touch

You can reach the Cozy Community by:

- Chatting with us on IRC [#cozycloud on Freenode][freenode]
- Posting on our [Forum][forum]
- Posting issues on the [Github repos][github]
- Say Hi! on [Twitter][twitter]


## License

`babel-preset-cozy-app` is distributed under the MIT license.


[cozy]: https://cozy.io "Cozy Cloud"
[freenode]: http://webchat.freenode.net/?randomnick=1&channels=%23cozycloud&uio=d4
[forum]: https://forum.cozy.io/
[github]: https://github.com/cozy/
[twitter]: https://twitter.com/cozycloud
