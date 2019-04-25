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

#### `subscribe(config, doctype, options)`

This method allow you to subscribe to realtime for one document or all documents of a provided doctype. Here are the parameters:

- `config`: a config object with the following keys :
  - `domain`: the instance domain (ex: `cozy.works`, `cozy.tools:8080`), must be provided if `url` is not set
  - `token`: the cozy token (ex: the global `cozy.client._token.token`)
  - `url`: the cozy url (ex: https://recette.cozy.works)
  - `secure`: a boolean indicating if a secure protocol must be used (default `true`). Should not be provided along `url`.
- `doctype`: the doctype to subscribe (ex: `io.cozy.accounts`)
- `options`: an object to use optional parameters:
  - `docId`: a document `_id` attribute to target in order to get realtime only for this specific document
  - `parse`: a custom function to be use as parser for your resulting documents (default: `doc => doc`)

It will return a subscription object with `onCreate` (except if subscribing on specific document), `onUpdate` and `onDelete` methods.

Here is an example:

```javascript
import realtime from 'cozy-realtime'

const config = {
    token: authToken, // app token provided by the stack or the client
    domain: 'cozy.tools:8080',
    secure: true // to use wss (with SSL) or not
  }
const subscription = realtime.subscribe(config, 'io.mocks.mydocs')

// your code when a new document is created
subscription.onCreate(doc => doSomethingOnCreate(doc))
// your code when a document is updated
subscription.onUpdate(doc => doSomethingOnUpdate(doc))
// your code when a document is deleted
subscription.onDelete(doc => doSomethingOnDelete(doc))

// Unsubscribe all events from realtime
subscription.unsubscribe()

// for a specific document
const docSubscription = realtime.subscribe(config, 'io.mocks.mydocs')

// There is no onCreate here since to have the id,
// the document is already created

// your code when your document is updated
docSubscription.onUpdate(doc => doSomethingOnUpdate(doc))
// your code when your document is deleted
docSubscription.onDelete(doc => doSomethingOnDelete(doc))

// Unsubscribe all events from realtime
docSubscription.unsubscribe()
```

All `onCreate`, `onUpdate` and `onDelete` methods will return the subscription so you can chain the call like below:

```javascript
import realtime from 'cozy-realtime'

const config = {
    token: authToken, // app token provided by the stack or the client
    domain: 'cozy.tools:8080',
    secure: true // to use wss (with SSL) or not
  }
const subscription = realtime.subscribe(config, 'io.mocks.mydocs')
  // your code when a new document is created
  .onCreate(doc => doSomethingOnCreate(doc))
  // your code when a document is updated
  .onUpdate(doc => doSomethingOnUpdate(doc))
  // your code when a document is deleted
  .onDelete(doc => doSomethingOnDelete(doc))

// Unsubscribe all events from realtime
subscription.unsubscribe()
```

### Maintainers

The maintainers for Cozy Realtime are [Greg](https://github.com/gregorylegarec), [CPatchane](https://github.com/CPatchane) and [kosssi](https://github.com/kosssi) !

## License

`cozy-realtime` is distributed under the MIT license.
