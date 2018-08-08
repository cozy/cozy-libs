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
