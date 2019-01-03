<h1 align="center">Cozy URLs</h1>

<div align="center">
  <a href="https://www.npmjs.com/package/cozy-urls">
    <img src="https://img.shields.io/npm/v/cozy-urls.svg" alt="npm version" />
  </a>
  <a href="https://github.com/cozy/cozy-urls/blob/master/LICENSE">
    <img src="https://img.shields.io/npm/l/cozy-urls.svg" alt="license" />
  </a>
  <a href="https://travis-ci.org/cozy/cozy-urls">
    <img src="https://img.shields.io/travis/cozy/cozy-urls.svg" alt="travis" />
  </a>
  <a href="https://npmcharts.com/compare/cozy-urls">
    <img src="https://img.shields.io/npm/dm/cozy-urls.svg" alt="npm downloads" />
  </a>
  <a href="https://david-dm.org/cozy/cozy-urls">
    <img src="https://img.shields.io/david/cozy/cozy-urls.svg" alt="david-dm" />
  </a>
  <a href="https://david-dm.org/cozy/cozy-urls">
    <img src="https://img.shields.io/david/dev/cozy/cozy-urls.svg" alt="david-dm" />
  </a>
  <a href="https://renovateapp.com/">
    <img src="https://img.shields.io/badge/renovate-enabled-brightgreen.svg" alt="renovate" />
  </a>
</div>

</br>

# What's cozy-urls?

Get a uniform formatted URL and SSL information according to a provided URL

## Setup

### Install

`npm install --save cozy-urls`
or
`yarn add cozy-urls`

## API

#### `getCozyURL`

This function return the `cozyURL`. On browser this information come from
[index.ejs](). On node this information comes from `COZY_URL` env variable.

Here is an example:

```javascript
import { getCozyURL } from 'cozy-urls'

const cozyURL = getCozyURL() // http://cozy.tools:8080
```

#### `getCozyDomain`

This function return the `cozyDomain`.

Here is an example:

```javascript
import { getCozyDomain } from 'cozy-urls'

const cozyDomain = getCozyDomain() // cozy.tools:8080
```

#### `getProtocol`

This function return the `protocol` (`http:` or `https:`).

Here is an example:

```javascript
import { getProtocol } from 'cozy-urls'

const protocol = getProtocol() // http:
```

#### `isSSL`

This function return a boolean if the `protocol` is secure.

Here is an example:

```javascript
import { isSSL } from 'cozy-urls'

const protocolIsSecure = isSSL() // false
```


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

### Maintainers

The maintainers for Cozy cozy-urls are [CPatchane](https://github.com/cpatchane) and [kosssi](https://github.com/kosssi)!

## License

`cozy-urls` is distributed under the MIT license.
