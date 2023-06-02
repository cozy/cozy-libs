# Cozy-intent

## Concept

This library allows a react-native and a react app running in a webview to communicate in unidirectional and/or bidirectional fashions. The library is following declarative paradigms and is fully strictly typed. An emphasis has been put on low configuration needs and ease of use.

In a nutshell, one end says what it wants to an other end, and the other end handles it any way it wants. For more information on the underlying systems of this library, see https://github.com/alesgenova/post-me.

## Installation

The library needs to be installed both in the parent and the children application.

- `yarn add cozy-intent`

## API

### Nomenclature

- `event`: function that sends an event to the listening messenger.
- `intent`: high-level abstraction intended to describe the whole flow of events/methods and the actual result of those calls in the application.
- `messenger`: class implementing `post-me` messenger paradigm. Messengers are environment bound (DOM, React-native, worker, iframe, etc). They send and listen methods and events to other connected messengers.
- `method`: messenger function that accept arguments to be handled by the listening messenger.
- `service`: Cozy specific implementation designed to provide decoupling from `post-me` and easier instanciation/interoperability with React applications.

### Parent

First, we need to provide a React context to our application. This requires a method object that will be available to all Webview children.

```tsx
import React from 'react'

import { NativeIntentProvider } from 'cozy-intent'
import { ReactNativeApp } from 'react-native-app'

const MyNativeApp = () => (
  <NativeIntentProvider localMethods={{
    ping: () => console.log('pong'),
  }}>
    <ReactNativeApp />
  </NativeIntentProvider>
)
```

Later, in a webview, we need to register a messenger. We need a ref object to the webview first.

```tsx
import React, { useEffect, useState } from 'react'
import { WebView } from 'react-native-webview'

import { useNativeIntent } from 'cozy-intent'

const MyWebview = () => {
  const [ref, setRef] = useState('')
  const nativeIntent = useNativeIntent()

  useEffect(() => {
    if (ref) {
      nativeIntent.registerWebview(ref)
    }
  }, [ref, nativeIntent])

  return <Webview ref={(ref) => setRef(ref)} onMessage={nativeIntent.tryEmit} />
}
```

### Children

First, we need to provide a React context to our application. This requires a reference to the local window.

```tsx
import React from 'react'

import { WebviewIntentProvider } from 'cozy-intent'
import { ReactApp } from 'react-app'

const MyWebApp = () => (
  <WebviewIntentProvider windowRef={window}>
    <ReactApp />
  </WebviewIntentProvider>
)
```

Later on, we can use the service in a component and call a registered method. Here we call the `ping()` method injected in the native messenger.

```tsx
import React from 'react'

import { useWebviewIntent } from 'cozy-intent'

const MyComponent = () => {
  const webviewIntent = useWebviewIntent()
  const handleClick = () => webviewIntent.call('ping')

  return <buttton onClick={handleClick} />
}
```

### Native intents

#### Methods

##### `NativeService.call('logout')`

Will logout the user from the react-native application. Will not touch webview state.

#### `NativeService.call('setFlagshipUi')`

Example 1: With bottomBackground and topBackground set

```js
setFlagshipUI({
  bottomBackground: '#ff0000', // Red background for the Navigation Bar
  topBackground: '#0000ff' // Blue background for the Status Bar
})
```

![{0A71B7E4-3DF7-40F8-AB89-EAB905819E2F}](https://github.com/cozy/cozy-libs/assets/12577784/051b0db7-8f1a-4196-a866-2258a6c4cecd)

Example 2: With all optional parameters set

```js
setFlagshipUI({
  bottomBackground: '#008000', // Green background for the Navigation Bar
  bottomOverlay: 'rgba(0, 0, 0, 0.5)', // Half-transparent black overlay for the Navigation Bar
  bottomTheme: 'light', // Light-themed icons for the Navigation Bar
  topBackground: '#ffff00', // Yellow background for the Status Bar
  topOverlay: 'rgba(0, 0, 0, 0.5)', // Half-transparent black overlay for the Status Bar
  topTheme: 'dark' // Dark-themed icons for the Status Bar
})
```

![{104CBEC0-96CA-4732-AA35-662B115E0C0A}](https://github.com/cozy/cozy-libs/assets/12577784/a056f9d8-e7f0-4551-86d2-98d293ce557b)

Example 3: With themes and overlays set

```js
setFlagshipUI({
  bottomOverlay: 'rgba(255, 255, 255, 0.2)', // Light semi-transparent overlay for the Navigation Bar
  bottomTheme: 'dark', // Dark-themed icons for the Navigation Bar
  topOverlay: 'rgba(0, 0, 0, 0.3)', // Dark semi-transparent overlay for the Status Bar
  topTheme: 'light' // Light-themed icons for the Status Bar
})
```

![{AA2C98E5-19CA-4658-97B8-CDEAAD3FC5B5}](https://github.com/cozy/cozy-libs/assets/12577784/5e3dbeec-0d0e-4406-bb0a-c2edd2576de5)
