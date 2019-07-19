# Cozy-Harvest-Lib

# Goal

Cozy-Harvest-Lib is responsible for the logic and components used in harvest applications.

Harvest applications will be apps which will allow to configure konnectors, setup authentification informations and check for synchronized data (And much more in the future).
Each harvest application will be associated with only one konnector.

# Current version

The current version exposes base components to create and edit account and trigger documents.

Those components are used for now in [Cozy-Home](https://github.com/cozy/cozy-home).

# Installation

Just run

```
yarn add cozy-harvest-lib
```

# Getting Started

For now it is possible to instanciate a `<TriggerManager />` which will allow to edit an account and launch the trigger.

As this component uses CozyClient, it must be wrapped at some point into a [`<CozyProvider />`](https://github.com/cozy/cozy-client/blob/master/docs/getting-started.md#wrapping-the-app-in-a-cozyprovider) and a [`<I18n>`](https://github.com/cozy/cozy-ui/tree/master/react#i18n-translate) components.

```js
import CozyClient, { CozyProvider } from 'cozy-client'
import { TriggerManager } from 'cozy-harvest-lib'
import I18n from 'cozy-ui/react/I18n'

const client = new CozyClient({
  /*...*/
})

ReactDOM.render(
  <CozyProvider client={client}>
    <I18n lang="en" dictRequire={lang => require(`../src/locales/${lang}`)}>
      // Fetch konnector at some point
      <TriggerManager konnector="konnector" onSuccessLogin={() => alert('logged in')} />
      // other stuff
    </I18n>
  </CozyProvider>,
  document.getElementById('main')
)
```

# API

See the [Styleguidist](https://docs.cozy.io/cozy-libs/cozy-harvest-lib/).

# Doc and example about manifests

https://docs.cozy.io/en/tutorials/konnector/#the-manifest
