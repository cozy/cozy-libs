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
},
"create-a-zip-archive": {
  "description": "Required to create a zip archive inside the cozy",
  "type": "io.cozy.jobs",
  "verbs": ["POST"],
  "selector": "worker",
  "values": ["zip"]
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

You have to create a `/paper/*` route (the name is important) in your application routeur and add a background location:

```jsx
import { HashRouter, Route, Routes } from 'react-router-dom'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import MesPapiers from 'cozy-mespapiers-lib'

const PaperView = props => {
  const { lang } = useI18n()

  return <MesPapiers {...props} lang={lang} />
}

const AppRouter = () => {
  return (
    <HashRouter>
      <Routes>
        <Route ... />
        <Route path="/paper/*" component={PaperView} />
        <Route ... />
      </Routes>
    </HashRouter>
  )
}
```

Then inside your route component, you have to import exposed component from `cozy-mespapiers-lib`.
:warning: You must pass it the `lang` prop of the application so that it uses the right locales files.

## Styles

You need to add the following import to the base of your application:

```
import 'cozy-mespapiers-lib/dist/stylesheet.css'
```

***

# Components Overload

You can also overload some components (currently only the `PapersFab` & `ForwardFab` components) or not use them (with `null` value).

Here some examples:

- Default usage

```jsx
<MesPapiers {...props} lang={lang} />
```

***

- Components overloaded or disabled

```jsx
/**
 * @typedef {{
 * "aria-controls": string
 * "aria-haspopup": string
 * "aria-expanded": string
 * }} A11Y
 */
/**
 * @param {Object} props
 * @param {string} props.className - className to add to the component
 * @param {Function} props.onClick - onClick callback
 * @param {Object} props.innerRef - ref to the component
 * @param {A11Y} props.a11y - Accessibilities props
 */
const CustomFab = ({ className, innerRef, onClick, a11y }) => {
  return (
    <Button
      className={className}
      ref={innerRef}
      label="Custom btn"
      onClick={onClick}
      aria-label="Custom btn"
      {...a11y} // To match accessibility with the menu opened with this button
    />
  )
}

<MesPapiers
  {...props}
  lang={lang}
  components={{ PapersFab: CustomFab ForwardFab: null }}
/>
```

***

# Call modal with URL

In your application, if you want to call a modal to create a Paper, you just have to call the `/paper/create` or `/paper/create/:qualificationLabel` route as a child of your current route (and add the `<Outlet />` component to the component of this parent route. see [official documentation](https://reactrouter.com/en/main/components/outlet)).

***

# Development

For development purpose, you can link the lib in your application, but you don't need to run `yarn install` in the lib before. The packages of the application will be used.
However you need to run `yarn install` to run the tests in the lib with `yarn test`.

## Papers definitions

- The [`papersDefinitions.json`][papersDefinitionsJSONLink] file is the configuration file that controls part of the display and all the creation of a paper.

  Let's see how it is built: [PapersDefinitions.md][papersDefinitionsDOCLink]

- To add a new paper configuration, you can follow these [guidelines][addPaperGuidelinesDOCLink]

[papersDefinitionsJSONLink]: https://github.com/cozy/cozy-libs/blob/master/packages/cozy-mespapiers-lib/src/constants/papersDefinitions.json

[papersDefinitionsDOCLink]: https://github.com/cozy/cozy-libs/blob/master/packages/cozy-mespapiers-lib/docs/papersDefinitions.md

[addPaperGuidelinesDOCLink]: https://github.com/cozy/cozy-libs/blob/master/packages/cozy-mespapiers-lib/doc/addPaperGuidelines.md
