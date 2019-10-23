# Cozy-Harvest-Lib

# Goal

Cozy-Harvest-Lib is responsible for the logic and components used in Cozy applications dealing with konnector accounts configuration.

With Harvest components, an app is able to:

- configure konnectors
- setup authentification informations
- check for synchronized data
- ..and much more in the future

# Current version

The current version exposes base components to create and edit account and trigger documents.

Those components are used for now in [Cozy-Home](https://github.com/cozy/cozy-home).

# Installation

Just run

```
yarn add cozy-harvest-lib
```

# Importing

Components imported from cozy-harvest-lib **must** be imported from the root of the package, and not from specific files:

```
// imported from the root of the package 👍
import { TriggerManager } from 'cozy-harvest-lib'

// imported from another file or folder 👎
import TriggerManager from 'cozy-harvest-lib/TriggerManager'
```

This is because all harvest components come with their own translation context. If you really do need to import a component straight from the shipped file, there is a `withLocales` HOC that is available, so something like this would work as a fallback:

```
import TriggerManager from 'cozy-harvest-lib/TriggerManager'
import { withLocales } from 'cozy-harvest-lib'

const MyTriggerManager = withLocales(TriggerManager)
```

# Getting Started

For now it is possible to instanciate a `<TriggerManager />` which will allow to edit an account and launch the trigger.

As this component uses CozyClient, it must be wrapped at some point into a [`<CozyProvider />`](https://github.com/cozy/cozy-client/blob/master/docs/getting-started.md#wrapping-the-app-in-a-cozyprovider).

```js
import CozyClient, { CozyProvider } from 'cozy-client'
import { TriggerManager } from 'cozy-harvest-lib'

const client = new CozyClient({
  /*...*/
})

ReactDOM.render(
  <CozyProvider client={client}>
    <Query query={client => client.get('io.cozy.apps', 'my-konnector-id')}>
      {konnector => (
        <TriggerManager
          konnector={konnector}
          onSuccessLogin={() => alert('logged in')}
        />
      )}
    </Query>
    // other stuff
  </CozyProvider>,
  document.getElementById('main')
)
```

# API

See the [Styleguidist](https://docs.cozy.io/cozy-libs/cozy-harvest-lib/).

# Doc and example about manifests

https://docs.cozy.io/en/tutorials/konnector/#the-manifest
