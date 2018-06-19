# Cozy Device Helper

![NPM Licence shield](https://img.shields.io/npm/l/cozy-device-helper.svg)
[![npm](https://img.shields.io/npm/v/cozy-device-helper.svg)](https://www.npmjs.com/package/cozy-device-helper)
[![npm](https://img.shields.io/npm/dt/cozy-device-helper.svg)](https://www.npmjs.com/package/cozy-device-helper)

> This library allows to know more information about the device platform

## API

### Platforms

```
import { isWebApp, isMobileApp, isIosApp, isAndroidApp } from 'cozy-device-helper'
```

To know the platform:
- `isWebApp()`
- `isMobileApp()`
- `isIosApp()`
- `isAndroidApp()`

### Device Name

```
import { getDeviceName } from 'cozy-device-helper'
```

To know device name `getDeviceName()`.
