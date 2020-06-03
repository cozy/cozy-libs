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

### Cordova

In order to listen to online and offline events, you should install the [Network Information](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-network-information/) plugin.

## Example

### With CozyClient

CozyRealtime comes with a plugin for CozyClient. This is the recommended way to use it: 

```js

//instanciation
import React, { Component } from 'react'
import { RealtimePlugin } from 'cozy-realtime'
import CozyClient, { withClient } from 'cozy-client'

const client = new CozyClient({})

client.registerPlugin(RealtimePlugin)

// Usage

handleCreate = accounts => {
  console.log(`A new 'io.cozy.accounts' is created with id '${accounts._id}'.`)
}

handleUpdate = accounts => {
  console.log(`An account is updated with id '${accounts._id}'.`)
}

class MyComp extends Component {

  constructor(props){
    super(props)
  }

  componentDidMount(){
    this.realtime = this.props.client.plugins.realtime
    if(this.realtime){
      // To subscribe
      await this.realtime.subscribe('created', type, this.handleCreate)
      //listen of the update for a type
      await this.realtime.subscribe('updated', type, this.handleUpdate)
      //listen a specific document
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

### Standalone

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
await realtime.subscribe('updated', type, handleCreate)
await realtime.subscribe('updated', type, id, handleUpdate)

// To unsubscribe
await realtime.unsubscribe('created', type, handleCreate)
await realtime.unsubscribe('updated', type, handleUpdate)
await realtime.unsubscribe('updated', type, id, handleUpdate)

// To unsubscribe all
await realtime.unsubscribeAll()
```

## License

`cozy-realtime` is distributed under the MIT license.
