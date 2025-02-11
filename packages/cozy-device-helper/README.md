# Cozy Device Helper

![NPM Licence shield](https://img.shields.io/npm/l/cozy-device-helper.svg)
[![npm](https://img.shields.io/npm/v/cozy-device-helper.svg)](https://www.npmjs.com/package/cozy-device-helper)
[![npm](https://img.shields.io/npm/dt/cozy-device-helper.svg)](https://www.npmjs.com/package/cozy-device-helper)

> This library allows to know more information about the device platform

## API

### Platforms

```
import { isFlagshipApp, isMobile, isAndroid, isIOS } from 'cozy-device-helper'
```

To know the platform:

- `isFlagshipApp()`: return `boolean` if inside the flagship app.
- `isFlagshipOfflineSupported()`: return `boolean` if offline supported by the flagship app.
- `getFlagshipMetadata()`: return `object` corresponding to flagship metadata.
- `isAndroid()`: return `boolean` (check if the user is on an android smartphone (native & browser))
- `isIOS()`: return `boolean` (check if the user is on an iOS smartphone (native & browser))
- `isMobile()`: return `boolean` (check if the user is on an android or iOS smartphone (native & browser))
