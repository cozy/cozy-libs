# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 0.15.0 (2024-11-06)


### Features

* **cozy-devtools:** Remove logs and use hook to get `client` ([df87cf5](https://github.com/cozy/cozy-libs/commit/df87cf500edacae42c55c4bbf710fa2e55ea8ba3))





# 0.14.0 (2024-11-06)


### Features

* **cozy-devtools:** Add first version to test providers ([5689640](https://github.com/cozy/cozy-libs/commit/568964008bb657dfaf8038ac2d9fa3dca8d3eb1c))





## 0.13.1 (2024-11-05)

**Note:** Version bump only for package @cozy/repo-doctor





# 0.13.0 (2024-10-30)


### Features

* Update deps for cozy-viewer ([b2e103a](https://github.com/cozy/cozy-libs/commit/b2e103a1280182881ae1133860c0a09650271920))





# 0.12.0 (2024-10-30)


### Features

* Download file on mobile viewer on press ([3c38062](https://github.com/cozy/cozy-libs/commit/3c38062e2c83d5b8f7d0065323c18d45b5ce9564))





# 0.11.0 (2024-10-25)


### Features

* **Viewer:** Replace Encrypted provider by cozy-ui one ([aa81d02](https://github.com/cozy/cozy-libs/commit/aa81d02f0a70de8044f704cbd895b1d54c9f38b8))





## 0.10.3 (2024-10-23)

**Note:** Version bump only for package @cozy/repo-doctor





## 0.10.2 (2024-10-16)

**Note:** Version bump only for package @cozy/repo-doctor





## 0.10.1 (2023-02-08)


### Bug Fixes

* Recipient import path not updated in last update ([56b9cfd](https://github.com/cozy/cozy-libs/commit/56b9cfdab402813527982d0ddf857f1e963850b1))
* **repo-doctor:** Moment and Material-UI should not be dependencies ([94c9e19](https://github.com/cozy/cozy-libs/commit/94c9e1922a89f47a1948421e8f7f0dd776a0168a))





# 0.10.0 (2023-01-31)


### Features

* Update cozy-client and cozy-ui ([6ae3b04](https://github.com/cozy/cozy-libs/commit/6ae3b04925ae64fa30f3ec8b6e716453d0a630fe))





# 0.9.0 (2022-07-05)


### Bug Fixes

* Lint issue ([8523d7a](https://github.com/cozy/cozy-libs/commit/8523d7accbe7ee83b6a2fe7abf4cc629fcd76e61))


### Features

* All oauth methods to handle reconection case ([b1a6033](https://github.com/cozy/cozy-libs/commit/b1a6033b393b1732d985807328ea83e1c87e5373))





# 0.8.0 (2022-05-25)


### Bug Fixes

* bump argparse from 1.0.10 to 2.0.1 ([832b3db](https://github.com/cozy/cozy-libs/commit/832b3dbdfe774061357a3fc451976574b1d653fd))


### Features

* Remove useVaultClient call in LegacyTriggerManager ([439e603](https://github.com/cozy/cozy-libs/commit/439e603cef915e9fede72ae293ae35ca330347eb))





## 0.7.4 (2022-05-11)


### Bug Fixes

* **cozy-intent:** Allow to register webviews with baseUrl and no uri ([73e882c](https://github.com/cozy/cozy-libs/commit/73e882c739d643b72d5c1da4c4a510761c5678ea)), closes [/github.com/react-native-webview/react-native-webview/blob/a36394f598944c1ffe288f739b7441830249dc1e/apple/RNCWebView.m#L679-L686](https://github.com//github.com/react-native-webview/react-native-webview/blob/a36394f598944c1ffe288f739b7441830249dc1e/apple/RNCWebView.m/issues/L679-L686) [/github.com/react-native-webview/react-native-webview/blob/a36394f598944c1ffe288f739b7441830249dc1e/android/src/main/java/com/reactnativecommunity/webview/RNCWebViewManager.java#L513-L518](https://github.com//github.com/react-native-webview/react-native-webview/blob/a36394f598944c1ffe288f739b7441830249dc1e/android/src/main/java/com/reactnativecommunity/webview/RNCWebViewManager.java/issues/L513-L518)
* **repo-doctor:** Dep schema-utils breaks job ([7f5a5da](https://github.com/cozy/cozy-libs/commit/7f5a5daa6ccf91e6c9027e58dbb49ff9176e17df))





## [0.7.3](https://github.com/cozy/cozy-libs/compare/@cozy/repo-doctor@0.7.2...@cozy/repo-doctor@0.7.3) (2022-04-29)


### Bug Fixes

* bump schema-utils from 2.7.0 to 4.0.0 ([bfedbe8](https://github.com/cozy/cozy-libs/commit/bfedbe88eb6f5f786aace93794d5f15d64cbc692))





## 0.7.2 (2022-04-22)


### Bug Fixes

* **repo-doctor:** Moment should not be dependencies ([555307d](https://github.com/cozy/cozy-libs/commit/555307d8d067f0c8838aa549bd4918a9d2ee0b35))





## [0.7.1](https://github.com/cozy/cozy-libs/compare/@cozy/repo-doctor@0.7.0...@cozy/repo-doctor@0.7.1) (2022-03-28)

**Note:** Version bump only for package @cozy/repo-doctor





# [0.7.0](https://github.com/cozy/cozy-libs/compare/@cozy/repo-doctor@0.6.3...@cozy/repo-doctor@0.7.0) (2022-03-21)


### Bug Fixes

* **repo-doctor:** Send mattermost notif to front ([fb2163c](https://github.com/cozy/cozy-libs/commit/fb2163c5edac3dceb70005a78728926b77056e71))


### Features

* **repo-doctor:** Use table markdown to display mattermost report ([475aa0c](https://github.com/cozy/cozy-libs/commit/475aa0c982a2ee0a0a0e0c33fdfe4bdce75512fa))





## [0.6.3](https://github.com/cozy/cozy-libs/compare/@cozy/repo-doctor@0.6.2...@cozy/repo-doctor@0.6.3) (2022-03-18)


### Bug Fixes

* **deps:** update dependency eslint to v7.32.0 ([f8cda95](https://github.com/cozy/cozy-libs/commit/f8cda95fe3884fde1d98d53863f94e7371d0baf4))





## [0.6.2](https://github.com/cozy/cozy-libs/compare/@cozy/repo-doctor@0.6.1...@cozy/repo-doctor@0.6.2) (2022-02-18)


### Bug Fixes

* **deps:** pin dependencies ([e53d065](https://github.com/cozy/cozy-libs/commit/e53d065090224ea340b2c25c3afd14f223f4d119))





## [0.6.1](https://github.com/cozy/cozy-libs/compare/@cozy/repo-doctor@0.6.0...@cozy/repo-doctor@0.6.1) (2022-02-14)


### Bug Fixes

* **deps:** Bump node-fetch in /packages/repo-doctor ([5e5a844](https://github.com/cozy/cozy-libs/commit/5e5a844cf529964d4d95c32bbcf1e9eb638dad0a))





# 0.6.0 (2022-02-02)


### Bug Fixes

* **deps:** Bump lodash in /packages/repo-doctor ([7807680](https://github.com/cozy/cozy-libs/commit/78076803d4d494df39ddbcfbcd169376f4865ddd))


### Features

* Do not allow multi accounts features for clientSide konnectors ([1a9d157](https://github.com/cozy/cozy-libs/commit/1a9d157af6f79a2d1c30b5ee3d9956ee7ce668bd))





# 0.5.0 (2021-12-02)


### Features

* Add confirm trusted recipients dialog ([dfe1695](https://github.com/cozy/cozy-libs/commit/dfe1695))





# 0.4.0 (2021-03-25)


### Features

* Remove customStyles on KonnectorBlock ([8d3541f](https://github.com/cozy/cozy-libs/commit/8d3541f))





# 0.3.0 (2021-02-12)


### Features

* Add finance theme ([bb8cf35](https://github.com/cozy/cozy-libs/commit/bb8cf35))





## [0.2.2](https://github.com/cozy/cozy-libs/compare/@cozy/repo-doctor@0.2.1...@cozy/repo-doctor@0.2.2) (2020-10-19)

**Note:** Version bump only for package @cozy/repo-doctor





## [0.2.1](https://github.com/cozy/cozy-libs/compare/@cozy/repo-doctor@0.2.0...@cozy/repo-doctor@0.2.1) (2020-10-07)


### Bug Fixes

* Use warn ([48dad61](https://github.com/cozy/cozy-libs/commit/48dad61))





# [0.2.0](https://github.com/cozy/cozy-libs/compare/@cozy/repo-doctor@0.1.1...@cozy/repo-doctor@0.2.0) (2020-09-18)


### Features

* Add bluebird dependency ([cf34402](https://github.com/cozy/cozy-libs/commit/cf34402))
* Add command to start repo-doctor when developing ([7cc3901](https://github.com/cozy/cozy-libs/commit/7cc3901))
* Auto detect repository ([bfd0dee](https://github.com/cozy/cozy-libs/commit/bfd0dee))
* Check for Python deadsnakes presence in Travis ([36fca59](https://github.com/cozy/cozy-libs/commit/36fca59))
* Check if deps are at the same version ([31376f1](https://github.com/cozy/cozy-libs/commit/31376f1))
* Detect fast_finish from travis ([63d73a2](https://github.com/cozy/cozy-libs/commit/63d73a2))
* Read config from ~/.config or $XDG_CONFIG_HOME ([50101c8](https://github.com/cozy/cozy-libs/commit/50101c8))
* Show pending status when we dont support the real status ([498640e](https://github.com/cozy/cozy-libs/commit/498640e))





## [0.1.1](https://github.com/cozy/cozy-libs/compare/@cozy/repo-doctor@0.1.0...@cozy/repo-doctor@0.1.1) (2020-08-13)

**Note:** Version bump only for package @cozy/repo-doctor





# 0.1.0 (2020-07-21)


### Bug Fixes

* Removed instance of config ([f016216](https://github.com/cozy/cozy-libs/commit/f016216))


### Features

* Ability to configure mattermost channel through config ([4a6bf2c](https://github.com/cozy/cozy-libs/commit/4a6bf2c))
* Ability to filter dependencies ([f72922d](https://github.com/cozy/cozy-libs/commit/f72922d))
* Ability to filter rules ([b8353f6](https://github.com/cozy/cozy-libs/commit/b8353f6))
* Ability to run only on 1 repo ([f8b3bbf](https://github.com/cozy/cozy-libs/commit/f8b3bbf))
* Add babel-preset-cozy-app ([5fea2d7](https://github.com/cozy/cozy-libs/commit/5fea2d7))
* Add bin to package.json ([02a5698](https://github.com/cozy/cozy-libs/commit/02a5698))
* Add cozy-bar ([66d5626](https://github.com/cozy/cozy-libs/commit/66d5626))
* Add cozy-scripts ([8ce7660](https://github.com/cozy/cozy-libs/commit/8ce7660))
* Add forbidden dep check ([88ad32b](https://github.com/cozy/cozy-libs/commit/88ad32b))
* Add mattermost reporter ([3ab954c](https://github.com/cozy/cozy-libs/commit/3ab954c))
* Add README ([978564c](https://github.com/cozy/cozy-libs/commit/978564c))
* Check if locales are stored in the repository ([56ce3bd](https://github.com/cozy/cozy-libs/commit/56ce3bd))
* DepUpToDate has option for the dependencies that will be checked ([e633fb0](https://github.com/cozy/cozy-libs/commit/e633fb0))
* Keep all dependencies in repository info ([5f9b5f6](https://github.com/cozy/cozy-libs/commit/5f9b5f6))
* Make config overriding via CLI args more generic and powerful ([7ea7e41](https://github.com/cozy/cozy-libs/commit/7ea7e41))
* Reduce size of screenshot in README ([c8819f4](https://github.com/cozy/cozy-libs/commit/c8819f4))
* Remove support for function based rules ([9d0a9af](https://github.com/cozy/cozy-libs/commit/9d0a9af))
* Rules config can be validated declaratively ([398071c](https://github.com/cozy/cozy-libs/commit/398071c))
* Run validation on config ([6377ad8](https://github.com/cozy/cozy-libs/commit/6377ad8))
* Support either class Rule or function Rule ([b114207](https://github.com/cozy/cozy-libs/commit/b114207))
* Use centralized config to configure rules ([f21234d](https://github.com/cozy/cozy-libs/commit/f21234d))
* Use custom errors for bad config ([ef40967](https://github.com/cozy/cozy-libs/commit/ef40967))
