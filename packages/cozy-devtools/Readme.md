## Cozy-Devtools

Cozy-Devtools exposes a devtool that can be injected in an app for debug
and better developer experience. It is inspired by the [awesome devtools
for react-query][react-query devtools].

To activate it, just run in your browser console:

```js
flag('debug', true)
```

### Usage

Before using the devtools, you need to install cozy-ui and react-inspector.

```bash
yarn add cozy-ui # >= 48.0.0
yarn add react-inspector # >= 5.1.0
```

Next, you need to add it to your app, inside a CozyProvider.

```jsx
import CozyClient, { CozyProvider } from 'cozy-client'
import CozyDevtools from 'cozy-client/dist/devtools'

const App = () => {
  return <CozyProvider client={client}>
     /* Your app is here */
     { process.env.NODE_ENV !== 'production' ? <CozyDevtools /> : null }
  </CozyProvider>
}
```

### Panels

- The devtools is made of several "panels".
- There are default panels and the app can also inject its own adhoc panels.

#### Queries

Shows current queries inside cozy-client cache. Allows to see the data of
the query. The execution time is also shown, and is very valuable to track
down performance issues. It uses the execution statistics collected
from CouchDB.

#### Flags

Shows all the current flags and allow to modify them.

#### Libraries

Show library versions based on the global **VERSIONS** variable that
should be injected by the app. If it is defined, the panel will be blank.

#### PouchLink

If you use the PouchLink to synchronize your data to PouchDB, you can use
the optional devtool PouchLink devtool panel. Since PouchDB is optional,
it is not available by default and you need to explicitly tell the Devtools
to display it.

```jsx
import PouchDevtools from 'cozy-client/dist/devtools/Pouch'

() => <CozyDevTools panels={{ id: 'pouch', Component: PouchDevtools}} />
```

### Ideas for next features

- Performance tips in query panels

  - Show index related tips
  - Show slow queries
  - Show repeating queries
  - Show queries downloading too much data

- Actions on queries

  - Reset data inside query
  - Refetch
  - Set to error
  - Delete from store

If you have any other idea, please [open an issue][open-issue] 👍

[react-query devtools]: https://github.com/tannerlinsley/react-query-devtools

[open-issue]: https://github.com/cozy/cozy-libs/issues/new
