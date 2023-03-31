# Cozy Device Helper

![NPM Licence shield](https://img.shields.io/npm/l/cozy-device-helper.svg)
[![npm](https://img.shields.io/npm/v/cozy-device-helper.svg)](https://www.npmjs.com/package/cozy-device-helper)
[![npm](https://img.shields.io/npm/dt/cozy-device-helper.svg)](https://www.npmjs.com/package/cozy-device-helper)

> This library allows to know more information about the device platform

## API

### Platforms

```
import { getPlatform, isWebApp, isMobileApp, isIOSApp, isAndroidApp } from 'cozy-device-helper'
```

To know the platform:

- `getPlatform()`: return `ios`, `android` or `web`
- `isWebApp()`: return `boolean`
- `isMobileApp()`: return `boolean` (check if it's based on an app on cordova or on the flagship app)
- `isIOSApp()`: return `boolean`
- `isAndroidApp()`: return `boolean`
- `isAndroid()`: return `boolean` (check if the user is on an android smartphone (native & browser))
- `isOS()`: return `boolean` (check if the user is on an iOS smartphone (native & browser))
- `isMobile()`: return `boolean` (check if the user is on an android or iOS smartphone (native & browser))

### Device Name

```
import { getDeviceName } from 'cozy-device-helper'
```

To know device name `getDeviceName()`.

### Cordova

```
import { isCordova } from 'cozy-device-helper'
```

To know if your app is based on Cordova.

### Cordova Plugins

```
import { hasDevicePlugin, hasInAppBrowserPlugin, hasSafariPlugin, checkApp, startApp } from 'cozy-device-helper'
```

- `hasDevicePlugin`: return `boolean`
- `hasInAppBrowserPlugin`: return `boolean`
- `hasSafariPlugin`: return a promise which resolve by a `boolean`
- `checkApp`: return a `promise` that resolves with informations about the application (if installed) or false (if not installed)
- `startApp`: Start an Application. Return a `promise` - False if the application was not able to be started
