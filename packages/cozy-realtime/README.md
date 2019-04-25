<h1 align="center">Cozy Realtime</h1>

<div align="center">
  <a href="https://www.npmjs.com/package/cozy-realtime">
    <img src="https://img.shields.io/npm/v/cozy-realtime.svg" alt="npm version" />
  </a>
  <a href="https://github.com/cozy/cozy-realtime/blob/master/LICENSE">
    <img src="https://img.shields.io/npm/l/cozy-realtime.svg" alt="license" />
  </a>
  <a href="https://travis-ci.org/cozy/cozy-realtime">
    <img src="https://img.shields.io/travis/cozy/cozy-realtime.svg" alt="travis" />
  </a>
  <a href="https://npmcharts.com/compare/cozy-realtime">
    <img src="https://img.shields.io/npm/dm/cozy-realtime.svg" alt="npm downloads" />
  </a>
  <a href="https://david-dm.org/cozy/cozy-realtime">
    <img src="https://img.shields.io/david/cozy/cozy-realtime.svg" alt="david-dm" />
  </a>
  <a href="https://david-dm.org/cozy/cozy-realtime">
    <img src="https://img.shields.io/david/dev/cozy/cozy-realtime.svg" alt="david-dm" />
  </a>
  <a href="https://renovateapp.com/">
    <img src="https://img.shields.io/badge/renovate-enabled-brightgreen.svg" alt="renovate" />
  </a>
</div>

<br />

# What's cozy-realtime?

A simple way to have realtime using Websocket with [cozy-stack](https://github.com/cozy/cozy-stack).

## Setup

### Install

`npm install --save cozy-realtime`
or
`yarn add cozy-realtime`

## Example

```js
import Realtime, { CREATE_EVENT } from 'cozy-realtime'

// Instanciate Realtime
const realtime = new Realtime(cozyClient)

const handler = doc => {
  console.log(`A new 'io.cozy.accounts' is created. '${doc._id}' is own _id.`)
}

// To subscribe
await realtime.subscribe({ type: 'io.cozy.accounts', eventName: CREATE_EVENT }, handler)

// To unsubscribe
await realtime.unsubscribe({ type: 'io.cozy.accounts', eventName: CREATE_EVENT }, handler)
// or
await realtime.unsubscribeAll()
```

### Maintainers

The maintainers for Cozy Realtime are [Greg](https://github.com/gregorylegarec), [CPatchane](https://github.com/CPatchane) and [kosssi](https://github.com/kosssi) !

## License

`cozy-realtime` is distributed under the MIT license.
