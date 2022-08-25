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

This is because all harvest components come with their own translation context. If you really do need
to import a component straight from the shipped file, there is a `withLocales` HOC that is available,
so something like this would work as a fallback:

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

# Data cards

⚠️ This is still in progress, things may change abruptly.

It is possible to display, in the data tab of Harvest, cards showing the data that
has been collected by the connector for the current io.cozy.accounts.

It is up to the application to tell Harvest which datacard should be used. It is done
by passing the `datacardOptions` prop to the `Routes` component of Harvest.

Here, if the konnector displayed has one permission on the "io.cozy.timeseries.geojson"
doctype, the GeoDataCard is shown.

```jsx
import GeoDataCard from 'cozy-harvest-lib/dist/datacards/GeoDataCard'

const datacardOptions = [{
  match: ({ konnector }) => any(konnector.permissions, permission => permission.type == 'io.cozy.timeseries.geojson'),
  component: GeoDataCard
}]

<Routes datacardOptions={datacardOptions} ... />
```

If an application wants to display all the available datacards, it can import
datacard options from Harvest. /!\ At this point, the app must install all the dependencies
that are necessary for each datacard to work (Leaflet for GeoDataCard for example).

```
import datacardOptions from 'cozy-harvest-lib/dist/datacards/datacardOptions'
<Routes doctypeToDataCard={doctypeToDataCard} ... />
```

- Since the application imports the datacards component, an application
  not using this functionality is not bloated by the dependencies
  of the data card.

- An application can implement a custom datacard for a particular
  doctype.

Datacard components receive as props:

- `accountId`: the accountId of the currently displayed `io.cozy.accounts`
- `konnector`: the konnector currently displayed
- `trigger`: the trigger linking the account to the konnector

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
    <Query query={()=> Q('io.cozy.konnectors').getById('my-konnector-id')}>
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

<https://docs.cozy.io/en/tutorials/konnector/#the-manifest>
