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

## API

#### `subscribeAll(config, doctype, parse)`

This method allow you to subscribe to realtime for all documents of a provided doctype. Here are the parameters:

- `config`: a config object with the following keys :
  - `domain`: the instance domain (ex: `cozy.works`, `cozy.tools:8080`), must be provided if `url` is not set
  - `token`: the cozy token (ex: the global `cozy.client._token.token`)
  - `url`: the cozy url (ex: https://recette.cozy.works), must be provided if `domain` is not set
  - `secure`: a boolean indicating if a secure protocol must be used (default `true`). Should not be provided along `url`.
- `doctype`: the doctype to subscribe (ex: `io.cozy.accounts`)
- `parse`: a custom function to be use as parser for your resulting documents (default: `doc => doc`)

Here is an example:

```javascript
import realtime from 'cozy-realtime'

const subscription = await realtime.subscribeAll(cozy.client, 'io.mocks.mydocs')

// your code when a new document is created
subscription.onCreate(doc => doSomethingOnCreate(doc))
// your code when a document is updated
subscription.onUpdate(doc => doSomethingOnUpdate(doc))
// your code when a document is deleted
subscription.onDelete(doc => doSomethingOnDelete(doc))

// Unsubscribe from realtime
subscription.unsubscribe()
```

#### `subscribe(config, doctype, doc, parse)`

This method is exactly the same working as the previous `subscribeAll()` function but to listen only one document. Here are the parameters:

- `config`: a config object with the following keys :
  - `domain`: the instance domain (ex: `cozy.works`, `cozy.tools:8080`), must be provided if `url` is not set
  - `token`: the cozy token (ex: the global `cozy.client._token.token`)
  - `url`: the cozy url (ex: https://recette.cozy.works)
  - `secure`: a boolean indicating if a secure protocol must be used (default `true`). Should not be provided along `url`.
- `doctype`: the doctype to subscribe (ex: `io.cozy.accounts`)
- `doc`: the document to listen, it must be at least a JS object with the `_id` attribute of the wanted document (only the `_id` will be checked to know if this is the wanted document or not).
- `parse`: a custom function to be use as parser for your resulting documents (default: `doc => doc`)

Here is an example:

```javascript
import realtime from 'cozy-realtime'

const subscription = await realtime.subscribe(cozy.client, 'io.mocks.mydocs', myDoc)

// your code when your document is updated
subscription.onUpdate(doc => doSomethingOnUpdate(doc))
// your code when your document is deleted
subscription.onDelete(doc => doSomethingOnDelete(doc))

// Unsubscribe from realtime
subscription.unsubscribe()
```

### Maintainers

The maintainers for Cozy Realtime are [Greg](https://github.com/gregorylegarec) and [kosssi](https://github.com/kosssi) !

## License

`cozy-realtime` is distributed under the MIT license.
