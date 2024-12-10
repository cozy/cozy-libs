# Cozy libs

> Sharing Helpers for Cozy Application Development

## Libraries

- [Cozy Device Helper](./packages/cozy-device-helper): To know more information about the device platform
- [Cozy Doctypes](./packages/cozy-doctypes): Tools for working with shared doctypes
- [Cozy Flags](./packages/cozy-flags): Client side feature flags
- [Cozy Interapp](./packages/cozy-interapp): Allows applications to interact with each other
- [Cozy Realtime](./packages/cozy-realtime): Be notified via websocket when something happens on the Cozy

## Dev tools

- [Babel Preset Cozy App](./packages/babel-preset-cozy-app): Config for babel transpiling (for applications and libraries)
- [Cozy Commitlint Config](./packages/commitlint-config-cozy): Commitlint config enforcing the cozy commit convention
- [Cozy Browserslist Config](./packages/browserslist-config-cozy): Browserslist config enforcing the official Cozy supported browsers
- [ESLint Config Cozy App](./packages/eslint-config-cozy-app): Config for eslint using prettier (for applications and libraries)
- [Cozy Logger](./packages/cozy-logger): Logs message in a human friendly way while developing and logs in JSON when in production. It can be used by konnectors, services alike, and web apps.

## CLI

- [Cozy CI](.packages/cozy-ci): Utility scripts for Cozy Cloud CI integration
- [Cozy App Publish](./packages/cozy-app-publish): Publish an application/konnector to the Cozy Cloud registry

## Note

- To run unit tests of a package, as some packages may be required for testing, you must first build the cozy-libs packages by running `yarn build`.

## Deleted packages

- cozy-mespapiers-lib : lib has been merged again in [mespapiers](https://github.com/cozy/mespapiers) in 2024. Last commit where it exists in this repo: `b49bd1f6b71446235b2c5a702a13584765787ce8`. [Removal PR](https://github.com/cozy/cozy-libs/pull/2641).
- cozy-scanner : lib was used for qualifications that are now in [cozy-client](https://github.com/cozy/cozy-client). Last commit where it exists in this repo: `cd79f20a4c2e807ec57893548594e2a5f430eba7`. [Removal PR](https://github.com/cozy/cozy-libs/pull/2649).
- cozy-authentication : lib was used for our Cordova apps that have been replaced by the flagship app in React Native. Last commit where it exists in this repo: `de46949c3e4f85e262786f71ec9e4a5699ec319b`. [Removal PR](https://github.com/cozy/cozy-libs/pull/2650).
