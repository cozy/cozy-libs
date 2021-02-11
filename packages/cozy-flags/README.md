# Flags

Use and manage cozy feature flags.
Flags can be toggled for a cozy instance, a context or globally.
See [the stack documentation on flags](https://docs.cozy.io/en/cozy-stack/settings/#get-settingsflags) for more information.

- ✅ jQuery like API for getter/setter
- ✅ Devtool component to set/unset flags

### Installation

```bash
npm install --save cozy-flags
# or yarn add cozy-flags
```

A CozyClient plugin is exported that 

- initializes flags on client's login
- resets them on client's logout

```jsx
import flag from 'cozy-flags'
client.registerPlugin(flag.plugin)
```

ℹ️ It will fetch server flags for consumption by the app 

- either from DOM data (if `data-cozy={{ .CozyData }}` or `data-flags={{ .Flags }}`, on web
- or by fetching data from the server (on mobile)

### Usage

⚠️ Make sure you have registered the flag plugin before using the flags.

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

### Demo

The `FlagSwitcher` component helps toggling the flags.

<img src='https://user-images.githubusercontent.com/1606068/43769674-93301fa4-9a3a-11e8-9d2a-93a6ab4f1a07.gif' />

### Flags enabled at build time

It is possible to handle flags enabled at build time. Your app should just
provide a global `__ENABLED_FLAGS__` array with flag names that should be
enabled. If such a global exists, `cozy-flags` will iterate on the array and
enable all the flags it contains when it is imported.
