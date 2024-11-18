# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.8.0](https://github.com/cozy/cozy-libs/compare/cozy-viewer@2.7.0...cozy-viewer@2.8.0) (2024-11-18)


### Features

* Revert to adding filter condition to display konnectorBlock ([87896f9](https://github.com/cozy/cozy-libs/commit/87896f94be7e715dc86002a76ecd59b1046996e6))





# [2.7.0](https://github.com/cozy/cozy-libs/compare/cozy-viewer@2.6.2...cozy-viewer@2.7.0) (2024-11-18)


### Features

* **Viewer:** Add filter condition to display konnectorBlock ([bb59023](https://github.com/cozy/cozy-libs/commit/bb59023be43e8ad5c6ca22141ece56529f77f5af))





## [2.6.2](https://github.com/cozy/cozy-libs/compare/cozy-viewer@2.6.1...cozy-viewer@2.6.2) (2024-11-07)


### Reverts

* "test: Remove useless test in Viewer" ([b1f1969](https://github.com/cozy/cozy-libs/commit/b1f1969a9daa04179c1c4b782b0629bcc77aa61e))





## 2.6.1 (2024-11-06)


### Bug Fixes

* Rename cozy-dataproxy to cozy-dataproxy-lib ([635d421](https://github.com/cozy/cozy-libs/commit/635d421045fc0374ca88cd68ec4941c95c40a0dd))





# 2.6.0 (2024-11-06)


### Features

* Upgrade cozy-client and cozy-pouch-link ([67f5241](https://github.com/cozy/cozy-libs/commit/67f5241754e0472a991dad3e5fafd0b1c5edb9c6)), closes [cozy/cozy-client#1553](https://github.com/cozy/cozy-client/issues/1553) [cozy/cozy-client#1556](https://github.com/cozy/cozy-client/issues/1556)





# 2.5.0 (2024-11-06)


### Features

* **cozy-devtools:** Remove logs and use hook to get `client` ([df87cf5](https://github.com/cozy/cozy-libs/commit/df87cf500edacae42c55c4bbf710fa2e55ea8ba3))





# 2.4.0 (2024-11-06)


### Features

* **cozy-devtools:** Add first version to test providers ([5689640](https://github.com/cozy/cozy-libs/commit/568964008bb657dfaf8038ac2d9fa3dca8d3eb1c))





## 2.3.1 (2024-11-05)

**Note:** Version bump only for package cozy-viewer





# 2.3.0 (2024-10-30)


### Features

* Update deps for cozy-viewer ([b2e103a](https://github.com/cozy/cozy-libs/commit/b2e103a1280182881ae1133860c0a09650271920))





# 2.2.0 (2024-10-30)


### Features

* Download file on mobile viewer on press ([3c38062](https://github.com/cozy/cozy-libs/commit/3c38062e2c83d5b8f7d0065323c18d45b5ce9564))





# 2.1.0 (2024-10-25)


### Features

* **Viewer:** Replace Encrypted provider by cozy-ui one ([aa81d02](https://github.com/cozy/cozy-libs/commit/aa81d02f0a70de8044f704cbd895b1d54c9f38b8))





## 2.0.3 (2024-10-23)

**Note:** Version bump only for package cozy-viewer





## 2.0.2 (2024-10-16)

**Note:** Version bump only for package cozy-viewer





## [2.0.1](https://github.com/cozy/cozy-libs/compare/cozy-viewer@2.0.0...cozy-viewer@2.0.1) (2024-10-15)

**Note:** Version bump only for package cozy-viewer





# [2.0.0](https://github.com/cozy/cozy-libs/compare/cozy-viewer@1.1.2...cozy-viewer@2.0.0) (2024-09-24)

### Features

- **cozy-viewer:** Upgrade cozy-client peerDependency to `49.0.0` ([113b598](https://github.com/cozy/cozy-libs/commit/113b598c40b3bbffa911955ce71be86a36e59f43)), closes [cozy/cozy-client#1507](https://github.com/cozy/cozy-client/issues/1507)
- **cozy-viewer:** Use new `downloadFile()` method from cozy-client ([d654334](https://github.com/cozy/cozy-libs/commit/d6543349a7f4b7248d971ab52f1a7dacf41225ac)), closes [cozy/cozy-client#1518](https://github.com/cozy/cozy-client/issues/1518)

### BREAKING CHANGES

- **cozy-viewer:** `downloadFile()` method has been removed from
  `cozy-viewer/src/helpers.js`. Use the one from
  `cozy-client/dist/models/file` instead
- **cozy-viewer:** cozy-viewer now requires cozy-client >= 49.0.0 (used
  for offline support)

## [1.1.2](https://github.com/cozy/cozy-libs/compare/cozy-viewer@1.1.1...cozy-viewer@1.1.2) (2024-09-12)

### Bug Fixes

- **Viewer:** Css wasn't publish with hash on classes ([eb050b9](https://github.com/cozy/cozy-libs/commit/eb050b92018631e322b7c76eaceda07a835d31af))

## [1.1.1](https://github.com/cozy/cozy-libs/compare/cozy-viewer@1.1.0...cozy-viewer@1.1.1) (2024-09-12)

### Bug Fixes

- **Viewer:** Locales was missing ([0804409](https://github.com/cozy/cozy-libs/commit/0804409f023f32c37e96f20bd32e11415edabd93))

# 1.1.0 (2024-09-11)

### Features

- Add cozy-viewer ([d960ea6](https://github.com/cozy/cozy-libs/commit/d960ea6724afd6b036e0afda31f1742103a149ac))
