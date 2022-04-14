# Cozy-Mespapiers-Lib

This is an application-library. It allows you to add behavior from `Mes Papiers` application, inside your own application.

## Installation

In your application, you need some packages:

```bash
yarn add cozy-mespapiers-lib
yarn add cozy-intent cozy-realtime
```

## Realtime
`cozy-mespapiers-lib` uses realtime on `io.cozy.files` & `io.cozy.mespapiers.settings` doctypes via the `RealTimeQueries` components of `cozy-client`.
Therefore, the application must register the plugin.

```jsx
import { RealtimePlugin } from 'cozy-realtime'

client.registerPlugin(RealtimePlugin)
```

## Permissions

The following permissions are required in the application `manifest.webapp` file:

```json
"contacts": {
  "description": "Required to access the contacts",
  "type": "io.cozy.contacts.*",
  "verbs": ["GET"]
},
"sharings": {
  "description": "Required to have access to the sharings in realtime",
  "type": "io.cozy.sharings",
  "verbs": ["ALL"]
},
"permissions": {
  "description": "Required to run the konnectors",
  "type": "io.cozy.permissions",
  "verbs": ["ALL"]
},
"konnectors": {
  "description": "Required to display additional information in the viewer for files automatically retrieved by services",
  "type": "io.cozy.konnectors",
  "verbs": ["GET"]
},
"triggers": {
  "description": "Required to display additional information in the viewer for files automatically retrieved by services",
  "type": "io.cozy.triggers",
  "verbs": ["GET"]
},
"mespapiers.settings": {
  "description": "Used to manage your papers settings",
  "type": "io.cozy.mespapiers.settings",
  "verbs": ["GET", "POST", "PUT"]
}
```

## Importing

You need to import `Sprite` and add it to the root of your application

```jsx
import IconSprite from 'cozy-ui/transpiled/react/Icon/Sprite'

const App = () => {
  return (
    ...
    <IconSprite />
    ...
  )
}
```

You have to create a `/paper` route (the name is important) in your application routeur and add a background location:

```jsx
import { Route, Switch, useLocation } from 'react-router-dom'

const AppRouter = () => {
  const location = useLocation()
  const background = location?.state?.background

  return (
    <Switch location={background || location}>
      <Route ... />
      <Route path="/paper" component={MesPapiersView} />
      <Route ... />
    </Switch>
  )
}
```

Then inside your route component, you have to import exposed components from `cozy-mespapiers-lib`.
:warning: You have to pass the `lang` prop of the application so that it uses the right locales files.

Here an example with overrided style of `PapersFab`:

```jsx
/* global cozy */

import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import MesPapiers, { PapersFab } from 'cozy-mespapiers-lib'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import MuiCozyTheme from 'cozy-ui/transpiled/react/MuiCozyTheme'
import BarTitle from 'cozy-ui/transpiled/react/BarTitle'

const useStyles = makeStyles({
  root: {
    bottom: ({ isDesktop }) =>
      isDesktop ? '1rem' : 'calc(var(--sidebarHeight) + 1rem)'
  }
})

const MesPapiersView = props => {
  const { lang } = useI18n()
  const { isDesktop, isMobile } = useBreakpoints()
  const styles = useStyles({ isDesktop })
  const { BarCenter } = cozy.bar

  return (
    <>
      {isMobile && (
        <BarCenter>
          <MuiCozyTheme>
            <BarTitle>My Title</BarTitle>
          </MuiCozyTheme>
        </BarCenter>
      )}
      <MesPapiers {...props} lang={lang} />
      <PapersFab classes={{ root: styles.root }} />
    </>
  )
}

export default MesPapiersView
```
# Call modal with URL
In your application, if you want to call a modal to create a Paper, you just have to call the `/paper/create` or `/paper/create/:qualificationLabel` route with the query parameter `backgroundPath=<currentPath>`
Exemple:
```jsx
const { pathname } = useLocation()

const handleClick = () => {
  history.push({
    pathname: `/paper/create`,
    search: `backgroundPath=${pathname}`
  })
}
```

## Development

For development purpose, you can link the lib in your application, but you don't need to run `yarn install` in the lib before. The packages of the application will be used.
However you need to run `yarn install` to run the tests in the lib with `yarn test`.
