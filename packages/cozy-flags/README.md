Flags
=====

Simple client side toggle flags.

- [x] jQuery like API for getter/setter
- [x] Dev React component to set/unset flags

### Demo

The `FlagSwitcher` component helps toggling the flags.

<img src='https://user-images.githubusercontent.com/1606068/43769674-93301fa4-9a3a-11e8-9d2a-93a6ab4f1a07.gif' />

### Usage

```js
import flag from 'cozy-flags'

if (flag('my-feature')) {
  enableMyFeature()
}
```

The `FlagSwitcher` shows all flags in use and displays all
flags in use.

```js
import flag, { FlagSwitcher } from 'cozy-flags'

if (process.env.NODE_ENV !== 'production'
    && flag('switcher') === undefined) {
    flag('switcher', true) // set default flag in dev mode
}

const App = () => {
  return (
    <div>
      { flag('switcher') && <FlagSwitcher /> }
      <MyApp />
    </div>
  )
}

```

### Flags enabled on the server

Feature flags can be served by the server and injected in the HTML page of an
application. See https://docs.cozy.io/en/cozy-stack/settings/#get-settingsflags
and https://docs.cozy.io/en/cozy-stack/client-app-dev/#good-practices-for-your-application.

#### Client plugin

A CozyClient plugin is exported that initializes and resets flags on client's login
and logout. It will initialize flags either from DOM data (if `data-cozy={{ .CozyData }}`
or `data-flags={{ .Flags }}`, on web) or by fetching data from the server (on mobile).

```
client.registerPlugin(flag.plugin)
```

### Flags enabled at build time

It is possible to handle flags enabled at build time. Your app should just
provide a global `__ENABLED_FLAGS__` array with flag names that should be
enabled. If such a global exists, `cozy-flags` will iterate on the array and
enable all the flags it contains when it is imported.
