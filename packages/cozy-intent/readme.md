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

##### `NativeService.call('openWebview', href)`

Will open a new webview in a Native app with the href provided.

#### Events

N/A

### Browser intents

#### Methods

N/A

#### Events

N/A
