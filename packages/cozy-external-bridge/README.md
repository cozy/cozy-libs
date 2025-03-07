# cozy-external-bridge

This library allows communication between a container app and an app embedded in an iframe. It is used with [cozy-twakechat](https://github.com/cozy/cozy-twakechat/) and [cozy-twakemail](https://github.com/cozy/cozy-twakemail/)

## For container app

Just add the `useExternalBridge` hook and it will :

- expose a `getContacts` method
- allow history syncing

```
import { useExternalBridge } from 'cozy-external-bridge/container'

const App = () => {
  useExternalBridge('https://chat.twake.app')
}
```

## For embedded app

Import `dist/embedded/bundle.js` script. If you are in the appropriate environment, it should add methods to the `window` object :

- window.\_isInsideCozy: () => boolean
- window.\_startHistorySyncing: () => void
- window.\_stopHistorySyncing: () => void
- window.\_getContacts: () => Promise<IoCozyContact>
