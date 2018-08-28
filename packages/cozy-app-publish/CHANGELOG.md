# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="0.5.5"></a>
## [0.5.5](https://github.com/cozy/cozy-libs/compare/cozy-app-publish@0.5.4...cozy-app-publish@0.5.5) (2018-08-28)




**Note:** Version bump only for package cozy-app-publish

<a name="0.5.4"></a>
## [0.5.4](https://github.com/cozy/cozy-libs/compare/cozy-app-publish@0.5.3...cozy-app-publish@0.5.4) (2018-08-28)


### Bug Fixes

* :pencil2: typo in deploy scripts example in readme ([cf3b558](https://github.com/cozy/cozy-libs/commit/cf3b558))




<a name="0.5.3"></a>
## [0.5.3](https://github.com/cozy/cozy-libs/compare/cozy-app-publish@0.5.2...cozy-app-publish@0.5.3) (2018-08-22)




**Note:** Version bump only for package cozy-app-publish

<a name="0.5.2"></a>
## [0.5.2](https://github.com/cozy/cozy-libs/compare/cozy-app-publish@0.5.1...cozy-app-publish@0.5.2) (2018-08-21)




**Note:** Version bump only for package cozy-app-publish

<a name="0.5.1"></a>
## [0.5.1](https://github.com/cozy/cozy-libs/compare/cozy-app-publish@0.5.0...cozy-app-publish@0.5.1) (2018-08-11)




**Note:** Version bump only for package cozy-app-publish

<a name="0.5.0"></a>
# 0.5.0 (2018-08-10)


### Bug Fixes

* :fire: remove .prettierrc.json from cozy-app-publish ([1cd528c](https://github.com/cozy/cozy-libs/commit/1cd528c))


### Features

* import :sparkles: cozy-app-publish as a package ([403d90d](https://github.com/cozy/cozy-libs/commit/403d90d))




# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

### Changed
- none yet

### Fixed
- none yet

### Added
- `disabled` attribute for `<ButtonLink />` component

### Removed
- none yet

### Deprecated
- none yet

### Security
- none yet


## [v0.3.6]

### Fixed
- Make `--build-commit` usage more priority than the `TRAVIS_TAG` environment variale


## [v0.3.5]

### Added
- Enable `--build-url` option on Travis mode


## [v0.3.4]

### Fixed
- Don't throw an error on 409 Conflict registry response (version already exists)


## [v0.3.3]

### Fixed
- Prefer an option to provided the correct build commit hash: `--build-commit $BUILD_COMMIT`


## [v0.3.2]

### Fixed
- Bug when using BUILD_COMMIT


## [v0.3.1]

### Changed
- Use back the TRAVIS_COMMIT for dev versioning

### Added
- Hanlde BUILD_COMMIT from environment for dev versioning


## [v0.3.0]

### Added
- Add an automatic mode detection according to environment variables

### Changed
- Grab editor name directly from the manifest instead of the CLI option
- The dev version computing in Travis mode use the archive shasum instead of the TRAVIS_COMMIT

### Removed
- `--on-branch` option with git branch checking in travis mode
- Unused `--travis` option
- The `--editor` option since it's now using the manifest
- Pull request checking in travis mode


## [v0.2.0]

### Changed
- Now use the registry in production URL

### Added
- Handle registry spaces name through `--space` option


## [v0.1.1] First release

Deploy a Cozy application to Cozy Cloud registry


[Unreleased]: https://github.com/cozy/cozy-app-publish/compare/v0.3.6...HEAD
[v0.3.6]: https://github.com/cozy/cozy-app-publish/compare/v0.3.5...v0.3.6
[v0.3.5]: https://github.com/cozy/cozy-app-publish/compare/v0.3.4...v0.3.5
[v0.3.4]: https://github.com/cozy/cozy-app-publish/compare/v0.3.3...v0.3.4
[v0.3.3]: https://github.com/cozy/cozy-app-publish/compare/v0.3.2...v0.3.3
[v0.3.2]: https://github.com/cozy/cozy-app-publish/compare/v0.3.1...v0.3.2
[v0.3.1]: https://github.com/cozy/cozy-app-publish/compare/v0.3.0...v0.3.1
[v0.3.0]: https://github.com/cozy/cozy-app-publish/compare/v0.2.0...v0.3.0
[v0.2.0]: https://github.com/cozy/cozy-app-publish/compare/v0.1.1...v0.2.0
[v0.1.1]: https://github.com/cozy/cozy-app-publish/releases/tag/v0.1.1
