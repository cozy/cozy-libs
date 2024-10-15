# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
