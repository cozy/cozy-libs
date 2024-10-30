# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 3.4.0 (2024-10-30)


### Features

* Update deps for cozy-viewer ([b2e103a](https://github.com/cozy/cozy-libs/commit/b2e103a1280182881ae1133860c0a09650271920))





# 3.3.0 (2024-10-30)


### Features

* Download file on mobile viewer on press ([3c38062](https://github.com/cozy/cozy-libs/commit/3c38062e2c83d5b8f7d0065323c18d45b5ce9564))





# 3.2.0 (2024-10-25)


### Features

* **Viewer:** Replace Encrypted provider by cozy-ui one ([aa81d02](https://github.com/cozy/cozy-libs/commit/aa81d02f0a70de8044f704cbd895b1d54c9f38b8))





## 3.1.3 (2024-10-23)

**Note:** Version bump only for package cozy-device-helper





## 3.1.2 (2024-10-16)

**Note:** Version bump only for package cozy-device-helper





## [3.1.1](https://github.com/cozy/cozy-libs/compare/cozy-device-helper@3.1.0...cozy-device-helper@3.1.1) (2024-10-15)

**Note:** Version bump only for package cozy-device-helper





# 3.1.0 (2024-09-09)

### Features

- **cozy-device-helper:** Add `isFlagshipOfflineSupported()` method ([c1db89e](https://github.com/cozy/cozy-libs/commit/c1db89e0b5d977f509bda5a849f2d60fecbbe10f)), closes [cozy/cozy-flagship-app#1209](https://github.com/cozy/cozy-flagship-app/issues/1209)

# 3.0.0 (2023-08-23)

### Features

- **harvest:** Update cozy-client from `38.6.0` to `40.2.0` ([8931b15](https://github.com/cozy/cozy-libs/commit/8931b15ba7b097bf829601d6042d5e522b7f2fd6))

### BREAKING CHANGES

- **harvest:** you must have `cozy-client >= 40.2.0`

# 2.7.0 (2023-01-31)

### Features

- Update cozy-client and cozy-ui ([6ae3b04](https://github.com/cozy/cozy-libs/commit/6ae3b04925ae64fa30f3ec8b6e716453d0a630fe))

# 2.6.0 (2022-11-14)

### Features

- **cozy-device-helper:** Add `biometry_authorisation_denied` interface ([d6eb024](https://github.com/cozy/cozy-libs/commit/d6eb02483bc368a7a14bc5a9df4c1256ad4725ed))

# [2.5.0](https://github.com/cozy/cozy-libs/compare/cozy-device-helper@2.4.1...cozy-device-helper@2.5.0) (2022-10-03)

### Features

- Update device-helper interface ([ba87e8e](https://github.com/cozy/cozy-libs/commit/ba87e8ec6d48f7fd9d333965b4af6e527ce53c8b))

## 2.4.1 (2022-10-03)

**Note:** Version bump only for package cozy-device-helper

# [2.4.0](https://github.com/cozy/cozy-libs/compare/cozy-device-helper@2.3.0...cozy-device-helper@2.4.0) (2022-09-12)

### Features

- Update FlagshipMetadata interface ([b82cf89](https://github.com/cozy/cozy-libs/commit/b82cf899534edade60f5e1157d614becebe6c5e7))

# 2.3.0 (2022-09-06)

### Bug Fixes

- Use correct image size ([d290c39](https://github.com/cozy/cozy-libs/commit/d290c39a26edfdd7e35fbe3f6822ac7e3dc5f769))

### Features

- Update FlagshipMetadata interface ([d8da519](https://github.com/cozy/cozy-libs/commit/d8da519be2a54602d856ba3eecb4b2a6e18b74e5))

## 2.2.2 (2022-08-01)

**Note:** Version bump only for package cozy-device-helper

## 2.2.1 (2022-06-24)

### Bug Fixes

- Make isFlagshipApp and getFlagshipMetadata work on node environment ([636ad93](https://github.com/cozy/cozy-libs/commit/636ad93748b9f0cfd90fa2c2316bf914a71ab326))

# 2.2.0 (2022-06-03)

### Bug Fixes

- **deps:** update dependency @types/react-native to v0.67.7 ([e60dd0d](https://github.com/cozy/cozy-libs/commit/e60dd0de3d247123fb494c0cd650c6f54a665c29))

### Features

- **harvest:** HandleOAuthResponse can deal with cozy-data from DOM ([7c6ac1a](https://github.com/cozy/cozy-libs/commit/7c6ac1a8de7dd2b136530d0aafdb1e3f9e28fa56))

# 2.1.0 (2022-05-10)

### Bug Fixes

- **cozy-device-helper:** Remove type import ([401d654](https://github.com/cozy/cozy-libs/commit/401d654ca7ddb1553ec6039ddb5b4f7708ef5869))

### Features

- Add `name` in attributes selected for buildFilesQueryByLabels ([d66c975](https://github.com/cozy/cozy-libs/commit/d66c975670761343032c72af23590c691a0b89c1))

# [2.0.0](https://github.com/cozy/cozy-libs/compare/cozy-device-helper@1.18.0...cozy-device-helper@2.0.0) (2022-04-28)

### Bug Fixes

- FlagshipMetadata is now a getter ([11948ad](https://github.com/cozy/cozy-libs/commit/11948ad9b554996800c6b8d08cf0f30e43043084))

### BREAKING CHANGES

- flagshipMetadata reference has been replaced with
  getFlagshipMetadata().
  It returns the same information but adds safety at file init

# 1.18.0 (2022-04-25)

### Features

- Add new flagship api file ([1ef8b2d](https://github.com/cozy/cozy-libs/commit/1ef8b2d76b3fafe1aed83811e9cb1d5c78e43bc0))

# [1.17.0](https://github.com/cozy/cozy-libs/compare/cozy-device-helper@1.16.3...cozy-device-helper@1.17.0) (2022-02-04)

### Features

- Ensure isFlagshipApp returns a boolean value ([78e7d82](https://github.com/cozy/cozy-libs/commit/78e7d82441d66d9decbad5226a73c43d9594fc8e))

## [1.16.3](https://github.com/cozy/cozy-libs/compare/cozy-device-helper@1.16.2...cozy-device-helper@1.16.3) (2022-02-03)

### Bug Fixes

- **deps:** update dependency jest to v26.6.3 ([f442fff](https://github.com/cozy/cozy-libs/commit/f442fff5f594f04f910046d971950023fcbdd958))

## [1.16.2](https://github.com/cozy/cozy-libs/compare/cozy-device-helper@1.16.1...cozy-device-helper@1.16.2) (2022-02-01)

### Bug Fixes

- **deps:** update babel monorepo ([dcc215a](https://github.com/cozy/cozy-libs/commit/dcc215a0478db2cb3175b09d759bce8153ad4000))

## [1.16.1](https://github.com/cozy/cozy-libs/compare/cozy-device-helper@1.16.0...cozy-device-helper@1.16.1) (2022-01-28)

### Bug Fixes

- Update device helper typings location ([d874d8f](https://github.com/cozy/cozy-libs/commit/d874d8f))

# [1.16.0](https://github.com/cozy/cozy-libs/compare/cozy-device-helper@1.15.0...cozy-device-helper@1.16.0) (2022-01-07)

### Features

- Add types property in package.json ([69f717b](https://github.com/cozy/cozy-libs/commit/69f717b))

# [1.15.0](https://github.com/cozy/cozy-libs/compare/cozy-device-helper@1.14.0...cozy-device-helper@1.15.0) (2022-01-06)

### Features

- Add a manual typescript declaration file ([cbdb01e](https://github.com/cozy/cozy-libs/commit/cbdb01e))

# [1.14.0](https://github.com/cozy/cozy-libs/compare/cozy-device-helper@1.13.2...cozy-device-helper@1.14.0) (2021-12-28)

### Features

- Add a check for flagship app in device-helper ([20d6d99](https://github.com/cozy/cozy-libs/commit/20d6d99))

## [1.13.2](https://github.com/cozy/cozy-libs/compare/cozy-device-helper@1.13.1...cozy-device-helper@1.13.2) (2021-12-20)

**Note:** Version bump only for package cozy-device-helper

## [1.13.1](https://github.com/cozy/cozy-libs/compare/cozy-device-helper@1.13.0...cozy-device-helper@1.13.1) (2021-12-02)

**Note:** Version bump only for package cozy-device-helper

# 1.13.0 (2021-10-22)

### Features

- Remove drive from homeHref ([97010d3](https://github.com/cozy/cozy-libs/commit/97010d3))

# 1.12.0 (2021-02-12)

### Features

- Add finance theme ([bb8cf35](https://github.com/cozy/cozy-libs/commit/bb8cf35))

# 1.11.0 (2020-11-23)

### Features

- All babel cli at 7.12.1 ([387a24a](https://github.com/cozy/cozy-libs/commit/387a24a))
- Update @babel/core and babel-jest ([352ddc3](https://github.com/cozy/cozy-libs/commit/352ddc3))
- Update jest ([3b2c32a](https://github.com/cozy/cozy-libs/commit/3b2c32a))
- Use ^ for dependencies ([fc28de7](https://github.com/cozy/cozy-libs/commit/fc28de7))

## [1.10.3](https://github.com/cozy/cozy-libs/compare/cozy-device-helper@1.10.2...cozy-device-helper@1.10.3) (2020-10-01)

### Bug Fixes

- Lint issue ([aa10617](https://github.com/cozy/cozy-libs/commit/aa10617))

## 1.10.2 (2020-09-15)

**Note:** Version bump only for package cozy-device-helper

## [1.10.1](https://github.com/cozy/cozy-libs/compare/cozy-device-helper@1.10.0...cozy-device-helper@1.10.1) (2020-08-03)

**Note:** Version bump only for package cozy-device-helper

# 1.10.0 (2020-07-16)

### Bug Fixes

- Call revokeSelf if not the owner of the sharing ([f7afc60](https://github.com/cozy/cozy-libs/commit/f7afc60))

### Features

- Update lodash accross all packages ([6a20128](https://github.com/cozy/cozy-libs/commit/6a20128))

## [1.9.2](https://github.com/cozy/cozy-libs/compare/cozy-device-helper@1.9.1...cozy-device-helper@1.9.2) (2020-02-27)

**Note:** Version bump only for package cozy-device-helper

## [1.9.1](https://github.com/cozy/cozy-libs/compare/cozy-device-helper@1.9.0...cozy-device-helper@1.9.1) (2020-02-25)

**Note:** Version bump only for package cozy-device-helper

# 1.9.0 (2020-02-24)

### Bug Fixes

- Correctly handle BI errors ([#934](https://github.com/cozy/cozy-libs/issues/934)) ([bbed41d](https://github.com/cozy/cozy-libs/commit/bbed41d))

### Features

- Checks for cordova's network info plugin ([81e0e6b](https://github.com/cozy/cozy-libs/commit/81e0e6b))

# 1.8.0 (2019-09-05)

### Features

- Add account route ([7986708](https://github.com/cozy/cozy-libs/commit/7986708))

## [1.7.5](https://github.com/cozy/cozy-libs/compare/cozy-device-helper@1.7.4...cozy-device-helper@1.7.5) (2019-07-19)

**Note:** Version bump only for package cozy-device-helper

## [1.7.4](https://github.com/cozy/cozy-libs/compare/cozy-device-helper@1.7.3...cozy-device-helper@1.7.4) (2019-07-19)

**Note:** Version bump only for package cozy-device-helper

## 1.7.3 (2019-07-11)

### Bug Fixes

- **deps:** Update dependency lodash to v4.17.13 [SECURITY] ([#648](https://github.com/cozy/cozy-libs/issues/648)) ([1b36dac](https://github.com/cozy/cozy-libs/commit/1b36dac))

<a name="1.7.2"></a>

## 1.7.2 (2019-06-03)

### Bug Fixes

- HandleOpenURL on universalLink if MobileRouter does not manage it ([b8f5f55](https://github.com/cozy/cozy-libs/commit/b8f5f55))
- **device:** Check if window in the globals ([040347d](https://github.com/cozy/cozy-libs/commit/040347d))

<a name="1.7.1"></a>

## [1.7.1](https://github.com/cozy/cozy-libs/compare/cozy-device-helper@1.7.0...cozy-device-helper@1.7.1) (2019-04-12)

### Bug Fixes

- **cozy-device-helper:** Don't deeplink on iOS 12_2 or 12_3 ([#377](https://github.com/cozy/cozy-libs/issues/377)) ([b93aa2c](https://github.com/cozy/cozy-libs/commit/b93aa2c))

<a name="1.7.0"></a>

# [1.7.0](https://github.com/cozy/cozy-libs/compare/cozy-device-helper@1.6.10...cozy-device-helper@1.7.0) (2019-03-25)

### Features

- Add an utility to open or redirect for a deeplink ([#354](https://github.com/cozy/cozy-libs/issues/354)) ([6e1adfd](https://github.com/cozy/cozy-libs/commit/6e1adfd))

<a name="1.6.10"></a>

## [1.6.10](https://github.com/cozy/cozy-libs/compare/cozy-device-helper@1.6.9...cozy-device-helper@1.6.10) (2019-03-18)

**Note:** Version bump only for package cozy-device-helper

<a name="1.6.9"></a>

## [1.6.9](https://github.com/cozy/cozy-libs/compare/cozy-device-helper@1.6.8...cozy-device-helper@1.6.9) (2019-03-12)

**Note:** Version bump only for package cozy-device-helper

<a name="1.6.8"></a>

## [1.6.8](https://github.com/cozy/cozy-libs/compare/cozy-device-helper@1.6.7...cozy-device-helper@1.6.8) (2019-03-12)

**Note:** Version bump only for package cozy-device-helper

<a name="1.6.7"></a>

## [1.6.7](https://github.com/cozy/cozy-libs/compare/cozy-device-helper@1.6.6...cozy-device-helper@1.6.7) (2019-03-12)

**Note:** Version bump only for package cozy-device-helper

<a name="1.6.6"></a>

## [1.6.6](https://github.com/cozy/cozy-libs/compare/cozy-device-helper@1.6.4...cozy-device-helper@1.6.6) (2019-03-12)

**Note:** Version bump only for package cozy-device-helper

<a name="1.6.5"></a>

## [1.6.5](https://github.com/cozy/cozy-libs/compare/cozy-device-helper@1.6.4...cozy-device-helper@1.6.5) (2019-02-12)

**Note:** Version bump only for package cozy-device-helper

<a name="1.6.4"></a>

## [1.6.4](https://github.com/cozy/cozy-libs/compare/cozy-device-helper@1.6.3...cozy-device-helper@1.6.4) (2019-02-11)

**Note:** Version bump only for package cozy-device-helper

<a name="1.6.3"></a>

## [1.6.3](https://github.com/cozy/cozy-libs/compare/cozy-device-helper@1.6.2...cozy-device-helper@1.6.3) (2019-01-11)

**Note:** Version bump only for package cozy-device-helper

<a name="1.6.2"></a>

## [1.6.2](https://github.com/cozy/cozy-libs/compare/cozy-device-helper@1.6.1...cozy-device-helper@1.6.2) (2018-12-28)

**Note:** Version bump only for package cozy-device-helper

<a name="1.6.1"></a>

## [1.6.1](https://github.com/cozy/cozy-libs/compare/cozy-device-helper@1.6.0...cozy-device-helper@1.6.1) (2018-12-26)

**Note:** Version bump only for package cozy-device-helper

<a name="1.6.0"></a>

# [1.6.0](https://github.com/cozy/cozy-libs/compare/cozy-device-helper@1.5.2...cozy-device-helper@1.6.0) (2018-12-18)

### Features

- Add an nativeLinkOpen helper ([f894c43](https://github.com/cozy/cozy-libs/commit/f894c43))

<a name="1.5.2"></a>

## [1.5.2](https://github.com/cozy/cozy-libs/compare/cozy-device-helper@1.5.0...cozy-device-helper@1.5.2) (2018-12-17)

**Note:** Version bump only for package cozy-device-helper

<a name="1.5.1"></a>

## [1.5.1](https://github.com/cozy/cozy-libs/compare/cozy-device-helper@1.5.0...cozy-device-helper@1.5.1) (2018-12-10)

**Note:** Version bump only for package cozy-device-helper

<a name="1.5.0"></a>

# 1.5.0 (2018-12-04)

### Features

- **device-helper:** Add functions to test android or iOS smartphone ([e1553aa](https://github.com/cozy/cozy-libs/commit/e1553aa))

<a name="1.4.14"></a>

## [1.4.14](https://github.com/cozy/cozy-libs/compare/cozy-device-helper@1.4.13...cozy-device-helper@1.4.14) (2018-10-09)

**Note:** Version bump only for package cozy-device-helper

<a name="1.4.13"></a>

## [1.4.13](https://github.com/cozy/cozy-libs/compare/cozy-device-helper@1.4.12...cozy-device-helper@1.4.13) (2018-10-02)

**Note:** Version bump only for package cozy-device-helper

<a name="1.4.12"></a>

## [1.4.12](https://github.com/cozy/cozy-libs/compare/cozy-device-helper@1.4.11...cozy-device-helper@1.4.12) (2018-09-27)

**Note:** Version bump only for package cozy-device-helper

<a name="1.4.11"></a>

## [1.4.11](https://github.com/cozy/cozy-libs/compare/cozy-device-helper@1.4.10...cozy-device-helper@1.4.11) (2018-09-25)

**Note:** Version bump only for package cozy-device-helper

<a name="1.4.10"></a>

## [1.4.10](https://github.com/cozy/cozy-libs/compare/cozy-device-helper@1.4.9...cozy-device-helper@1.4.10) (2018-09-25)

### Bug Fixes

- :bug: add babel-core bridge for v7 ([18665a8](https://github.com/cozy/cozy-libs/commit/18665a8)), closes [/github.com/babel/babel/issues/8206#issuecomment-419705758](https://github.com//github.com/babel/babel/issues/8206/issues/issuecomment-419705758)
- :bug: use ^7.1.0 for babel-jest issue ([34b2d14](https://github.com/cozy/cozy-libs/commit/34b2d14))

<a name="1.4.9"></a>

## [1.4.9](https://github.com/cozy/cozy-libs/compare/cozy-device-helper@1.4.8...cozy-device-helper@1.4.9) (2018-09-25)

**Note:** Version bump only for package cozy-device-helper

<a name="1.4.8"></a>

## [1.4.8](https://github.com/cozy/cozy-libs/compare/cozy-device-helper@1.4.7...cozy-device-helper@1.4.8) (2018-09-21)

**Note:** Version bump only for package cozy-device-helper

<a name="1.4.7"></a>

## [1.4.7](https://github.com/cozy/cozy-libs/compare/cozy-device-helper@1.4.6...cozy-device-helper@1.4.7) (2018-08-30)

**Note:** Version bump only for package cozy-device-helper

<a name="1.4.6"></a>

## [1.4.6](https://github.com/cozy/cozy-libs/compare/cozy-device-helper@1.4.5...cozy-device-helper@1.4.6) (2018-08-22)

**Note:** Version bump only for package cozy-device-helper

<a name="1.4.5"></a>

## [1.4.5](https://github.com/cozy/cozy-libs/compare/cozy-device-helper@1.4.4...cozy-device-helper@1.4.5) (2018-08-09)

**Note:** Version bump only for package cozy-device-helper

<a name="1.4.4"></a>

## [1.4.4](https://github.com/cozy/cozy-libs/compare/cozy-device-helper@1.4.3...cozy-device-helper@1.4.4) (2018-08-08)

### Bug Fixes

- do not remove dist from npm ([3542540](https://github.com/cozy/cozy-libs/commit/3542540))

<a name="1.4.3"></a>

## [1.4.3](https://github.com/cozy/cozy-libs/compare/cozy-device-helper@1.4.2...cozy-device-helper@1.4.3) (2018-08-08)

### Bug Fixes

- do not remove dist from npm ([28a1373](https://github.com/cozy/cozy-libs/commit/28a1373))

<a name="1.4.2"></a>

## [1.4.2](https://github.com/cozy/cozy-libs/compare/cozy-device-helper@1.4.1...cozy-device-helper@1.4.2) (2018-08-08)

### Bug Fixes

- correctly export functions ([2cc9e2f](https://github.com/cozy/cozy-libs/commit/2cc9e2f))
- plugin reference ([59fd756](https://github.com/cozy/cozy-libs/commit/59fd756))
- remove global variable ([7b8120c](https://github.com/cozy/cozy-libs/commit/7b8120c))

<a name="1.4.1"></a>

## [1.4.1](https://github.com/cozy/cozy-libs/compare/cozy-device-helper@1.4.0...cozy-device-helper@1.4.1) (2018-08-08)

**Note:** Version bump only for package cozy-device-helper

<a name="1.4.0"></a>

# 1.4.0 (2018-08-08)

<a name="1.3.0-beta.4"></a>

# 1.3.0-beta.4 (2018-08-07)

### Bug Fixes

- lodash dependency 🐛 ([ec507e2](https://github.com/cozy/cozy-libs/commit/ec507e2))
- mistack word 🐛 ([f6c0c2a](https://github.com/cozy/cozy-libs/commit/f6c0c2a))
- transpile all files ([7ee2cb7](https://github.com/cozy/cozy-libs/commit/7ee2cb7))

### Features

- Add cordova plugin detection 🤖 ([30498e0](https://github.com/cozy/cozy-libs/commit/30498e0))
- Add cozy-device-helper ☎️ ([4420e6b](https://github.com/cozy/cozy-libs/commit/4420e6b))
- Add hasSafariPlugin HOC 📡 ([5403acc](https://github.com/cozy/cozy-libs/commit/5403acc))
- add helpers to start applications ([b90e1bf](https://github.com/cozy/cozy-libs/commit/b90e1bf))
- Export getPlatform ✨ ([f8c2953](https://github.com/cozy/cozy-libs/commit/f8c2953))
