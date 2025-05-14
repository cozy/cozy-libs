# cozy-external-bridge

This library allows communication between a container app and an app embedded in an iframe. It is used with [cozy-twakechat](https://github.com/cozy/cozy-twakechat/) and [cozy-twakemail](https://github.com/cozy/cozy-twakemail/)

## For container app

Add the `useExternalBridge` hook and it will :

- allow history syncing
- expose a `getContacts` method
- expose a `getFlag` method

```
import { useExternalBridge } from 'cozy-external-bridge/container'

const App = () => {
  useExternalBridge('https://chat.twake.app')
}
```

You also need to manage routing if embedded app use history syncing :

```
<HashRouter>
  <Routes>
    <Route element={<AppLayout />}>
      <Route path="/" element={<OutletWrapper Component={App} />}>
        <Route path="bridge/*" />
      </Route>
    </Route>
  </Routes>
</HashRouter>
```

## For embedded app

Import `dist/embedded/bundle.js` script. It exposes method in `window._cozyBridge`.

At first, you have the following methods in `window._cozyBridge` :

- `requestParentOrigin: () => Promise<string | undefined>` : request origin from parent iframe; returns undefined if not in an iframe or no answer from iframe
- `isInsideCozy: (targetOrigin: string) => boolean` : check if target origin is a Cozy origin
- `setupBridge: (targetOrigin: string) => boolean` : setup bridge to communicate with target origin

After setupping bridge, you have the following methods in `window._cozyBridge` :

- `startHistorySyncing: () => void` : start sending history updates to parent window
- `stopHistorySyncing: () => void` : stop sending history updates to parent window
- `getContacts: () => Promise<IOCozyContact>` : get contacts from parent window
- `getFlag: (key: string) => Promise<string | boolean>` : get flags from parent window
