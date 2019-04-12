<h1 align="center">Cozy Release</h1>

<div align="center">
  <a href="https://www.npmjs.com/package/cozy-release">
    <img src="https://img.shields.io/npm/v/cozy-release.svg" alt="npm version" />
  </a>
  <a href="https://github.com/cozy/cozy-release/blob/master/LICENSE">
    <img src="https://img.shields.io/npm/l/cozy-release.svg" alt="license" />
  </a>
  <a href="https://travis-ci.org/cozy/cozy-release">
    <img src="https://img.shields.io/travis/cozy/cozy-release.svg" alt="travis" />
  </a>
  <a href="https://npmcharts.com/compare/cozy-release">
    <img src="https://img.shields.io/npm/dm/cozy-release.svg" alt="npm downloads" />
  </a>
  <a href="https://david-dm.org/cozy/cozy-release">
    <img src="https://img.shields.io/david/cozy/cozy-release.svg" alt="david-dm" />
  </a>
  <a href="https://david-dm.org/cozy/cozy-release">
    <img src="https://img.shields.io/david/dev/cozy/cozy-release.svg" alt="david-dm" />
  </a>
  <a href="https://renovateapp.com/">
    <img src="https://img.shields.io/badge/renovate-enabled-brightgreen.svg" alt="renovate" />
  </a>
</div>

</br>

# What's cozy-release?

`cozy-release` is a tool that helps you to create new releases and beta of your library.
Once `cozy-release` successfully created a tag for your release, all you need to do is to go on github and publish it.

## Setup

### Install

Dependencies:

- [jq](https://stedolan.github.io/jq/)

`npm install --save cozy-release`
or
`yarn add cozy-release`

## How to use it

Existing commands and options are detailed in the help:

```
cozy-release --help
```

**Warning:** Note that `cozy-release` uses `x.y.z` format. If your app previously used `vx.y.z` format, you will need to manually create a tag that matches the right format:

```
git checkout vx.y.z
git tag -a x.y.z
```

**Warning:** When you create a patch using `cozy-release patch 1.0.0`, It will create the patch branch from the version you have given. It may be inconvenient if you try to create a release for an app that is still in beta. In this case, you will need to rebase master afterwards.

## Community

### What's Cozy?

<div align="center">
  <a href="https://cozy.io">
    <img src="https://cdn.rawgit.com/cozy/cozy-site/master/src/images/cozy-logo-name-horizontal-blue.svg" alt="cozy" height="48" />
  </a>
 </div>
 </br>

[Cozy] is a platform that brings all your web services in the same private space. With it, your webapps and your devices can share data easily, providing you with a new experience. You can install Cozy on your own hardware where no one's tracking you.

### Get in touch

You can reach the Cozy Community by:

- Chatting with us on IRC [#cozycloud on Freenode][freenode]
- Posting on our [Forum][forum]
- Posting issues on the [Github repos][github]
- Say Hi! on [Twitter][twitter]

### Maintainers

The maintainers for Cozy Release are [Gregory](https://github.com/gregorylegarec) and [CPatchane](https://github.com/cpatchane) !

## License

`cozy-release` is distributed under the MIT license.
