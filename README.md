# Cozy libs

> Sharing Helpers for Cozy Application Development

## List of libraries

- [Cozy Device Helper](./packages/cozy-device-helper): To know more information about the device platform

## Publishing

Lerna is used to manage the monorepo.

```
$ lerna publish # Publish all packages 
$ lerna publish --scope cozy-device-helper  --npm-tag beta # Publish only cozy-device-helper with tag beta
```
