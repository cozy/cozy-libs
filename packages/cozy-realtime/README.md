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
import CozyRealtime from 'cozy-realtime'

const realtime = new CozyRealtime({ cozyClient })
const type = 'io.cozy.accounts'
const id = 'document_id'
const handlerCreate = accounts => {
  console.log(`A new 'io.cozy.accounts' is created with id '${accounts._id}'.`)
}
const handlerUpdate = accounts => {
  console.log(`An account is updated with id '${accounts._id}'.`)
}

// To subscribe
await realtime.subscribe('created', type, handlerCreate)
await realtime.subscribe('updated', type, handlerUpdate)
await realtime.subscribe('updated', type, id, handlerUpdate)

// To unsubscribe
await realtime.unsubscribe('created', type, handlerCreate)
await realtime.unsubscribe('updated', type, handlerCreate)
await realtime.unsubscribe('updated', type, id, handlerCreate)

// To unsubscribe all
await realtime.unsubscribeAll()
```

## License

`cozy-realtime` is distributed under the MIT license.
