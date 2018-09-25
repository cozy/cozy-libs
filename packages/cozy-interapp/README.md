# Intents

Library to create intents : actions that need to be fullfilled by another app than the current one.

[More info on intents here](https://docs.cozy.io/en/cozy-stack/intents/#intents)

## Usage

```js
import CozyClient from 'cozy-client'
import Intents from 'cozy-interapp'

const client = new CozyClient({ uri, token })
const intents = new Intents({ client })
intents.create('io.cozy.apps', 'CREATE')
  .start()
  .then(intent => {
    // do something with the result of the intent
    // intent = {
    //    id: '1337',
    //    attributes: {...}
    // }
  })
```
