# Cozy-Harvest-Lib

# Goal

Cozy-Harvest-Lib is responsible for the logic and components used in Cozy applications dealing with konnector accounts configuration.

With Harvest components, an app is able to:

- configure konnectors
- setup authentification informations
- check for synchronized data
- ..and much more in the future

# Current version

The current version exposes base components to

- create and edit accounts
- check status of the synchronization

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

# Tracking

Harvest components come with tracking calls (that would be effective only if the
user has consented to tracking). Your app must provide the correct tracking
context via the `TrackingContext` component.

Here, we pass a tracker to harvest that prefixes the page names sent by harvest
with "app-harvest:".

```
import { useMemo } from 'react'
import { KonnectorModal, TrackingContext } from 'cozy-harvest-lib'

export default () => {
  const appTracker = useTracker() // tracker from the app
  const trackerForHarvest = useMemo(() => {
    const trackPage = pageName => tracker.trackPage(`app-harvest:${pageName}`)
    const trackEvent = event => tracker.trackEvent(event)
    return { trackPage, trackEvent }
  }, [appTracker])
  return <TrackingContext.Provider value={trackerForHarvest}>
    <KonnectorModal />
  </TrackingContext.Provider>
}
```

If the app does not provide a tracking context, tracking calls will do nothing.

# Getting Started

For now it is possible to instanciate a `<TriggerManager />` which will allow to edit an account and launch the trigger.

As this component uses CozyClient, it must be wrapped at some point into a [`<CozyProvider />`](https://github.com/cozy/cozy-client/blob/master/docs/getting-started.md#wrapping-the-app-in-a-cozyprovider).

```js
import CozyClient, { CozyProvider, Q } from 'cozy-client'
import { TriggerManager } from 'cozy-harvest-lib'

const client = new CozyClient({
  /*...*/
})

ReactDOM.render(
  <CozyProvider client={client}>
    <Query query={()=> Q('io.cozy.apps').getById('my-konnector-id')}>
      {({ data: konnector }) => (
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
