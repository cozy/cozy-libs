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

#### `getProps(cozyURL, sslOption)`

This function will parse the `cozyURL` provided and use the provided `sslOption` to return props in an object with the following properties:

- `url`: the full URL with the protocol
- `host`: just the host name (no protocol)
- `ssl`: a boolean, `true` if SSL is used (https) or `false` if not (http)

Here is an example:

```javascript
import cozyURLs from 'cozy-urls'

const myUrlProps = cozyURLs.getProps('cozy.tools:8080' ,false)
/*
{
  url: 'http://cozy.tools:8080',
  host: 'cozy.tools:8080',
  ssl: false
}
*/
```

#### `setAppName(name)` (optional but recommended)

This function allow you to specify a name to display with error or warnig messages for better debugging and issue searching. Many libs can use this library at the same time, it's better to know which one is concerned when working on it.

> The default name will be `The app`.

Here is an example:

```javascript
import cozyURLs from 'cozy-urls'

cozyURLs.setAppName('myapp')
// nothing change for the rest of usage
const myUrlProps = cozyURLs.getProps('cozy.tools:8080' ,false)
/*
{
  url: 'http://cozy.tools:8080',
  host: 'cozy.tools:8080',
  ssl: false
}
*/
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

The maintainers for Cozy Realtime are [CPatchane](https://github.com/cpatchane)!

## License

`cozy-urls` is distributed under the MIT license.
