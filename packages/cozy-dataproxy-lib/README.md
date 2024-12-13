# Cozy-dataproxy-lib

## Concept

This library is meant to be used by DataProxy apps like [cozy-web-data-proxy](https://github.com/cozy/cozy-web-data-proxy) or [cozy-flagship-app](https://github.com/cozy/cozy-flagship-app). Its goal is to mutualize data manipulation features like search indexing.

This library also exposes UI components that can be used by apps for a ready to use experience with search and AI.

## Installation

Just run

- `yarn add cozy-dataproxy-lib`

## API

### Nomenclature

- `SearchEngine`: Class that can index and search through Cozy's metadata

### Setup and usage

In order to create a SearchEngine:

```ts
  const searchEngine = new SearchEngine(client)

  // ...

  const query = 'Some search string'
  const searchResult = searchEngine.search(query)
```

## Search and AI components

### Prerequisite for both components

1. Update `cozy-scripts` version of your app to 8.4.0.

2. Add the provider in your tree :

```jsx
<DataProxyProvider>
  { children }
</DataProxyProvider>
```

3. Import the CSS :

```jsx
import 'cozy-dataproxy-lib/dist/stylesheet.css'
```

### Prerequisite for AI components

1. Add following permissions in manifest.webapp :

```json
"chatConversations": {
  "description": "Required by the cozy Assistant",
  "type": "io.cozy.ai.chat.conversations",
  "verbs": ["GET", "POST"]
},
"chatEvents": {
  "description": "Required by the cozy Assistant",
  "type": "io.cozy.ai.chat.events",
  "verbs": ["GET"]
}
```

2. Add realtime queries for chat conversations in your tree :

```jsx
<RealTimeQueries doctype="io.cozy.ai.chat.conversations" />
```

### On desktop

You can add the search bar like this :

```jsx
import React from 'react'

import { BarSearch } from 'cozy-bar'
import { AssistantDesktop } from 'cozy-dataproxy-lib'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

const AppBarSearch = () => {
  const { isMobile } = useBreakpoints()

  return (
    <BarSearch>
      {!isMobile && (
        <AssistantDesktop
          componentsProps={{ SearchBarDesktop: { size: 'small' } }}
        />
      )}
    </BarSearch>
  )
}

export default AppBarSearch
```

### On mobile

The search and assistant are dialogs. So you just need to create a route for each dialog, and open them when you want. The SearchDialog can open the AssistantDialog and expect a route like this `assistant/:conversationId`.

```jsx
<Route path="search" element={<SearchDialog />} />
<Route
  path="assistant/:conversationId"
  element={
    <>
      <RealTimeQueries doctype="io.cozy.ai.chat.conversations" />
      <AssistantDialog />
    </>
  }
/>
```
