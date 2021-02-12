<h1 align="center">Cozy Realtime</h1>

<div align="center">
  <a href="https://www.npmjs.com/package/cozy-realtime">
    <img src="https://img.shields.io/npm/v/cozy-realtime.svg" alt="npm version" />
  </a>
  <a href="https://github.com/cozy/cozy-libs/blob/master/LICENSE">
    <img src="https://img.shields.io/npm/l/cozy-realtime.svg" alt="license" />
  </a>
  <a href="https://travis-ci.org/cozy/cozy-realtime">
    <img src="https://img.shields.io/travis/cozy/cozy-realtime.svg" alt="travis" />
  </a>
  <a href="https://npmcharts.com/compare/cozy-realtime">
    <img src="https://img.shields.io/npm/dm/cozy-realtime.svg" alt="npm downloads" />
  </a>
  <a href="https://renovateapp.com/">
    <img src="https://img.shields.io/badge/renovate-enabled-brightgreen.svg" alt="renovate" />
  </a>
</div>

<br />

Subscribe to cozy-stack server side events [cozy-stack](https://github.com/cozy/cozy-stack) via Websocket.

### Install

```bash
npm install --save cozy-realtime`
yarn add cozy-realtime
```

### Example

CozyRealtime comes with a plugin for CozyClient. This is the recommended way to use it:

```js
import CozyClient from 'cozy-client'
import { RealtimePlugin } from 'cozy-realtime'

const client = new CozyClient({})
client.registerPlugin(RealtimePlugin)
realtime.subscribe('created', 'io.cozy.bank.accounts', handleBankAccountCreated)
realtime.unsubscribe('created', 'io.cozy.bank.accounts', handleBankAccountCreated)
```

### Inside a component

It is important to unsubscribe when unmounting React components.

```js

// Instantiation
import React, { Component } from 'react'
import { RealtimePlugin } from 'cozy-realtime'
import CozyClient, { withClient } from 'cozy-client'

const client = new CozyClient({})

client.registerPlugin(RealtimePlugin)

// Usage

const handleCreate = accounts => {
  console.log(`A new 'io.cozy.accounts' is created with id '${accounts._id}'.`)
}

const handleUpdate = accounts => {
  console.log(`An account is updated with id '${accounts._id}'.`)
}

class MyComp extends Component {

  constructor(props){
    super(props)
  }

  componentDidMount(){
    this.realtime = this.props.client.plugins.realtime
    if(this.realtime){
      // Listen to document creations
      await this.realtime.subscribe('created', type, this.handleCreate)
      //listen of the update for a type
      await this.realtime.subscribe('updated', type, this.handleUpdate)
      // Listen to a specific document
      await this.realtime.subscribe('updated', type, id, this.handleUpdate)
    }

  }

  componentWillUnmount(){
    if(this.realtime){
      // To unsubscribe
      await this.realtime.unsubscribe('created', type, handleCreate)
      await this.realtime.unsubscribe('updated', type, handleUpdate)
      await this.realtime.unsubscribe('updated', type, id, handleUpdate)

      // To unsubscribe all
      await this.realtime.unsubscribeAll()
    }
  }
}

export default withClient(MyComp)

```

### Subscribe to multiple events

Here we subscribe to

- The creation event
- The update of a single document

```js

import CozyRealtime from 'cozy-realtime'

const realtime = new CozyRealtime({ client: cozyClient })
const type = 'io.cozy.accounts'
const id = 'document_id'

const handleCreate = accounts => {
  console.log(`A new 'io.cozy.accounts' is created with id '${accounts._id}'.`)
}
const handleUpdate = accounts => {
  console.log(`An account is updated with id '${accounts._id}'.`)
}

// To subscribe
await realtime.subscribe('created', type, handleCreate)
await realtime.subscribe('updated', type, id, handleUpdate)

// To unsubscribe
await realtime.unsubscribe('created', type, handleCreate)
await realtime.unsubscribe('updated', type, id, handleUpdate)

// To unsubscribe all events in one go
await realtime.unsubscribeAll()
```

## License

`cozy-realtime` is distributed under the MIT license.
