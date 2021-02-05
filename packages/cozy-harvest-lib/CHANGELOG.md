# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.10.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@3.9.0...cozy-harvest-lib@3.10.0) (2021-02-05)


### Features

* Add in harvest a new 2FA mode (mobile app with code) ([789cf47](https://github.com/cozy/cozy-libs/commit/789cf47))





# [3.9.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@3.8.1...cozy-harvest-lib@3.9.0) (2021-02-02)


### Features

* Support for MAIF staging cozys to talk with the right BI endpoint ([eb3ef6c](https://github.com/cozy/cozy-libs/commit/eb3ef6c))





## [3.8.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@3.8.0...cozy-harvest-lib@3.8.1) (2021-01-29)

**Note:** Version bump only for package cozy-harvest-lib





# [3.8.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@3.7.2...cozy-harvest-lib@3.8.0) (2021-01-29)


### Bug Fixes

* Pass # to AppLinker if we have no URL to remove props warning ([bd3cde6](https://github.com/cozy/cozy-libs/commit/bd3cde6))


### Features

* Add a reconnect button inside trigger info to reconnect account ([c27f64a](https://github.com/cozy/cozy-libs/commit/c27f64a))
* Add log messages and remove deny rule ([9d1dd28](https://github.com/cozy/cozy-libs/commit/9d1dd28))
* Deactivate auto success when launching job via "update" button ([48bba00](https://github.com/cozy/cozy-libs/commit/48bba00))
* When receiving a 2FA event, stop the auto-success timer ([f55b4cc](https://github.com/cozy/cozy-libs/commit/f55b4cc))





## [3.7.2](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@3.7.1...cozy-harvest-lib@3.7.2) (2021-01-28)

**Note:** Version bump only for package cozy-harvest-lib





## [3.7.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@3.7.0...cozy-harvest-lib@3.7.1) (2021-01-28)


### Bug Fixes

* Bottom content was hidden by Swipeable View ([189159d](https://github.com/cozy/cozy-libs/commit/189159d))





# [3.7.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@3.6.0...cozy-harvest-lib@3.7.0) (2021-01-28)


### Features

* Add KonnectorBlock to show konnector informations ([33c37d2](https://github.com/cozy/cozy-libs/commit/33c37d2))
* Upgrade cozy-client to 16.17.0 ([d61e3e0](https://github.com/cozy/cozy-libs/commit/d61e3e0))





# [3.6.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@3.5.0...cozy-harvest-lib@3.6.0) (2021-01-26)


### Bug Fixes

* Correctly configure sentry to send events only in production ([b865167](https://github.com/cozy/cozy-libs/commit/b865167))


### Features

* Send original error to Sentry instead of wrapped one ([aaf1902](https://github.com/cozy/cozy-libs/commit/aaf1902))





# [3.5.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@3.4.1...cozy-harvest-lib@3.5.0) (2021-01-25)


### Features

* Add Typography component ([1aaab29](https://github.com/cozy/cozy-libs/commit/1aaab29))





## [3.4.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@3.4.0...cozy-harvest-lib@3.4.1) (2021-01-25)


### Bug Fixes

* **Harvest:** Remove wrong 80s job watcher delay ([de2c7cf](https://github.com/cozy/cozy-libs/commit/de2c7cf))





# [3.4.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@3.3.0...cozy-harvest-lib@3.4.0) (2021-01-22)


### Features

* Add sentry integration to harvest connection flow ([185f032](https://github.com/cozy/cozy-libs/commit/185f032))





# [3.3.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@3.2.0...cozy-harvest-lib@3.3.0) (2021-01-21)


### Bug Fixes

* Field components used in CollectionField need to forward their ref ([9687414](https://github.com/cozy/cozy-libs/commit/9687414))
* Filter triggers on worker=konnector, type=[@cron](https://github.com/cron) ([d09c1ea](https://github.com/cozy/cozy-libs/commit/d09c1ea))


### Features

* Update cozy-ui ([f551e4c](https://github.com/cozy/cozy-libs/commit/f551e4c))





# [3.2.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@3.1.2...cozy-harvest-lib@3.2.0) (2021-01-20)


### Bug Fixes

* Show account form if the vault is still locked in handleVaultUnlock ([6b279d8](https://github.com/cozy/cozy-libs/commit/6b279d8))


### Features

* Update cozy-keys-lib dev dep ([0e5e8c7](https://github.com/cozy/cozy-libs/commit/0e5e8c7))
* Update cozy-keys-lib peer dep and dev dep ([0e09dc1](https://github.com/cozy/cozy-libs/commit/0e09dc1))





## [3.1.2](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@3.1.1...cozy-harvest-lib@3.1.2) (2021-01-18)


### Bug Fixes

* Call onUnlock directly if vault is already unlocked ([484c624](https://github.com/cozy/cozy-libs/commit/484c624))
* Correct padding bottom on vault ciphers list ([28440d1](https://github.com/cozy/cozy-libs/commit/28440d1))
* Deletion of account ([cc38c8a](https://github.com/cozy/cozy-libs/commit/cc38c8a))
* Prevent runtime warnings from MUI ([2f5c9c0](https://github.com/cozy/cozy-libs/commit/2f5c9c0))
* Prevent warnings in console due to setState used after component unmounting ([17910e7](https://github.com/cozy/cozy-libs/commit/17910e7))





## [3.1.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@3.1.0...cozy-harvest-lib@3.1.1) (2021-01-18)

**Note:** Version bump only for package cozy-harvest-lib





# [3.1.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@3.0.0...cozy-harvest-lib@3.1.0) (2021-01-14)


### Bug Fixes

* Add padding for text when no more account ([af019ab](https://github.com/cozy/cozy-libs/commit/af019ab))


### Features

* Make wording of account deletion dialog cozy agnostic ([7c92eba](https://github.com/cozy/cozy-libs/commit/7c92eba))
* Use new tabs in disconnected account modal ([a917a1d](https://github.com/cozy/cozy-libs/commit/a917a1d))





# [3.0.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.35.2...cozy-harvest-lib@3.0.0) (2021-01-13)


### Bug Fixes

* Add bottom padding to oauth modal ([1ea3e5b](https://github.com/cozy/cozy-libs/commit/1ea3e5b))


### Features

* Add u-error class to WarningIcon ([9079377](https://github.com/cozy/cozy-libs/commit/9079377))
* Convert Text to Typography ([e919799](https://github.com/cozy/cozy-libs/commit/e919799))
* Main harvest modal is hidden when vault unlock is opened ([76b3343](https://github.com/cozy/cozy-libs/commit/76b3343))
* Pass props to the VaultUnlocker through VaultUnlockPlaceholder ([46e3356](https://github.com/cozy/cozy-libs/commit/46e3356))


### Performance Improvements

* Memoize fetch app from registry for maintenance ([bbea7aa](https://github.com/cozy/cozy-libs/commit/bbea7aa))


### BREAKING CHANGES

* When using the TriggerManager outside the main Harvest
Routes, you need to
`import { IntentTriggerManager } from 'cozy-harvest-lib'`, instead of
`import { TriggerManager } from 'cozy-harvest-lib'.





## [2.35.2](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.35.1...cozy-harvest-lib@2.35.2) (2021-01-11)


### Bug Fixes

* Replace / with - in account identifier when building folder path ([a9ddef2](https://github.com/cozy/cozy-libs/commit/a9ddef2))





## [2.35.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.35.0...cozy-harvest-lib@2.35.1) (2021-01-08)


### Bug Fixes

* Close edit contract modal on escape ([ec9bfd9](https://github.com/cozy/cozy-libs/commit/ec9bfd9))





# [2.35.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.34.0...cozy-harvest-lib@2.35.0) (2021-01-07)


### Bug Fixes

* Defensive programming in case we are in an old browser ([89c51c5](https://github.com/cozy/cozy-libs/commit/89c51c5))
* Update height after change of subtree ([cffb5ab](https://github.com/cozy/cozy-libs/commit/cffb5ab))
* Use deep import for cozy-ui Text ([0a934ca](https://github.com/cozy/cozy-libs/commit/0a934ca))


### Features

* Do not center the harvest modal to prevent content jump ([9e6b856](https://github.com/cozy/cozy-libs/commit/9e6b856))





# [2.34.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.33.1...cozy-harvest-lib@2.34.0) (2021-01-06)


### Bug Fixes

* Banking connector deletion ([0e700fc](https://github.com/cozy/cozy-libs/commit/0e700fc))


### Features

* Add tracking event for banking account deleted ([f6d3f55](https://github.com/cozy/cozy-libs/commit/f6d3f55))





## [2.33.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.33.0...cozy-harvest-lib@2.33.1) (2021-01-05)


### Bug Fixes

* Put cozy-keys-lib as {peer/dev}Dep ([a1a9248](https://github.com/cozy/cozy-libs/commit/a1a9248))
* React-router-dom as a peer dep ([fe7083f](https://github.com/cozy/cozy-libs/commit/fe7083f))





# [2.33.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.32.1...cozy-harvest-lib@2.33.0) (2021-01-05)


### Bug Fixes

* Divider comes directly from cozy-ui/transpiled/react/Divider ([cb6be90](https://github.com/cozy/cozy-libs/commit/cb6be90))


### Features

* AppLinkCard does not wait for fetch before showing ([7d06e05](https://github.com/cozy/cozy-libs/commit/7d06e05))
* Modal to Dialog 1 ([b0eced8](https://github.com/cozy/cozy-libs/commit/b0eced8))
* Modal to Dialog 2 ([6318b9e](https://github.com/cozy/cozy-libs/commit/6318b9e))
* Modal to Dialog 3 ([eb28e73](https://github.com/cozy/cozy-libs/commit/eb28e73))
* Modal to Dialog 4 ([70bb2b5](https://github.com/cozy/cozy-libs/commit/70bb2b5))
* Update cozy-keys-lib ([84ce459](https://github.com/cozy/cozy-libs/commit/84ce459))





## [2.32.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.32.0...cozy-harvest-lib@2.32.1) (2021-01-05)


### Bug Fixes

* **Harvest:** Remove check on identifiers for account rescue ([d4c382d](https://github.com/cozy/cozy-libs/commit/d4c382d))





# [2.32.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.31.0...cozy-harvest-lib@2.32.0) (2020-12-23)


### Bug Fixes

* Use data object from query ([5e324d2](https://github.com/cozy/cozy-libs/commit/5e324d2))
* Wrap HarvestVaultProvider in highest level ([4cbe0f6](https://github.com/cozy/cozy-libs/commit/4cbe0f6))


### Features

* Unshare ciphers when after account delete ([dc675f7](https://github.com/cozy/cozy-libs/commit/dc675f7))





# [2.31.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.30.0...cozy-harvest-lib@2.31.0) (2020-12-16)


### Bug Fixes

* **Harvest:** Use client.queryAll ([d269f5a](https://github.com/cozy/cozy-libs/commit/d269f5a))


### Features

* **Harvest:** Reuse unlinked accounts ([79973d1](https://github.com/cozy/cozy-libs/commit/79973d1))





# [2.30.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.29.5...cozy-harvest-lib@2.30.0) (2020-12-15)


### Features

* Add button&divider props ([e1b8d1b](https://github.com/cozy/cozy-libs/commit/e1b8d1b))





## [2.29.5](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.29.4...cozy-harvest-lib@2.29.5) (2020-12-14)


### Bug Fixes

* Correcty pass biBankId to setSync ([3e73ea2](https://github.com/cozy/cozy-libs/commit/3e73ea2))





## [2.29.4](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.29.3...cozy-harvest-lib@2.29.4) (2020-12-11)


### Bug Fixes

* Show drive card in data tab ([7969f9b](https://github.com/cozy/cozy-libs/commit/7969f9b))





## [2.29.3](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.29.2...cozy-harvest-lib@2.29.3) (2020-12-08)


### Bug Fixes

* Set Tab props label correctly instead of using children ([0ecf062](https://github.com/cozy/cozy-libs/commit/0ecf062))
* Use correct prop ([816821e](https://github.com/cozy/cozy-libs/commit/816821e))





## [2.29.2](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.29.1...cozy-harvest-lib@2.29.2) (2020-12-07)


### Bug Fixes

* Add onClose prop to correctly close modal when clicking outside it ([3c83311](https://github.com/cozy/cozy-libs/commit/3c83311))
* Put open prop on ConfirmDialog otherwise the dialog does not show ([dc0499d](https://github.com/cozy/cozy-libs/commit/dc0499d))
* Put open prop on ConfirmDialog otherwise the dialog does not show ([24d9f7d](https://github.com/cozy/cozy-libs/commit/24d9f7d))





## [2.29.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.29.0...cozy-harvest-lib@2.29.1) (2020-12-03)

**Note:** Version bump only for package cozy-harvest-lib





# [2.29.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.28.0...cozy-harvest-lib@2.29.0) (2020-11-30)


### Features

* Use svgr icon for harvest ([8b838cd](https://github.com/cozy/cozy-libs/commit/8b838cd))





# [2.28.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.27.5...cozy-harvest-lib@2.28.0) (2020-11-30)


### Features

* **harvest:** Upgrade cozy-bi-auth ([f18a2dd](https://github.com/cozy/cozy-libs/commit/f18a2dd))





## [2.27.5](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.27.4...cozy-harvest-lib@2.27.5) (2020-11-26)


### Bug Fixes

* **Harvest:** Regression on handling banking connectors where bankId is ([d42436c](https://github.com/cozy/cozy-libs/commit/d42436c))





## [2.27.4](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.27.3...cozy-harvest-lib@2.27.4) (2020-11-25)


### Bug Fixes

* Use correct import for DialogCloseButton ([1538b55](https://github.com/cozy/cozy-libs/commit/1538b55))





## [2.27.3](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.27.2...cozy-harvest-lib@2.27.3) (2020-11-25)

**Note:** Version bump only for package cozy-harvest-lib





## [2.27.2](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.27.1...cozy-harvest-lib@2.27.2) (2020-11-25)


### Bug Fixes

* Remove duplicate dependency and pin devDep ([a79f72c](https://github.com/cozy/cozy-libs/commit/a79f72c))





## [2.27.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.27.0...cozy-harvest-lib@2.27.1) (2020-11-24)


### Bug Fixes

* Wrap TwoFaModal in withLocales ([5b05afa](https://github.com/cozy/cozy-libs/commit/5b05afa))





# [2.27.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.26.1...cozy-harvest-lib@2.27.0) (2020-11-23)


### Features

* All babel cli at 7.12.1 ([387a24a](https://github.com/cozy/cozy-libs/commit/387a24a))
* All babel runtime at 7.12.5 ([a77137c](https://github.com/cozy/cozy-libs/commit/a77137c))
* Update @babel/core and babel-jest ([352ddc3](https://github.com/cozy/cozy-libs/commit/352ddc3))
* Update jest ([3b2c32a](https://github.com/cozy/cozy-libs/commit/3b2c32a))
* Use ^ for dependencies ([fc28de7](https://github.com/cozy/cozy-libs/commit/fc28de7))
* Use >= for peer dependencies ([6ec2826](https://github.com/cozy/cozy-libs/commit/6ec2826))





## [2.26.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.26.0...cozy-harvest-lib@2.26.1) (2020-11-17)

**Note:** Version bump only for package cozy-harvest-lib





# [2.26.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.25.0...cozy-harvest-lib@2.26.0) (2020-11-17)


### Features

* Update cozy-ui for cozy-harvest-lib ([b5d3af5](https://github.com/cozy/cozy-libs/commit/b5d3af5))





# [2.25.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.24.0...cozy-harvest-lib@2.25.0) (2020-11-16)


### Features

* **Harvest:** Ignore soft deleted ciphers ([3f40ef5](https://github.com/cozy/cozy-libs/commit/3f40ef5))





# [2.24.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.23.0...cozy-harvest-lib@2.24.0) (2020-11-13)


### Features

* Ability to update user config ([c2a4c4a](https://github.com/cozy/cozy-libs/commit/c2a4c4a))





# [2.23.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.22.1...cozy-harvest-lib@2.23.0) (2020-11-11)


### Features

* Remove show contracts flag and toggle contract sync flag ([336d279](https://github.com/cozy/cozy-libs/commit/336d279))
* Update cozy-ui ([2d3c497](https://github.com/cozy/cozy-libs/commit/2d3c497))
* Use SVGr icons in harvest ([c877448](https://github.com/cozy/cozy-libs/commit/c877448))





## [2.22.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.22.0...cozy-harvest-lib@2.22.1) (2020-11-05)

**Note:** Version bump only for package cozy-harvest-lib





# [2.22.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.21.0...cozy-harvest-lib@2.22.0) (2020-10-28)


### Features

* **Harvest:** Upgrade cozy-bi-auth to 0.0.14 ([01537c1](https://github.com/cozy/cozy-libs/commit/01537c1))





# [2.21.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.20.0...cozy-harvest-lib@2.21.0) (2020-10-28)


### Features

* Add PropType for konnector/konnectorSlug ([31393fe](https://github.com/cozy/cozy-libs/commit/31393fe))





# [2.20.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.19.0...cozy-harvest-lib@2.20.0) (2020-10-22)


### Bug Fixes

* Do not use deprecated ListItemText props ([8d61589](https://github.com/cozy/cozy-libs/commit/8d61589))
* Track event call needs an object with name attribute ([d745599](https://github.com/cozy/cozy-libs/commit/d745599))


### Features

* Update cozy-ui ([5b0ea73](https://github.com/cozy/cozy-libs/commit/5b0ea73))





# [2.19.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.18.2...cozy-harvest-lib@2.19.0) (2020-10-19)


### Features

* Use @cozy/minilog instead of minilog ([621abad](https://github.com/cozy/cozy-libs/commit/621abad))





## [2.18.2](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.18.1...cozy-harvest-lib@2.18.2) (2020-10-16)

**Note:** Version bump only for package cozy-harvest-lib





## [2.18.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.18.0...cozy-harvest-lib@2.18.1) (2020-10-14)


### Bug Fixes

* **Harvest:** Better diffentiate bankId ([bdf3119](https://github.com/cozy/cozy-libs/commit/bdf3119))
* **Harvest:** Handle busy and disabled state of connect button ([14002f1](https://github.com/cozy/cozy-libs/commit/14002f1))
* **Harvest:** No more permission needed to open the popup ([e7e591a](https://github.com/cozy/cozy-libs/commit/e7e591a))
* **Harvest:** Replace referencences to linxo by cozy ([004f663](https://github.com/cozy/cozy-libs/commit/004f663))





# [2.18.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.17.0...cozy-harvest-lib@2.18.0) (2020-10-13)


### Bug Fixes

* **Harvest:** Rename moreParams to extraParams ([2c5ea04](https://github.com/cozy/cozy-libs/commit/2c5ea04))


### Features

* **Harvest:** Add some unit tests ([522723f](https://github.com/cozy/cozy-libs/commit/522723f))
* **Harvest:** CreateTemporarToken does not need the account ([d9dfd7a](https://github.com/cozy/cozy-libs/commit/d9dfd7a))
* **Harvest:** Handle bi webauth connectors ([9f71f8c](https://github.com/cozy/cozy-libs/commit/9f71f8c))
* **Harvest:** Upgrade cozy-bi-auth ([87b0022](https://github.com/cozy/cozy-libs/commit/87b0022))





# [2.17.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.16.4...cozy-harvest-lib@2.17.0) (2020-10-07)


### Bug Fixes

* Solve warning for modal aria-label ([eb70908](https://github.com/cozy/cozy-libs/commit/eb70908))


### Features

* Export TrackingContext ([dc17fd3](https://github.com/cozy/cozy-libs/commit/dc17fd3))
* Track events in harvest (only after user consent) ([57151de](https://github.com/cozy/cozy-libs/commit/57151de))
* Track page edit account modal ([9f5d13a](https://github.com/cozy/cozy-libs/commit/9f5d13a))
* Track pages inside harvest ([0060103](https://github.com/cozy/cozy-libs/commit/0060103))





## [2.16.4](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.16.3...cozy-harvest-lib@2.16.4) (2020-10-05)


### Bug Fixes

* Put cozy-flags as peer-dep ([3c48581](https://github.com/cozy/cozy-libs/commit/3c48581))





## [2.16.3](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.16.2...cozy-harvest-lib@2.16.3) (2020-10-01)

**Note:** Version bump only for package cozy-harvest-lib





## [2.16.2](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.16.1...cozy-harvest-lib@2.16.2) (2020-10-01)


### Bug Fixes

* Lint issue ([aa10617](https://github.com/cozy/cozy-libs/commit/aa10617))





## [2.16.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.16.0...cozy-harvest-lib@2.16.1) (2020-09-29)


### Bug Fixes

* **Harvest:** Display disconnect button for OAuth connectors ([257c37a](https://github.com/cozy/cozy-libs/commit/257c37a))





# [2.16.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.15.1...cozy-harvest-lib@2.16.0) (2020-09-29)


### Features

* Add redirectSlug to OAuthWindow ([#1113](https://github.com/cozy/cozy-libs/issues/1113)) ([114ac74](https://github.com/cozy/cozy-libs/commit/114ac74))





## [2.15.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.15.0...cozy-harvest-lib@2.15.1) (2020-09-28)


### Bug Fixes

* Set peerDep same as devDep ([55289d7](https://github.com/cozy/cozy-libs/commit/55289d7))





# [2.15.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.14.1...cozy-harvest-lib@2.15.0) (2020-09-28)


### Bug Fixes

* Do not show sync contract switch if no konnector is passed ([5267d32](https://github.com/cozy/cozy-libs/commit/5267d32))
* Typo in import ([72a03d0](https://github.com/cozy/cozy-libs/commit/72a03d0))


### Features

* Add close button to edit contract modal ([8b5340e](https://github.com/cozy/cozy-libs/commit/8b5340e))
* Better descriptions for the sync contract switch ([448fdcd](https://github.com/cozy/cozy-libs/commit/448fdcd))
* Better EditContractDialog ([f43ae48](https://github.com/cozy/cozy-libs/commit/f43ae48))
* By default show a select box to select the contact in EditContract ([e1e575d](https://github.com/cozy/cozy-libs/commit/e1e575d))
* Update cozy-ui dev dependency ([3e487bf](https://github.com/cozy/cozy-libs/commit/3e487bf))
* Use DialogBackButton from cozy-ui ([8156a7b](https://github.com/cozy/cozy-libs/commit/8156a7b))





## [2.14.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.14.0...cozy-harvest-lib@2.14.1) (2020-09-28)


### Bug Fixes

* **Harvest:** Use cozy-realtime for OAuth popup communication ([209e15b](https://github.com/cozy/cozy-libs/commit/209e15b))





# [2.14.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.13.4...cozy-harvest-lib@2.14.0) (2020-09-17)


### Bug Fixes

* Correctly use t function ([f11b3c6](https://github.com/cozy/cozy-libs/commit/f11b3c6))
* Correctly use t function ([ff0d6cc](https://github.com/cozy/cozy-libs/commit/ff0d6cc))
* Typo in comment ([01a2e52](https://github.com/cozy/cozy-libs/commit/01a2e52))


### Features

* Add softDeleteOrRestoreAccounts service ([1fd0131](https://github.com/cozy/cozy-libs/commit/1fd0131))





## [2.13.4](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.13.3...cozy-harvest-lib@2.13.4) (2020-09-16)


### Bug Fixes

* Check for message.startsWith since console.warn can be called with ([2c00ae2](https://github.com/cozy/cozy-libs/commit/2c00ae2))
* Handle cases where io.cozy.accounts does not have contract ([66bcd5c](https://github.com/cozy/cozy-libs/commit/66bcd5c))





## [2.13.3](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.13.2...cozy-harvest-lib@2.13.3) (2020-09-15)


### Bug Fixes

* Correct disabling of account on BI side ([84567fc](https://github.com/cozy/cozy-libs/commit/84567fc))





## [2.13.2](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.13.1...cozy-harvest-lib@2.13.2) (2020-09-15)

**Note:** Version bump only for package cozy-harvest-lib





## [2.13.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.13.0...cozy-harvest-lib@2.13.1) (2020-09-14)


### Bug Fixes

* Use model helpers and add test for SyncContractSwitch ([be0f899](https://github.com/cozy/cozy-libs/commit/be0f899))





# [2.13.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.12.1...cozy-harvest-lib@2.13.0) (2020-09-14)


### Features

* Update cozy-bi-auth ([df0945a](https://github.com/cozy/cozy-libs/commit/df0945a))





## [2.12.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.12.0...cozy-harvest-lib@2.12.1) (2020-09-14)

**Note:** Version bump only for package cozy-harvest-lib





# [2.12.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.11.1...cozy-harvest-lib@2.12.0) (2020-09-14)


### Bug Fixes

* Remove old prop type ([08dbf6b](https://github.com/cozy/cozy-libs/commit/08dbf6b))
* **Harvest:** Unit tests ([1f82509](https://github.com/cozy/cozy-libs/commit/1f82509))


### Features

* Create a spec to fetch an account ([0cd67f0](https://github.com/cozy/cozy-libs/commit/0cd67f0))
* Set the sync status of an io.cozy.bank.accounts ([64e0cf5](https://github.com/cozy/cozy-libs/commit/64e0cf5))
* Use HasMany static helpers instead of adhoc methods ([2cf1ea6](https://github.com/cozy/cozy-libs/commit/2cf1ea6))
* Use metadata field instead of meta inside of relationship ([d0b6e74](https://github.com/cozy/cozy-libs/commit/d0b6e74))
* Use methods from cozy-client ([482642e](https://github.com/cozy/cozy-libs/commit/482642e))





## [2.11.2](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.11.1...cozy-harvest-lib@2.11.2) (2020-09-11)


### Bug Fixes

* **Harvest:** Unit tests ([1f82509](https://github.com/cozy/cozy-libs/commit/1f82509))





## [2.11.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.11.0...cozy-harvest-lib@2.11.1) (2020-09-08)


### Bug Fixes

* Lint ([174bbcc](https://github.com/cozy/cozy-libs/commit/174bbcc))
* Remove extra margin ([7c0ddb4](https://github.com/cozy/cozy-libs/commit/7c0ddb4))





# [2.11.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.10.1...cozy-harvest-lib@2.11.0) (2020-09-07)


### Features

* Disconnnect modal should not be fullscreen on mobile ([e758ddf](https://github.com/cozy/cozy-libs/commit/e758ddf))
* Use semantic color instead of absolute color ([4102824](https://github.com/cozy/cozy-libs/commit/4102824))





## [2.10.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.10.0...cozy-harvest-lib@2.10.1) (2020-09-07)


### Bug Fixes

* Use primaryColor instead of dodgerBlue ([e70b0a6](https://github.com/cozy/cozy-libs/commit/e70b0a6))





# [2.10.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.9.1...cozy-harvest-lib@2.10.0) (2020-09-07)


### Bug Fixes

* Remove Cozy from wording so that the modal can work on other envs ([0a82834](https://github.com/cozy/cozy-libs/commit/0a82834))


### Features

* Export relatedAppsConfiguration ([a226225](https://github.com/cozy/cozy-libs/commit/a226225))





## [2.9.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.9.0...cozy-harvest-lib@2.9.1) (2020-09-04)

**Note:** Version bump only for package cozy-harvest-lib





# [2.9.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.8.1...cozy-harvest-lib@2.9.0) (2020-09-04)


### Bug Fixes

* Add margin after tabs on desktop ([72d6441](https://github.com/cozy/cozy-libs/commit/72d6441))
* LastUpdate is null when the query has not yet been fetched ([e73dd42](https://github.com/cozy/cozy-libs/commit/e73dd42))
* Make sure the error has a margin with the tabs ([95d0b37](https://github.com/cozy/cozy-libs/commit/95d0b37))
* Use useI18n from full path ([5e4654d](https://github.com/cozy/cozy-libs/commit/5e4654d))


### Features

* Add deletion confirmation modal ([fb25348](https://github.com/cozy/cozy-libs/commit/fb25348))
* Use NavigationList inside ConfigurationTab ([1e4c71a](https://github.com/cozy/cozy-libs/commit/1e4c71a))





## [2.8.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.8.0...cozy-harvest-lib@2.8.1) (2020-09-03)


### Bug Fixes

* Add necessary aria-label on DisconnectedModal ([6446c25](https://github.com/cozy/cozy-libs/commit/6446c25))





# [2.8.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.7.0...cozy-harvest-lib@2.8.0) (2020-09-02)


### Bug Fixes

* Correct className on ListItem ([7c2cd48](https://github.com/cozy/cozy-libs/commit/7c2cd48))
* Use correct variable to check the length ([9e5d35a](https://github.com/cozy/cozy-libs/commit/9e5d35a))


### Features

* Make the KonnectorModalHeader smaller when there is no children ([fcf0c82](https://github.com/cozy/cozy-libs/commit/fcf0c82))
* Removed the prop doctype that can be implied from the data ([aa39298](https://github.com/cozy/cozy-libs/commit/aa39298))
* Tweak DisconnectedAccountModal so that matches the AccountModal ([278008a](https://github.com/cozy/cozy-libs/commit/278008a))
* Tweak margins of ConfigurationTab and KonnectorAccountTabs ([f5725c0](https://github.com/cozy/cozy-libs/commit/f5725c0))





# [2.7.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.6.1...cozy-harvest-lib@2.7.0) (2020-09-01)



## 2.2.1 (2020-09-01)


### Bug Fixes

* Use Divider component ([68a661e](https://github.com/cozy/cozy-libs/commit/68a661e))
* **Harvest:** Add margin on top of the website link ([8e8b962](https://github.com/cozy/cozy-libs/commit/8e8b962))
* **Harvest:** Better unit tests for WebsiteLinkCard ([eecd7d1](https://github.com/cozy/cozy-libs/commit/eecd7d1)), closes [/github.com/cozy/cozy-libs/pull/1066#discussion_r479137378](https://github.com//github.com/cozy/cozy-libs/pull/1066/issues/discussion_r479137378)
* **Harvest:** Change hr separator height to 1px ([5e7e7b0](https://github.com/cozy/cozy-libs/commit/5e7e7b0))
* **Harvest:** Do not throw error on invalid url in manifest ([664a78d](https://github.com/cozy/cozy-libs/commit/664a78d))
* **Harvest:** Use css classes when possible ([494174f](https://github.com/cozy/cozy-libs/commit/494174f))


### Features

* Add website link in connector data ([321b771](https://github.com/cozy/cozy-libs/commit/321b771))





## [2.6.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.6.0...cozy-harvest-lib@2.6.1) (2020-09-01)


### Bug Fixes

* Handle case when all contracts have been deleted ([312ad73](https://github.com/cozy/cozy-libs/commit/312ad73))





# [2.6.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.5.1...cozy-harvest-lib@2.6.0) (2020-09-01)


### Features

* Ability to hide new account button on ConfigurationTab ([83fe00c](https://github.com/cozy/cozy-libs/commit/83fe00c))
* New account button to the right on desktop and fullWidth on mobile ([f611f2f](https://github.com/cozy/cozy-libs/commit/f611f2f))





## [2.5.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.5.0...cozy-harvest-lib@2.5.1) (2020-09-01)


### Bug Fixes

* **Harvest:** Add margin on top of the website link ([15a0abd](https://github.com/cozy/cozy-libs/commit/15a0abd))





# [2.5.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.4.2...cozy-harvest-lib@2.5.0) (2020-09-01)


### Bug Fixes

* No mention of Cozy Banks when deleting a bank account ([b1edc03](https://github.com/cozy/cozy-libs/commit/b1edc03))


### Features

* Ability to hide the account selection box in AccountModal ([a620ff6](https://github.com/cozy/cozy-libs/commit/a620ff6))
* Add a DisconnectedAccountModal ([beed0e5](https://github.com/cozy/cozy-libs/commit/beed0e5))
* Do not show app links to current app ([2d960b3](https://github.com/cozy/cozy-libs/commit/2d960b3))
* Use a ListItem to delete the account ([792bcf3](https://github.com/cozy/cozy-libs/commit/792bcf3))





## [2.4.2](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.4.1...cozy-harvest-lib@2.4.2) (2020-08-31)


### Bug Fixes

* **Harvest:** Change hr separator height to 1px ([e4888f7](https://github.com/cozy/cozy-libs/commit/e4888f7))
* Use Divider component ([9981c42](https://github.com/cozy/cozy-libs/commit/9981c42))





## [2.4.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.4.0...cozy-harvest-lib@2.4.1) (2020-08-31)


### Bug Fixes

* **Harvest:** Better unit tests for WebsiteLinkCard ([6155ecb](https://github.com/cozy/cozy-libs/commit/6155ecb)), closes [/github.com/cozy/cozy-libs/pull/1066#discussion_r479137378](https://github.com//github.com/cozy/cozy-libs/pull/1066/issues/discussion_r479137378)





# [2.4.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.3.1...cozy-harvest-lib@2.4.0) (2020-08-31)


### Bug Fixes

* **Harvest:** Use css classes when possible ([6e5bf5e](https://github.com/cozy/cozy-libs/commit/6e5bf5e))


### Features

* Add website link in connector data ([755c547](https://github.com/cozy/cozy-libs/commit/755c547))





## [2.3.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.3.0...cozy-harvest-lib@2.3.1) (2020-08-30)


### Bug Fixes

* Use correct key in french locales ([11589d8](https://github.com/cozy/cozy-libs/commit/11589d8))





# [2.3.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.2.0...cozy-harvest-lib@2.3.0) (2020-08-30)


### Bug Fixes

* Add cancel in locales ([93880a3](https://github.com/cozy/cozy-libs/commit/93880a3))
* Cannot use several ListSecondaryAction, use only 1 with wrapping div ([ade9203](https://github.com/cozy/cozy-libs/commit/ade9203))
* Contracts query was wrong (a relationship 1-1 has a data attribute) ([124c262](https://github.com/cozy/cozy-libs/commit/124c262))
* Wrap AccountModal into withLocales so that it is self sufficient ([7a85630](https://github.com/cozy/cozy-libs/commit/7a85630))


### Features

* Ability to force the initialActiveTab of AccountModal ([9c602c7](https://github.com/cozy/cozy-libs/commit/9c602c7))
* Ability to pass the triggers prop directly to KonnectorAccounts ([20c12b8](https://github.com/cozy/cozy-libs/commit/20c12b8))
* Add onError callback for EditContract ([96383da](https://github.com/cozy/cozy-libs/commit/96383da))
* Do not display the contracts if there are no contracts to display ([8bd56ee](https://github.com/cozy/cozy-libs/commit/8bd56ee))
* Hide contracts modal after saving a contract ([967910d](https://github.com/cozy/cozy-libs/commit/967910d))
* KonnectorIcon can take a konnectorSlug directly ([4f7b212](https://github.com/cozy/cozy-libs/commit/4f7b212))
* Pass error to onError callback ([c018769](https://github.com/cozy/cozy-libs/commit/c018769))
* Re-organize EditContract code for buttons to be in correct layout ([5c690b0](https://github.com/cozy/cozy-libs/commit/5c690b0))
* Remove the io.cozy.*.accounts feature ([566c6f5](https://github.com/cozy/cozy-libs/commit/566c6f5))
* Remove translate() as the component uses useI18n ([9c372bd](https://github.com/cozy/cozy-libs/commit/9c372bd))
* Tweaks to ConfigurationTab layout and wording ([49d418f](https://github.com/cozy/cozy-libs/commit/49d418f))
* Use slateGrey instead of coolGrey for icons ([40ecf33](https://github.com/cozy/cozy-libs/commit/40ecf33))





# [2.2.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.1.1...cozy-harvest-lib@2.2.0) (2020-08-26)


### Features

* Deactivate logging for harvest during tests ([d49ce55](https://github.com/cozy/cozy-libs/commit/d49ce55))





## [2.1.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.1.0...cozy-harvest-lib@2.1.1) (2020-08-25)


### Bug Fixes

* **Harvest:** Change maif bi api url ([1b6a924](https://github.com/cozy/cozy-libs/commit/1b6a924))





# [2.1.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@2.0.0...cozy-harvest-lib@2.1.0) (2020-08-25)


### Features

* **Harvest:** Locale change for SCA_REQUIRED error message ([b7611c4](https://github.com/cozy/cozy-libs/commit/b7611c4))





# [2.0.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.41.5...cozy-harvest-lib@2.0.0) (2020-08-21)


### Bug Fixes

* T is not longer required as it is taken from the context ([ede5725](https://github.com/cozy/cozy-libs/commit/ede5725))
* Typo ([8c24b4b](https://github.com/cozy/cozy-libs/commit/8c24b4b))
* Use correct capitalisation ([f0943bc](https://github.com/cozy/cozy-libs/commit/f0943bc))


### Features

* Add ErrorBoundary on KonnectorAccounts ([0c2c422](https://github.com/cozy/cozy-libs/commit/0c2c422))
* Extract contract doctype from konnector ([43cff34](https://github.com/cozy/cozy-libs/commit/43cff34))
* Make attribute setting dependent on the doctype ([8ee1c9e](https://github.com/cozy/cozy-libs/commit/8ee1c9e))
* On mobile, have ListItems go from edge to edge ([c4b798d](https://github.com/cozy/cozy-libs/commit/c4b798d))
* Show contracts that have been fetched for an io.cozy.accounts ([d53b966](https://github.com/cozy/cozy-libs/commit/d53b966))
* Show EditForm and label contract section depending on doctype ([84a2cf1](https://github.com/cozy/cozy-libs/commit/84a2cf1))
* Update cozy-ui across all libs ([73549b0](https://github.com/cozy/cozy-libs/commit/73549b0))
* Use ExperimentalDialog instead of Modal ([34b1150](https://github.com/cozy/cozy-libs/commit/34b1150))
* Use ExperimentalDialog instead of Modal for deletion confirmation ([ce3997a](https://github.com/cozy/cozy-libs/commit/ce3997a))
* Use List components for ConfigurationTab ([97ed0ab](https://github.com/cozy/cozy-libs/commit/97ed0ab))


### BREAKING CHANGES

* The host app using harvest must wrap harvest inside
a <BreakpointsProvider />. This is most easily done at the root of the
app.





## [1.41.5](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.41.4...cozy-harvest-lib@1.41.5) (2020-08-20)

**Note:** Version bump only for package cozy-harvest-lib





## [1.41.4](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.41.3...cozy-harvest-lib@1.41.4) (2020-08-20)

**Note:** Version bump only for package cozy-harvest-lib





## [1.41.3](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.41.2...cozy-harvest-lib@1.41.3) (2020-08-19)


### Bug Fixes

* **Harvest:** Maif epa url association error ([25e6dc8](https://github.com/cozy/cozy-libs/commit/25e6dc8))





## [1.41.2](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.41.1...cozy-harvest-lib@1.41.2) (2020-08-05)

**Note:** Version bump only for package cozy-harvest-lib





## [1.41.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.41.0...cozy-harvest-lib@1.41.1) (2020-08-03)

**Note:** Version bump only for package cozy-harvest-lib





# [1.41.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.40.0...cozy-harvest-lib@1.41.0) (2020-07-30)


### Features

* **Harvest:** Add maif bi url for bi account creation ([dda0cb6](https://github.com/cozy/cozy-libs/commit/dda0cb6))





# [1.40.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.39.1...cozy-harvest-lib@1.40.0) (2020-07-27)


### Features

* Use logger from harvest for BI ([9df7b4c](https://github.com/cozy/cozy-libs/commit/9df7b4c))





## [1.39.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.39.0...cozy-harvest-lib@1.39.1) (2020-07-23)


### Bug Fixes

* Manually add window.opener in OAuth popup ([6dcd67a](https://github.com/cozy/cozy-libs/commit/6dcd67a))





# [1.39.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.38.1...cozy-harvest-lib@1.39.0) (2020-07-22)


### Features

* Turn off logging by default on harvest ([89eeae7](https://github.com/cozy/cozy-libs/commit/89eeae7))





## [1.38.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.38.0...cozy-harvest-lib@1.38.1) (2020-07-21)


### Bug Fixes

* Use same Cozy-UI and CozyClient version everywhere ([6216e62](https://github.com/cozy/cozy-libs/commit/6216e62))





# [1.38.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.37.0...cozy-harvest-lib@1.38.0) (2020-07-20)


### Features

* Update cozy-client ([14ca0b9](https://github.com/cozy/cozy-libs/commit/14ca0b9))
* Update cozy-ui ([a8710f9](https://github.com/cozy/cozy-libs/commit/a8710f9))





# [1.37.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.36.6...cozy-harvest-lib@1.37.0) (2020-07-16)


### Features

* Update lodash accross all packages ([6a20128](https://github.com/cozy/cozy-libs/commit/6a20128))





## [1.36.6](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.36.5...cozy-harvest-lib@1.36.6) (2020-07-08)

**Note:** Version bump only for package cozy-harvest-lib





## [1.36.5](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.36.4...cozy-harvest-lib@1.36.5) (2020-07-08)

**Note:** Version bump only for package cozy-harvest-lib





## [1.36.4](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.36.3...cozy-harvest-lib@1.36.4) (2020-07-07)

**Note:** Version bump only for package cozy-harvest-lib





## [1.36.3](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.36.2...cozy-harvest-lib@1.36.3) (2020-06-25)


### Bug Fixes

* Update a not shared-with-cozy cipher from harvest ([1ff07cd](https://github.com/cozy/cozy-libs/commit/1ff07cd))





## [1.36.2](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.36.1...cozy-harvest-lib@1.36.2) (2020-06-17)

**Note:** Version bump only for package cozy-harvest-lib





## [1.36.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.36.0...cozy-harvest-lib@1.36.1) (2020-06-16)


### Bug Fixes

* **Harvest:** Change prod/sandbox environment detection ([adff14a](https://github.com/cozy/cozy-libs/commit/adff14a))





# [1.36.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.35.0...cozy-harvest-lib@1.36.0) (2020-06-10)


### Features

* Remove undocumented local.config.json ([8c59662](https://github.com/cozy/cozy-libs/commit/8c59662))





# [1.35.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.34.2...cozy-harvest-lib@1.35.0) (2020-06-09)


### Features

* Remove flag bi-konnector-policy ([b546fcc](https://github.com/cozy/cozy-libs/commit/b546fcc))





## [1.34.2](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.34.1...cozy-harvest-lib@1.34.2) (2020-06-09)

**Note:** Version bump only for package cozy-harvest-lib





## [1.34.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.34.0...cozy-harvest-lib@1.34.1) (2020-06-05)


### Bug Fixes

* Add "back" locale to remove warning in console ([c5070dc](https://github.com/cozy/cozy-libs/commit/c5070dc))
* Add aria label on modal to remove console warning ([f16d42a](https://github.com/cozy/cozy-libs/commit/f16d42a))
* Save cipher if fields have changed ([24fe44c](https://github.com/cozy/cozy-libs/commit/24fe44c))





# [1.34.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.33.1...cozy-harvest-lib@1.34.0) (2020-06-05)


### Features

* Support old cipher relationship format ([fa6e534](https://github.com/cozy/cozy-libs/commit/fa6e534)), closes [/github.com/cozy/cozy-stack/pull/2535#discussion_r433986611](https://github.com//github.com/cozy/cozy-stack/pull/2535/issues/discussion_r433986611)





## [1.33.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.33.0...cozy-harvest-lib@1.33.1) (2020-06-03)

**Note:** Version bump only for package cozy-harvest-lib





# [1.33.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.32.5...cozy-harvest-lib@1.33.0) (2020-05-29)


### Bug Fixes

* Bad relationship was used in test ([b0085e6](https://github.com/cozy/cozy-libs/commit/b0085e6))
* Remove test testing implementation ([d3a4f57](https://github.com/cozy/cozy-libs/commit/d3a4f57))


### Features

* Support additional fields in cipher ([8ca5a01](https://github.com/cozy/cozy-libs/commit/8ca5a01))
* Update additional fields when updating accounts from ciphers ([cee7dcb](https://github.com/cozy/cozy-libs/commit/cee7dcb))





## [1.32.5](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.32.4...cozy-harvest-lib@1.32.5) (2020-04-09)


### Bug Fixes

* **Harvest:** Feed konnector to the flow in the trigger launcher ([361f909](https://github.com/cozy/cozy-libs/commit/361f909))
* **Harvest:** Keep watching connection flow on result ([5a9e17b](https://github.com/cozy/cozy-libs/commit/5a9e17b))





## [1.32.4](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.32.3...cozy-harvest-lib@1.32.4) (2020-03-26)

**Note:** Version bump only for package cozy-harvest-lib





## [1.32.3](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.32.2...cozy-harvest-lib@1.32.3) (2020-03-11)


### Bug Fixes

* Decrypt called on null ([a2e7876](https://github.com/cozy/cozy-libs/commit/a2e7876))





## [1.32.2](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.32.1...cozy-harvest-lib@1.32.2) (2020-03-10)


### Bug Fixes

* Bad password matching would result in null fields ([743282e](https://github.com/cozy/cozy-libs/commit/743282e))





## [1.32.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.32.0...cozy-harvest-lib@1.32.1) (2020-03-08)


### Bug Fixes

* Last execution time is correctly refreshed ([9bcf499](https://github.com/cozy/cozy-libs/commit/9bcf499))





# [1.32.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.31.0...cozy-harvest-lib@1.32.0) (2020-03-03)


### Features

* **realtime:** Reacts to visibility changes ([4ce703e](https://github.com/cozy/cozy-libs/commit/4ce703e))





# [1.31.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.30.0...cozy-harvest-lib@1.31.0) (2020-03-03)


### Features

* Hide password toggle when field is empty ([1fb9993](https://github.com/cozy/cozy-libs/commit/1fb9993))





# [1.30.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.29.5...cozy-harvest-lib@1.30.0) (2020-03-02)


### Bug Fixes

* Fix typo and reorder sentence ([59b7d3c](https://github.com/cozy/cozy-libs/commit/59b7d3c))
* LaunchTriggerCard uses the same flow as its container ([1f747be](https://github.com/cozy/cozy-libs/commit/1f747be))
* Success URL does not included undefined anymore ([138bbf1](https://github.com/cozy/cozy-libs/commit/138bbf1))


### Features

* Use flowProps in LaunchTriggerCard ([6bafab1](https://github.com/cozy/cozy-libs/commit/6bafab1))





## [1.29.5](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.29.4...cozy-harvest-lib@1.29.5) (2020-02-27)


### Bug Fixes

* Revert "Merge pull request [#974](https://github.com/cozy/cozy-libs/issues/974) from cozy/feat/RemovePropTypes" ([2d15d78](https://github.com/cozy/cozy-libs/commit/2d15d78))





## [1.29.4](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.29.3...cozy-harvest-lib@1.29.4) (2020-02-27)


### Bug Fixes

* Drive link from harvest ([e8d8809](https://github.com/cozy/cozy-libs/commit/e8d8809))





## [1.29.3](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.29.2...cozy-harvest-lib@1.29.3) (2020-02-26)

**Note:** Version bump only for package cozy-harvest-lib





## [1.29.2](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.29.1...cozy-harvest-lib@1.29.2) (2020-02-26)

**Note:** Version bump only for package cozy-harvest-lib





## [1.29.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.29.0...cozy-harvest-lib@1.29.1) (2020-02-26)


### Bug Fixes

* Tell the right thing for app 2FA ([e1035d2](https://github.com/cozy/cozy-libs/commit/e1035d2))





# [1.29.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.28.1...cozy-harvest-lib@1.29.0) (2020-02-25)


### Features

* Remove proptype in production mode ([4287527](https://github.com/cozy/cozy-libs/commit/4287527))





## [1.28.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.28.0...cozy-harvest-lib@1.28.1) (2020-02-24)

**Note:** Version bump only for package cozy-harvest-lib





# [1.28.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.27.6...cozy-harvest-lib@1.28.0) (2020-02-24)


### Features

* Rewrite of realtime ([1022af7](https://github.com/cozy/cozy-libs/commit/1022af7))





## [1.27.6](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.27.5...cozy-harvest-lib@1.27.6) (2020-02-24)

**Note:** Version bump only for package cozy-harvest-lib





## [1.27.5](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.27.4...cozy-harvest-lib@1.27.5) (2020-02-24)

**Note:** Version bump only for package cozy-harvest-lib





## [1.27.4](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.27.3...cozy-harvest-lib@1.27.4) (2020-02-24)

**Note:** Version bump only for package cozy-harvest-lib





## [1.27.3](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.27.2...cozy-harvest-lib@1.27.3) (2020-02-20)


### Bug Fixes

* Support Budget Insight alternate schema for update connection ([9f0702b](https://github.com/cozy/cozy-libs/commit/9f0702b))





## [1.27.2](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.27.1...cozy-harvest-lib@1.27.2) (2020-02-18)


### Bug Fixes

* Account correctly created with the account_type property ([599da35](https://github.com/cozy/cozy-libs/commit/599da35))





## [1.27.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.27.0...cozy-harvest-lib@1.27.1) (2020-02-18)

**Note:** Version bump only for package cozy-harvest-lib





# [1.27.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.26.3...cozy-harvest-lib@1.27.0) (2020-02-18)


### Bug Fixes

* Make DriveLink similar to BankLink ([5b7fbbf](https://github.com/cozy/cozy-libs/commit/5b7fbbf))


### Features

* Different labels for store links ([ed3c48d](https://github.com/cozy/cozy-libs/commit/ed3c48d))
* Fallback links in harvest app cards ([efbe550](https://github.com/cozy/cozy-libs/commit/efbe550))
* Redirect to store page instead of installation page ([2e0b985](https://github.com/cozy/cozy-libs/commit/2e0b985))





## [1.26.3](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.26.2...cozy-harvest-lib@1.26.3) (2020-02-18)


### Bug Fixes

* Load current konnector error ([e3245db](https://github.com/cozy/cozy-libs/commit/e3245db))





## [1.26.2](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.26.1...cozy-harvest-lib@1.26.2) (2020-02-17)

**Note:** Version bump only for package cozy-harvest-lib





## [1.26.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.26.0...cozy-harvest-lib@1.26.1) (2020-02-17)

**Note:** Version bump only for package cozy-harvest-lib





# [1.26.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.25.0...cozy-harvest-lib@1.26.0) (2020-02-17)


### Bug Fixes

* AccountForm error is from triggerError ([ccd30a9](https://github.com/cozy/cozy-libs/commit/ccd30a9))
* Assert the job passed to KonnectorJobWatcher has an id ([0daf312](https://github.com/cozy/cozy-libs/commit/0daf312))
* **EditAccountModal:** Use directly client helper instead of mutation ([703e5db](https://github.com/cozy/cozy-libs/commit/703e5db))
* Correctly follow ConnectionFlow ([f8e10fd](https://github.com/cozy/cozy-libs/commit/f8e10fd))
* Correctly take flow from props ([2f104e4](https://github.com/cozy/cozy-libs/commit/2f104e4))
* LaunchTriggerCard uses flow ([2eb7d82](https://github.com/cozy/cozy-libs/commit/2eb7d82))
* Pass t correctly ([befa573](https://github.com/cozy/cozy-libs/commit/befa573))
* Proptype ([521d2a2](https://github.com/cozy/cozy-libs/commit/521d2a2))
* Revert to old KonnectorJob constructor ([b539ad9](https://github.com/cozy/cozy-libs/commit/b539ad9))
* TriggerLauncher correctly executes callbacks with the trigger ([94115da](https://github.com/cozy/cozy-libs/commit/94115da))
* When handling decoupled error, automatically triggers resume=true ([8db6740](https://github.com/cozy/cozy-libs/commit/8db6740))


### Features

* Add accountError to ConnectionFlow state ([f31963a](https://github.com/cozy/cozy-libs/commit/f31963a))
* Add logs ([dde448a](https://github.com/cozy/cozy-libs/commit/dde448a))
* Completely proxy the event from KonnectorJobWatcher to KonnectorJob ([91409d2](https://github.com/cozy/cozy-libs/commit/91409d2))
* Remove listeners on unmount ([765753a](https://github.com/cozy/cozy-libs/commit/765753a))
* Rename flag to add namespace ([2629909](https://github.com/cozy/cozy-libs/commit/2629909))
* Rename TriggerLauncher into FlowProvider ([33c951d](https://github.com/cozy/cozy-libs/commit/33c951d))
* Update cozy-flags ([75e0bb8](https://github.com/cozy/cozy-libs/commit/75e0bb8))





# [1.25.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.24.5...cozy-harvest-lib@1.25.0) (2020-02-10)


### Features

* **cozy-harvest-lib:** Add logs to updateAccountsPassword service ([32fca31](https://github.com/cozy/cozy-libs/commit/32fca31))





## [1.24.5](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.24.4...cozy-harvest-lib@1.24.5) (2020-02-07)


### Bug Fixes

* **cozy-harvest-lib:** Show account form on account edition ([57531a2](https://github.com/cozy/cozy-libs/commit/57531a2))





## [1.24.4](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.24.3...cozy-harvest-lib@1.24.4) (2020-02-07)


### Bug Fixes

* **cozy-harvest-lib:** Back button on account form ([15e64e0](https://github.com/cozy/cozy-libs/commit/15e64e0))





## [1.24.3](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.24.2...cozy-harvest-lib@1.24.3) (2020-02-07)


### Bug Fixes

* **cozy-harvest-lib:** Don't duplicate cipher on selection ([3d21176](https://github.com/cozy/cozy-libs/commit/3d21176))
* **cozy-harvest-lib:** Make warning log clearer ([9c2ef2d](https://github.com/cozy/cozy-libs/commit/9c2ef2d))





## [1.24.2](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.24.1...cozy-harvest-lib@1.24.2) (2020-02-06)


### Bug Fixes

* **cozy-harvest-lib:** Always show account form when editing an account ([a8718cd](https://github.com/cozy/cozy-libs/commit/a8718cd))





## [1.24.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.24.0...cozy-harvest-lib@1.24.1) (2020-02-05)


### Bug Fixes

* **cozy-harvest-lib:** The onVaultDismiss prop is not required ([87dbd39](https://github.com/cozy/cozy-libs/commit/87dbd39))





# [1.24.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.23.1...cozy-harvest-lib@1.24.0) (2020-02-03)


### Features

* **cozy-harvest-lib:** Add deleteAccounts service ([8c78c6e](https://github.com/cozy/cozy-libs/commit/8c78c6e))





## [1.23.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.23.0...cozy-harvest-lib@1.23.1) (2020-02-03)


### Bug Fixes

* **cozy-harvest-lib:** Correctly check vault locked state ([61463f7](https://github.com/cozy/cozy-libs/commit/61463f7))





# [1.23.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.22.0...cozy-harvest-lib@1.23.0) (2020-01-31)


### Bug Fixes

* Submitting button returns to idle state after error ([c7edd4f](https://github.com/cozy/cozy-libs/commit/c7edd4f))


### Features

* Send bankId as part of the job options ([2cddda4](https://github.com/cozy/cozy-libs/commit/2cddda4))





# [1.22.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.21.1...cozy-harvest-lib@1.22.0) (2020-01-31)


### Bug Fixes

* Don't show drive link when empty save folder ([de0344a](https://github.com/cozy/cozy-libs/commit/de0344a))
* Migrate Infos components ([cacf3a4](https://github.com/cozy/cozy-libs/commit/cacf3a4))
* Supported nested and flat subdomains ([d33345f](https://github.com/cozy/cozy-libs/commit/d33345f))


### Features

* Display links to other apps ([9224253](https://github.com/cozy/cozy-libs/commit/9224253))





## [1.21.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.21.0...cozy-harvest-lib@1.21.1) (2020-01-31)


### Bug Fixes

* Remove extra translation context ([a36fd13](https://github.com/cozy/cozy-libs/commit/a36fd13))





# [1.21.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.20.2...cozy-harvest-lib@1.21.0) (2020-01-31)


### Bug Fixes

* Do not explode when vault is locked ([3b73427](https://github.com/cozy/cozy-libs/commit/3b73427))


### Features

* Convert BI errors to user errors shown in the UI ([3b82c30](https://github.com/cozy/cozy-libs/commit/3b82c30))





## [1.20.2](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.20.1...cozy-harvest-lib@1.20.2) (2020-01-30)

**Note:** Version bump only for package cozy-harvest-lib





## [1.20.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.20.0...cozy-harvest-lib@1.20.1) (2020-01-30)


### Bug Fixes

* Correctly handle BI errors ([94a29ae](https://github.com/cozy/cozy-libs/commit/94a29ae))





# [1.20.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.19.0...cozy-harvest-lib@1.20.0) (2020-01-30)


### Bug Fixes

* Go to accountForm if VaultUnlocker not going to be displayed ([387290b](https://github.com/cozy/cozy-libs/commit/387290b))
* Prevent infinite loop in useMaintenance hook ([1c3f4cc](https://github.com/cozy/cozy-libs/commit/1c3f4cc))
* Use correct id for BI connection in prod ([8b685f7](https://github.com/cozy/cozy-libs/commit/8b685f7))


### Features

* Add minilog with logs ([dd83369](https://github.com/cozy/cozy-libs/commit/dd83369))
* Add names to konnector policies for easier debugging ([5ed3f2a](https://github.com/cozy/cozy-libs/commit/5ed3f2a))





# [1.19.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.18.0...cozy-harvest-lib@1.19.0) (2020-01-29)


### Features

* Update cozy-bi-auth ([fc191ee](https://github.com/cozy/cozy-libs/commit/fc191ee))





# [1.18.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.17.3...cozy-harvest-lib@1.18.0) (2020-01-29)


### Bug Fixes

* Do not change passed account ([6875290](https://github.com/cozy/cozy-libs/commit/6875290))
* Remove console warnings ([536167a](https://github.com/cozy/cozy-libs/commit/536167a))
* Stop spinner on error ([981ce18](https://github.com/cozy/cozy-libs/commit/981ce18))
* Test warning ([ab499fa](https://github.com/cozy/cozy-libs/commit/ab499fa))
* Use client URI instead of window.location to determine BI mode ([e486bb0](https://github.com/cozy/cozy-libs/commit/e486bb0))
* Warning in Jest ([c80e6ef](https://github.com/cozy/cozy-libs/commit/c80e6ef))


### Features

* Ability to have a konnector policy ([98e1f8b](https://github.com/cozy/cozy-libs/commit/98e1f8b))
* Budget-Insight custom konnector policy ([6622b3d](https://github.com/cozy/cozy-libs/commit/6622b3d))





## [1.17.3](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.17.2...cozy-harvest-lib@1.17.3) (2020-01-28)


### Bug Fixes

* Add arial label to modal ([50fb617](https://github.com/cozy/cozy-libs/commit/50fb617))
* Handle trigger changes ([9f1d5ae](https://github.com/cozy/cozy-libs/commit/9f1d5ae))





## [1.17.2](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.17.1...cozy-harvest-lib@1.17.2) (2020-01-27)


### Bug Fixes

* **cozy-harvest-lib:** Don't show empty ciphers list in a flash ([12c671f](https://github.com/cozy/cozy-libs/commit/12c671f))
* **cozy-harvest-lib:** Use labelProps in Field to set aria-label ([fb7f5e2](https://github.com/cozy/cozy-libs/commit/fb7f5e2))





## [1.17.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.17.0...cozy-harvest-lib@1.17.1) (2020-01-24)


### Bug Fixes

* Remove prop warning ([b33d5a9](https://github.com/cozy/cozy-libs/commit/b33d5a9))


### Performance Improvements

* Mock cozy-keys-lib in TriggerManager ([c717a92](https://github.com/cozy/cozy-libs/commit/c717a92))





# [1.17.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.16.0...cozy-harvest-lib@1.17.0) (2020-01-21)


### Bug Fixes

* **cozy-harvest-lib:** Fix deps ([ee4a4cf](https://github.com/cozy/cozy-libs/commit/ee4a4cf))
* Share the cipher with cozy when editing a cipher ([#805](https://github.com/cozy/cozy-libs/issues/805)) ([2bbac67](https://github.com/cozy/cozy-libs/commit/2bbac67))
* **cozy-harvest-lib:** Correctly fetch accounts for given cipher id ([12d4942](https://github.com/cozy/cozy-libs/commit/12d4942))
* **cozy-harvest-lib:** Go back when dismissing the vault unlocker ([6da5ca0](https://github.com/cozy/cozy-libs/commit/6da5ca0))
* **cozy-harvest-lib:** Show empty form if creating account from nothing ([ff21cb1](https://github.com/cozy/cozy-libs/commit/ff21cb1))
* **cozy-harvest-lib:** Show spinner if selected cipher is complete ([9fb63f7](https://github.com/cozy/cozy-libs/commit/9fb63f7))
* **cozy-harvest-lib:** Update cozy-keys-lib to v1.9.0 ([4704526](https://github.com/cozy/cozy-libs/commit/4704526))
* **cozy-harvest-lib:** Update selected cipher if needed ([54c6bbe](https://github.com/cozy/cozy-libs/commit/54c6bbe))
* **cozy-harvest-lib:** Use cozy-ui transpiled imports only ([4dc984a](https://github.com/cozy/cozy-libs/commit/4dc984a))
* Use data in vaultCipher relationship ([88e0d8f](https://github.com/cozy/cozy-libs/commit/88e0d8f))
* **deps:** Update cozy-keys-lib to v1.10.0 ([2120f79](https://github.com/cozy/cozy-libs/commit/2120f79))
* **deps:** Update cozy-keys-lib to v1.9.4 ([d66cd08](https://github.com/cozy/cozy-libs/commit/d66cd08))
* **deps:** Update cozy-keys-lib to v1.9.6 ([5b4ff51](https://github.com/cozy/cozy-libs/commit/5b4ff51))
* **deps:** Update cozy-keys-lib to v2.5.2 ([40f0c53](https://github.com/cozy/cozy-libs/commit/40f0c53))
* **deps:** Update cozy-ui to v29.2.1 ([e5b0b18](https://github.com/cozy/cozy-libs/commit/e5b0b18))
* **TriggerManager:** Bypass ciphers list if there's no cipher ([6559fec](https://github.com/cozy/cozy-libs/commit/6559fec))
* **TriggerManager:** Bypass ciphers list when there's no choice in it ([64f76d8](https://github.com/cozy/cozy-libs/commit/64f76d8))
* **TriggerManager:** Handle existing account without cipher update ([5281fed](https://github.com/cozy/cozy-libs/commit/5281fed))


### Features

* **cozy-harvest-lib:** Handle identifier property ([ac6cf00](https://github.com/cozy/cozy-libs/commit/ac6cf00))
* Add prop types to VaultCiphersList ([7252a36](https://github.com/cozy/cozy-libs/commit/7252a36))
* **AccountField:** Make it non recognizable by browser extensions ([f35d7b5](https://github.com/cozy/cozy-libs/commit/f35d7b5))
* **AccountForm:** Add aria-label to ObfuscatedLabel ([102810d](https://github.com/cozy/cozy-libs/commit/102810d))
* **cozy-harvest-lib:** Cipher relationship should not be an array ([6a5770b](https://github.com/cozy/cozy-libs/commit/6a5770b))
* **cozy-harvest-lib:** Ciphers list back button ([19d7d61](https://github.com/cozy/cozy-libs/commit/19d7d61))
* **cozy-harvest-lib:** Don't show read-only identifier on creation ([363a818](https://github.com/cozy/cozy-libs/commit/363a818))
* **cozy-harvest-lib:** Handle decrypt errors in service ([f9bb105](https://github.com/cozy/cozy-libs/commit/f9bb105))
* **cozy-harvest-lib:** Identifier is not editable when from a cipher ([f849ea9](https://github.com/cozy/cozy-libs/commit/f849ea9))
* Go back to account form on error with selected cipher ([164281a](https://github.com/cozy/cozy-libs/commit/164281a))
* Show a spinner when selected cipher has all required values ([d49d8be](https://github.com/cozy/cozy-libs/commit/d49d8be))
* Update account username ([0c8f5e1](https://github.com/cozy/cozy-libs/commit/0c8f5e1))
* Update accounts script ([e22cdbb](https://github.com/cozy/cozy-libs/commit/e22cdbb))
* **cozy-harvest-lib:** Launch LOGIN_FAILED triggers after cipher update ([359c18e](https://github.com/cozy/cozy-libs/commit/359c18e))
* **cozy-harvest-lib:** Make TriggerManager usable standalone ([6392a78](https://github.com/cozy/cozy-libs/commit/6392a78))
* **cozy-harvest-lib:** Make TriggerManager work with locked vault ([90232c5](https://github.com/cozy/cozy-libs/commit/90232c5))
* **cozy-harvest-lib:** Show confirmation modal if edited an identifier ([762a460](https://github.com/cozy/cozy-libs/commit/762a460))
* **cozy-harvest-lib:** Use special char in obfuscated label ([7179281](https://github.com/cozy/cozy-libs/commit/7179281))





# [1.16.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.15.7...cozy-harvest-lib@1.16.0) (2020-01-15)


### Features

* Support SCA_REQUIRED and WEBAUTH_REQUIRED ([0829420](https://github.com/cozy/cozy-libs/commit/0829420))





## [1.15.7](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.15.6...cozy-harvest-lib@1.15.7) (2020-01-08)


### Bug Fixes

* Allow oauth without scope and handle array value ([b41fdd3](https://github.com/cozy/cozy-libs/commit/b41fdd3))





## [1.15.6](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.15.5...cozy-harvest-lib@1.15.6) (2019-12-19)


### Bug Fixes

* **cozy-harvest-lib:** KonnectorSuggestionModal actions alignement ([6149b7a](https://github.com/cozy/cozy-libs/commit/6149b7a))





## [1.15.5](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.15.4...cozy-harvest-lib@1.15.5) (2019-12-18)

**Note:** Version bump only for package cozy-harvest-lib





## [1.15.4](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.15.3...cozy-harvest-lib@1.15.4) (2019-12-13)

**Note:** Version bump only for package cozy-harvest-lib





## [1.15.3](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.15.2...cozy-harvest-lib@1.15.3) (2019-12-04)

**Note:** Version bump only for package cozy-harvest-lib





## [1.15.2](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.15.1...cozy-harvest-lib@1.15.2) (2019-11-29)


### Bug Fixes

* Konnector Success image ([1cec327](https://github.com/cozy/cozy-libs/commit/1cec327))
* Maintenance icon ([94d41ad](https://github.com/cozy/cozy-libs/commit/94d41ad))





## [1.15.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.15.0...cozy-harvest-lib@1.15.1) (2019-11-28)

**Note:** Version bump only for package cozy-harvest-lib





# [1.15.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.14.4...cozy-harvest-lib@1.15.0) (2019-11-26)


### Bug Fixes

* Guard against silencing errors ([a3756e3](https://github.com/cozy/cozy-libs/commit/a3756e3))
* Removed trailing slash ([8730eb4](https://github.com/cozy/cozy-libs/commit/8730eb4))
* Replace faulty illustration ([f789b3a](https://github.com/cozy/cozy-libs/commit/f789b3a))
* Upgrade cozy-client ([641de64](https://github.com/cozy/cozy-libs/commit/641de64))


### Features

* Added datatypes icons ([223130c](https://github.com/cozy/cozy-libs/commit/223130c))
* Distinguish between close and silencing modal ([cf72967](https://github.com/cozy/cozy-libs/commit/cf72967))
* Konnector suggestion modal ([1c247f1](https://github.com/cozy/cozy-libs/commit/1c247f1))
* Upgrade cozy-ui ([4df4f62](https://github.com/cozy/cozy-libs/commit/4df4f62))





## [1.14.4](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.14.3...cozy-harvest-lib@1.14.4) (2019-11-15)

**Note:** Version bump only for package cozy-harvest-lib





## [1.14.3](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.14.2...cozy-harvest-lib@1.14.3) (2019-11-13)

**Note:** Version bump only for package cozy-harvest-lib





## [1.14.2](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.14.1...cozy-harvest-lib@1.14.2) (2019-11-07)


### Bug Fixes

* Don't block the UI if maintenance status can't be fetched ([080b2d1](https://github.com/cozy/cozy-libs/commit/080b2d1))
* Don't poll the maintenance status for manually installed konnectors ([cfd38af](https://github.com/cozy/cozy-libs/commit/cfd38af))





## [1.14.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.14.0...cozy-harvest-lib@1.14.1) (2019-11-06)


### Bug Fixes

* README ([6681eb3](https://github.com/cozy/cozy-libs/commit/6681eb3))





# [1.14.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.13.5...cozy-harvest-lib@1.14.0) (2019-11-06)


### Bug Fixes

* Prop warning during tests ([6c6576f](https://github.com/cozy/cozy-libs/commit/6c6576f))


### Features

* Change texts for 2fa modal ([e7cf32e](https://github.com/cozy/cozy-libs/commit/e7cf32e))





## [1.13.5](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.13.4...cozy-harvest-lib@1.13.5) (2019-11-06)

**Note:** Version bump only for package cozy-harvest-lib





## [1.13.4](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.13.3...cozy-harvest-lib@1.13.4) (2019-11-06)

**Note:** Version bump only for package cozy-harvest-lib





## [1.13.3](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.13.2...cozy-harvest-lib@1.13.3) (2019-11-06)

**Note:** Version bump only for package cozy-harvest-lib





## [1.13.2](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.13.1...cozy-harvest-lib@1.13.2) (2019-11-04)

**Note:** Version bump only for package cozy-harvest-lib





## [1.13.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.13.0...cozy-harvest-lib@1.13.1) (2019-10-26)


### Bug Fixes

* Correctly unmount TwoFAModal ([465d8dd](https://github.com/cozy/cozy-libs/commit/465d8dd))





# [1.13.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.12.3...cozy-harvest-lib@1.13.0) (2019-10-25)


### Bug Fixes

* Remove KonnectorJob listeners on unmount ([7862d8e](https://github.com/cozy/cozy-libs/commit/7862d8e))
* With UI update, no need for empty value hack ([02d5674](https://github.com/cozy/cozy-libs/commit/02d5674))


### Features

* Better error for prepareTriggerAccount ([bd62fad](https://github.com/cozy/cozy-libs/commit/bd62fad))
* Handle double otp ([dcb92da](https://github.com/cozy/cozy-libs/commit/dcb92da))





## [1.12.3](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.12.2...cozy-harvest-lib@1.12.3) (2019-10-23)


### Bug Fixes

* Update README ([a73bdfb](https://github.com/cozy/cozy-libs/commit/a73bdfb))





## [1.12.2](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.12.1...cozy-harvest-lib@1.12.2) (2019-10-23)

**Note:** Version bump only for package cozy-harvest-lib





## [1.12.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.12.0...cozy-harvest-lib@1.12.1) (2019-10-23)


### Bug Fixes

* Delay maintenance information ([75cc502](https://github.com/cozy/cozy-libs/commit/75cc502))





# [1.12.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.11.0...cozy-harvest-lib@1.12.0) (2019-10-23)


### Bug Fixes

* Faulty element structure (messed up conflict resolution) ([2f44724](https://github.com/cozy/cozy-libs/commit/2f44724))
* Properly align buttons ([1dc04f8](https://github.com/cozy/cozy-libs/commit/1dc04f8))
* Switch back to normal modal style ([eae13b5](https://github.com/cozy/cozy-libs/commit/eae13b5))


### Features

* Upgrade cozy-ui ([5d6545f](https://github.com/cozy/cozy-libs/commit/5d6545f))





# [1.11.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.10.5...cozy-harvest-lib@1.11.0) (2019-10-22)


### Bug Fixes

* Use working KonnectorIcon in 2FA modal ([bb57d8b](https://github.com/cozy/cozy-libs/commit/bb57d8b))


### Features

* Support 2fa flow done on mobile/app ([b2ae59f](https://github.com/cozy/cozy-libs/commit/b2ae59f))





## [1.10.5](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.10.4...cozy-harvest-lib@1.10.5) (2019-10-21)

**Note:** Version bump only for package cozy-harvest-lib





## [1.10.4](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.10.3...cozy-harvest-lib@1.10.4) (2019-10-21)


### Bug Fixes

* Use initial trigger running status ([19e9193](https://github.com/cozy/cozy-libs/commit/19e9193))





## [1.10.3](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.10.2...cozy-harvest-lib@1.10.3) (2019-10-21)


### Bug Fixes

* Use custom scoped history object ([#842](https://github.com/cozy/cozy-libs/issues/842)) ([df81196](https://github.com/cozy/cozy-libs/commit/df81196))





## [1.10.2](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.10.1...cozy-harvest-lib@1.10.2) (2019-10-21)


### Bug Fixes

* Make modal top edges round ([24a4258](https://github.com/cozy/cozy-libs/commit/24a4258))





## [1.10.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.10.0...cozy-harvest-lib@1.10.1) (2019-10-18)


### Bug Fixes

* **cozy-harvest-lib:** Prevent credentials update for oauth konnectors ([fc00fe4](https://github.com/cozy/cozy-libs/commit/fc00fe4))





# [1.10.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.9.0...cozy-harvest-lib@1.10.0) (2019-10-18)


### Bug Fixes

* Added extra margins on account form ([cce8d31](https://github.com/cozy/cozy-libs/commit/cce8d31))


### Features

* Alternative modal header ([e9149e9](https://github.com/cozy/cozy-libs/commit/e9149e9))





# [1.9.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.8.5...cozy-harvest-lib@1.9.0) (2019-10-16)


### Features

* Disable running a konnector in maintenance ([a4c0e27](https://github.com/cozy/cozy-libs/commit/a4c0e27))
* Display maitenance informations ([98af8f9](https://github.com/cozy/cozy-libs/commit/98af8f9))





## [1.8.5](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.8.4...cozy-harvest-lib@1.8.5) (2019-10-14)


### Bug Fixes

* Translating components ([1101a66](https://github.com/cozy/cozy-libs/commit/1101a66))





## [1.8.4](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.8.3...cozy-harvest-lib@1.8.4) (2019-10-11)


### Bug Fixes

* Add account link ([9745b34](https://github.com/cozy/cozy-libs/commit/9745b34))
* Remove outdated comment ([238e4a4](https://github.com/cozy/cozy-libs/commit/238e4a4))
* Removed duplicate error message ([c4e2f73](https://github.com/cozy/cozy-libs/commit/c4e2f73))





## [1.8.3](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.8.2...cozy-harvest-lib@1.8.3) (2019-10-11)


### Bug Fixes

* Button margins on mobile ([b4f2bdc](https://github.com/cozy/cozy-libs/commit/b4f2bdc))
* Only show folder link when the konnector has a folder ([49e317a](https://github.com/cozy/cozy-libs/commit/49e317a))





## [1.8.2](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.8.1...cozy-harvest-lib@1.8.2) (2019-10-11)


### Bug Fixes

* Avoid double-render with Redirect ([c6b5a72](https://github.com/cozy/cozy-libs/commit/c6b5a72))
* Catch inexisting account error ([ff6ba65](https://github.com/cozy/cozy-libs/commit/ff6ba65))
* Error translations ([377a730](https://github.com/cozy/cozy-libs/commit/377a730))
* Initially render spinner ([82123da](https://github.com/cozy/cozy-libs/commit/82123da))
* Redirect from unmatched routes ([43e644b](https://github.com/cozy/cozy-libs/commit/43e644b))





## [1.8.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.8.0...cozy-harvest-lib@1.8.1) (2019-10-07)


### Bug Fixes

* Make account selection control larger ([74abddc](https://github.com/cozy/cozy-libs/commit/74abddc))





# [1.8.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.7.0...cozy-harvest-lib@1.8.0) (2019-10-07)


### Features

* Added a link to connector documents ([e6debdb](https://github.com/cozy/cozy-libs/commit/e6debdb))





# [1.7.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.6.0...cozy-harvest-lib@1.7.0) (2019-10-03)


### Features

* Redirect to only account ([6076f1d](https://github.com/cozy/cozy-libs/commit/6076f1d))





# [1.6.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.5.0...cozy-harvest-lib@1.6.0) (2019-10-02)


### Features

* Export a bound t ([c959b2a](https://github.com/cozy/cozy-libs/commit/c959b2a))





# [1.5.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.4.0...cozy-harvest-lib@1.5.0) (2019-09-27)


### Features

* Mark the package as sideEffects free ([fa6bceb](https://github.com/cozy/cozy-libs/commit/fa6bceb))





# [1.4.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.3.8...cozy-harvest-lib@1.4.0) (2019-09-25)


### Features

* Export get error locale ([ac5bf01](https://github.com/cozy/cozy-libs/commit/ac5bf01))





## [1.3.8](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.3.7...cozy-harvest-lib@1.3.8) (2019-09-23)

**Note:** Version bump only for package cozy-harvest-lib





## [1.3.7](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.3.6...cozy-harvest-lib@1.3.7) (2019-09-19)

**Note:** Version bump only for package cozy-harvest-lib





## [1.3.6](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.3.5...cozy-harvest-lib@1.3.6) (2019-09-18)

**Note:** Version bump only for package cozy-harvest-lib





## [1.3.5](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.3.4...cozy-harvest-lib@1.3.5) (2019-09-17)

**Note:** Version bump only for package cozy-harvest-lib





## [1.3.4](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.3.3...cozy-harvest-lib@1.3.4) (2019-09-16)

**Note:** Version bump only for package cozy-harvest-lib





## [1.3.3](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.3.2...cozy-harvest-lib@1.3.3) (2019-09-13)

**Note:** Version bump only for package cozy-harvest-lib





## [1.3.2](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.3.1...cozy-harvest-lib@1.3.2) (2019-09-10)


### Bug Fixes

* Use App doctypes ([7aa69b5](https://github.com/cozy/cozy-libs/commit/7aa69b5))





## [1.3.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.3.0...cozy-harvest-lib@1.3.1) (2019-09-09)

**Note:** Version bump only for package cozy-harvest-lib





# [1.3.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.2.0...cozy-harvest-lib@1.3.0) (2019-09-09)


### Bug Fixes

* Review comments ([3ef144b](https://github.com/cozy/cozy-libs/commit/3ef144b))
* Use onDismis instead of push ([512577f](https://github.com/cozy/cozy-libs/commit/512577f))


### Features

* Add SuccessModal to harvest (wip) ([77d9ac5](https://github.com/cozy/cozy-libs/commit/77d9ac5))
* Banks URL redirection ([43c8f00](https://github.com/cozy/cozy-libs/commit/43c8f00))
* Banks URL success. ([b01d900](https://github.com/cozy/cozy-libs/commit/b01d900))
* Import TriggerFoldeRLink ([c8b6fd8](https://github.com/cozy/cozy-libs/commit/c8b6fd8))
* Use icon from harvest ([3f76261](https://github.com/cozy/cozy-libs/commit/3f76261))





# 1.2.0 (2019-09-05)


### Bug Fixes

* Add a few TODOs ([3e031ae](https://github.com/cozy/cozy-libs/commit/3e031ae))
* Add ids to fields ([e073420](https://github.com/cozy/cozy-libs/commit/e073420))
* Bind dismiss action ([22ba24e](https://github.com/cozy/cozy-libs/commit/22ba24e))
* Clean remove console ([e7bad0c](https://github.com/cozy/cozy-libs/commit/e7bad0c))
* Display content only if no error ([4abb82b](https://github.com/cozy/cozy-libs/commit/4abb82b))
* Display KonnectorHeader only if error or loading ([a355dd4](https://github.com/cozy/cozy-libs/commit/a355dd4))
* Display spinner also on konnectorConfig ([988d0a5](https://github.com/cozy/cozy-libs/commit/988d0a5))
* Erroneous proptypes ([786e44e](https://github.com/cozy/cozy-libs/commit/786e44e))
* Few issues ([bad93e0](https://github.com/cozy/cozy-libs/commit/bad93e0))
* Handle account change and loadSelectedAccount ([800f038](https://github.com/cozy/cozy-libs/commit/800f038))
* KonnectorUpdate ([94a167b](https://github.com/cozy/cozy-libs/commit/94a167b))
* Lint ([7baa843](https://github.com/cozy/cozy-libs/commit/7baa843))
* Missing translations ([8626e34](https://github.com/cozy/cozy-libs/commit/8626e34))
* Redirection after account creation ([2b37bee](https://github.com/cozy/cozy-libs/commit/2b37bee))
* Rename component ([acbde7b](https://github.com/cozy/cozy-libs/commit/acbde7b))
* Rename trigger to initialTrigger ([969a3b3](https://github.com/cozy/cozy-libs/commit/969a3b3))
* Set error in state ([f0f4c2c](https://github.com/cozy/cozy-libs/commit/f0f4c2c))
* Test only test/ and move spec to it ([ff0174c](https://github.com/cozy/cozy-libs/commit/ff0174c))
* TriggerLauncher Test ([9272c95](https://github.com/cozy/cozy-libs/commit/9272c95))
* Use client instead of cozyclient + rm few logs ([f585245](https://github.com/cozy/cozy-libs/commit/f585245))
* Use ellipsis instead of MidEllipsis since there is a bug ([cd76f67](https://github.com/cozy/cozy-libs/commit/cd76f67))
* Wrong import ([0a6506a](https://github.com/cozy/cozy-libs/commit/0a6506a))


### Features

* Add a KonnectorModalHeader component ([46f146e](https://github.com/cozy/cozy-libs/commit/46f146e))
* Add account route ([7986708](https://github.com/cozy/cozy-libs/commit/7986708))
* Design for EditAccountModal ([95a0fe6](https://github.com/cozy/cozy-libs/commit/95a0fe6))
* Display erro ([e66fbdc](https://github.com/cozy/cozy-libs/commit/e66fbdc))
* Display error message on AccountModal ([b66d3bc](https://github.com/cozy/cozy-libs/commit/b66d3bc))
* Move Routes to component ([61a76a6](https://github.com/cozy/cozy-libs/commit/61a76a6))
* New account modal ([55bf109](https://github.com/cozy/cozy-libs/commit/55bf109))
* New design for KonnectorConfiguration with Card ([957a44f](https://github.com/cozy/cozy-libs/commit/957a44f))
* New Edit Account Modal ([3e2be41](https://github.com/cozy/cozy-libs/commit/3e2be41))
* RealTime on trigger/job ([9815a53](https://github.com/cozy/cozy-libs/commit/9815a53))
* Redirect to new if no account ([30b07b5](https://github.com/cozy/cozy-libs/commit/30b07b5))
* Use realtime everywhere ([9fd0a2f](https://github.com/cozy/cozy-libs/commit/9fd0a2f))
* **cozy-harvest-lib:** Handle routes ([9f52bca](https://github.com/cozy/cozy-libs/commit/9f52bca))





## [1.1.3](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.1.2...cozy-harvest-lib@1.1.3) (2019-09-04)

**Note:** Version bump only for package cozy-harvest-lib





## [1.1.2](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.1.1...cozy-harvest-lib@1.1.2) (2019-09-04)

**Note:** Version bump only for package cozy-harvest-lib





## [1.1.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.1.0...cozy-harvest-lib@1.1.1) (2019-09-04)

**Note:** Version bump only for package cozy-harvest-lib





# [1.1.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.0.4...cozy-harvest-lib@1.1.0) (2019-09-03)


### Bug Fixes

* **harvest:** Typo 📝 ([5413dec](https://github.com/cozy/cozy-libs/commit/5413dec))


### Features

* **harves:** Deal with inconsistent TERMS_VERSION_MISMATCH 📝 ([717f94a](https://github.com/cozy/cozy-libs/commit/717f94a))
* **harvest:** Add hasNewVersionAvailable method to konnectors helper 📝 ([2890a17](https://github.com/cozy/cozy-libs/commit/2890a17))
* **harvest:** Add isTermsVersionMismatchError to KonnectorJobError 📝 ([2fc9cef](https://github.com/cozy/cozy-libs/commit/2fc9cef))
* **harvest:** Add KonnectorUpdateInfos component ✨ ([f817942](https://github.com/cozy/cozy-libs/commit/f817942))
* **harvest:** Display KonnectorUpdateInfos in KonnectorConfiguration ✨ ([89ea09b](https://github.com/cozy/cozy-libs/commit/89ea09b))
* **harvest:** Show KonnectorUpdateInfos above account list 📝 ([0a95ddf](https://github.com/cozy/cozy-libs/commit/0a95ddf))





## [1.0.4](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.0.3...cozy-harvest-lib@1.0.4) (2019-09-02)

**Note:** Version bump only for package cozy-harvest-lib





## [1.0.3](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.0.2...cozy-harvest-lib@1.0.3) (2019-08-30)

**Note:** Version bump only for package cozy-harvest-lib





## [1.0.2](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.0.1...cozy-harvest-lib@1.0.2) (2019-08-30)


### Bug Fixes

* **harvest:** Make 2FA work again ([3416901](https://github.com/cozy/cozy-libs/commit/3416901))
* Pass KonnectorJob instance to TwoFAModal ([ffb921a](https://github.com/cozy/cozy-libs/commit/ffb921a))
* Prevent unneeded rerender ([b62f405](https://github.com/cozy/cozy-libs/commit/b62f405))
* Renamed prop to conform to new API ([a3875a6](https://github.com/cozy/cozy-libs/commit/a3875a6))
* TwoFAModal handles TwoFA code mismatch errors ([531a2b0](https://github.com/cozy/cozy-libs/commit/531a2b0))
* Wrong prop type ([e34d03b](https://github.com/cozy/cozy-libs/commit/e34d03b))





## [1.0.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@1.0.0...cozy-harvest-lib@1.0.1) (2019-08-29)

**Note:** Version bump only for package cozy-harvest-lib





# [1.0.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.71.12...cozy-harvest-lib@1.0.0) (2019-08-28)


* [Harvest] refactor: Deduplicate trigger launch logic (#736) ([ccaf6e3](https://github.com/cozy/cozy-libs/commit/ccaf6e3)), closes [#736](https://github.com/cozy/cozy-libs/issues/736)


### BREAKING CHANGES

* TriggerManager now takes an `initialTrigger` prop
instead of `trigger`
TriggerLauncher now takes an `initialTrigger` prop instead of `trigger`
TriggerLauncher passes a `launch` prop to its children — this prop must
now always be called with a trigger as first parameter

* Update packages/cozy-harvest-lib/src/components/TriggerManager.jsx

Co-Authored-By: Patrick Browne <pt.browne@gmail.com>





## [0.71.12](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.71.11...cozy-harvest-lib@0.71.12) (2019-08-26)

**Note:** Version bump only for package cozy-harvest-lib





## [0.71.11](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.71.10...cozy-harvest-lib@0.71.11) (2019-08-23)


### Bug Fixes

* Add moduleNameMapper for the new CC version ([9ac4a26](https://github.com/cozy/cozy-libs/commit/9ac4a26))





## [0.71.10](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.71.9...cozy-harvest-lib@0.71.10) (2019-08-22)


### Bug Fixes

* **cozy-harvest-lib:** Check if accountLogin is not undefined ([a18d028](https://github.com/cozy/cozy-libs/commit/a18d028))





## [0.71.9](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.71.8...cozy-harvest-lib@0.71.9) (2019-08-22)

**Note:** Version bump only for package cozy-harvest-lib





## [0.71.8](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.71.7...cozy-harvest-lib@0.71.8) (2019-08-21)

**Note:** Version bump only for package cozy-harvest-lib





## [0.71.7](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.71.6...cozy-harvest-lib@0.71.7) (2019-08-21)


### Bug Fixes

* Removed outdated style ([f3127b8](https://github.com/cozy/cozy-libs/commit/f3127b8))





## [0.71.6](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.71.5...cozy-harvest-lib@0.71.6) (2019-08-21)

**Note:** Version bump only for package cozy-harvest-lib





## [0.71.5](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.71.4...cozy-harvest-lib@0.71.5) (2019-08-21)

**Note:** Version bump only for package cozy-harvest-lib





## [0.71.4](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.71.3...cozy-harvest-lib@0.71.4) (2019-08-20)


### Bug Fixes

* Status icon sizes ([83aa370](https://github.com/cozy/cozy-libs/commit/83aa370))





## [0.71.3](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.71.2...cozy-harvest-lib@0.71.3) (2019-08-19)


### Bug Fixes

* Handle long acount names ([f79c567](https://github.com/cozy/cozy-libs/commit/f79c567))





## [0.71.2](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.71.1...cozy-harvest-lib@0.71.2) (2019-08-19)

**Note:** Version bump only for package cozy-harvest-lib





## [0.71.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.71.0...cozy-harvest-lib@0.71.1) (2019-08-19)

**Note:** Version bump only for package cozy-harvest-lib





# [0.71.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.70.2...cozy-harvest-lib@0.71.0) (2019-08-14)


### Bug Fixes

* Account picker styles ([7e09a02](https://github.com/cozy/cozy-libs/commit/7e09a02))
* Add padding when adding account ([4169aa8](https://github.com/cozy/cozy-libs/commit/4169aa8))
* Better error state handling ([c336923](https://github.com/cozy/cozy-libs/commit/c336923))
* Configuration screen margins ([f17d270](https://github.com/cozy/cozy-libs/commit/f17d270))
* Default value for into ([b33bc9a](https://github.com/cozy/cozy-libs/commit/b33bc9a))
* Don't delete the <body>… ([5b9a263](https://github.com/cozy/cozy-libs/commit/5b9a263))
* Fetching accounts indications ([a0d578f](https://github.com/cozy/cozy-libs/commit/a0d578f))
* **cozy-harvest-lib:** Fix weird behavior on mobile device ([118aa63](https://github.com/cozy/cozy-libs/commit/118aa63))
* **cozy-harvest-lib:** Select isSearchable False ([b675270](https://github.com/cozy/cozy-libs/commit/b675270))
* Filter out accounts that can't be found ([e8620f7](https://github.com/cozy/cozy-libs/commit/e8620f7))
* Fixup option to nav ([ea7313f](https://github.com/cozy/cozy-libs/commit/ea7313f))
* Hide select menu when adding account ([9f57c33](https://github.com/cozy/cozy-libs/commit/9f57c33))
* Select account in dropdown ([2b37edc](https://github.com/cozy/cozy-libs/commit/2b37edc))
* SelectBox add account label ([8c4c868](https://github.com/cozy/cozy-libs/commit/8c4c868))
* Translate button ([1c00afb](https://github.com/cozy/cozy-libs/commit/1c00afb))
* Use color from palette ([6c97983](https://github.com/cozy/cozy-libs/commit/6c97983))


### Features

* Added account picker ([ab18318](https://github.com/cozy/cozy-libs/commit/ab18318))
* Option to add an account without parent component ([b09b103](https://github.com/cozy/cozy-libs/commit/b09b103))
* Option to navigate accounts via parent component ([499fad2](https://github.com/cozy/cozy-libs/commit/499fad2))





## [0.70.2](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.70.1...cozy-harvest-lib@0.70.2) (2019-08-12)

**Note:** Version bump only for package cozy-harvest-lib





## [0.70.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.70.0...cozy-harvest-lib@0.70.1) (2019-08-08)


### Bug Fixes

* Delete description ([b70f785](https://github.com/cozy/cozy-libs/commit/b70f785))
* Tab names and margins ([74e16bc](https://github.com/cozy/cozy-libs/commit/74e16bc))





# [0.70.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.69.3...cozy-harvest-lib@0.70.0) (2019-08-07)


### Features

* Added create account button ([b897c33](https://github.com/cozy/cozy-libs/commit/b897c33))
* Reviewed modal design ([e5c5fab](https://github.com/cozy/cozy-libs/commit/e5c5fab))
* Split informations into tabs ([7277fe2](https://github.com/cozy/cozy-libs/commit/7277fe2))





## [0.69.3](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.69.2...cozy-harvest-lib@0.69.3) (2019-08-06)

**Note:** Version bump only for package cozy-harvest-lib





## [0.69.2](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.69.1...cozy-harvest-lib@0.69.2) (2019-08-05)

**Note:** Version bump only for package cozy-harvest-lib





## [0.69.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.69.0...cozy-harvest-lib@0.69.1) (2019-08-05)

**Note:** Version bump only for package cozy-harvest-lib





# [0.69.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.68.2...cozy-harvest-lib@0.69.0) (2019-08-02)


### Bug Fixes

* **cozy-harvest-lib:** Do not check language before merge ([60b657c](https://github.com/cozy/cozy-libs/commit/60b657c))


### Features

* **cozy-doctypes:** Add Account model ([b5b9b4b](https://github.com/cozy/cozy-libs/commit/b5b9b4b))
* **cozy-harvest-lib:** Account Switcher style ([7f612f7](https://github.com/cozy/cozy-libs/commit/7f612f7))
* **cozy-harvest-lib:** Create account from the account switcher ([6e811c4](https://github.com/cozy/cozy-libs/commit/6e811c4))
* **cozy-harvest-lib:** Konnector Modal with multi-accounts ([87b2881](https://github.com/cozy/cozy-libs/commit/87b2881))





## [0.68.2](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.68.1...cozy-harvest-lib@0.68.2) (2019-08-02)

**Note:** Version bump only for package cozy-harvest-lib





## [0.68.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.68.0...cozy-harvest-lib@0.68.1) (2019-08-02)

**Note:** Version bump only for package cozy-harvest-lib





# [0.68.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.67.7...cozy-harvest-lib@0.68.0) (2019-07-30)


### Features

* Allow changing the login, always ([30a7088](https://github.com/cozy/cozy-libs/commit/30a7088))





## [0.67.7](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.67.6...cozy-harvest-lib@0.67.7) (2019-07-30)


### Bug Fixes

* **cozy-harvest-lib:** Do not use client.collection ([077ec75](https://github.com/cozy/cozy-libs/commit/077ec75))
* **cozy-harvest-lib:** Fix oauthcallback success ([03ed080](https://github.com/cozy/cozy-libs/commit/03ed080))





## [0.67.6](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.67.5...cozy-harvest-lib@0.67.6) (2019-07-29)


### Bug Fixes

* **harvest:** Handle folder baseDir declared in manifest ✨ ([296829f](https://github.com/cozy/cozy-libs/commit/296829f))
* Only use defaultDir in the manifest ([dee6277](https://github.com/cozy/cozy-libs/commit/dee6277))





## [0.67.5](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.67.4...cozy-harvest-lib@0.67.5) (2019-07-19)

**Note:** Version bump only for package cozy-harvest-lib





## [0.67.4](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.67.3...cozy-harvest-lib@0.67.4) (2019-07-19)

**Note:** Version bump only for package cozy-harvest-lib





## [0.67.3](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.67.2...cozy-harvest-lib@0.67.3) (2019-07-18)

**Note:** Version bump only for package cozy-harvest-lib





## [0.67.2](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.67.1...cozy-harvest-lib@0.67.2) (2019-07-16)


### Bug Fixes

* **cozy-harvest-lib:** Remove cozy-realtime from dependencies ([f13f9af](https://github.com/cozy/cozy-libs/commit/f13f9af))





## [0.67.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.67.0...cozy-harvest-lib@0.67.1) (2019-07-11)


### Bug Fixes

* **deps:** Update dependency lodash to v4.17.13 [SECURITY] ([#648](https://github.com/cozy/cozy-libs/issues/648)) ([1b36dac](https://github.com/cozy/cozy-libs/commit/1b36dac))





# [0.67.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.66.1...cozy-harvest-lib@0.67.0) (2019-07-09)


### Features

* **harvest:** Do not autofocus identifier field on iPhone ([f6c06c2](https://github.com/cozy/cozy-libs/commit/f6c06c2))





## [0.66.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.66.0...cozy-harvest-lib@0.66.1) (2019-07-09)


### Bug Fixes

* **harvest:** Manage margin issue ([9bc404f](https://github.com/cozy/cozy-libs/commit/9bc404f))





# [0.66.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.65.1...cozy-harvest-lib@0.66.0) (2019-07-03)


### Features

* **harvest:** Add locales check after tx pull ☑ ([228853d](https://github.com/cozy/cozy-libs/commit/228853d))





## [0.65.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.65.0...cozy-harvest-lib@0.65.1) (2019-07-03)


### Bug Fixes

* :bug: Correctly check initialValues if exists ([7bd2ac5](https://github.com/cozy/cozy-libs/commit/7bd2ac5))





# [0.65.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.64.0...cozy-harvest-lib@0.65.0) (2019-07-03)


### Bug Fixes

* **harvest:** :bug: Call Delete button callbacks after setState ([53c54e4](https://github.com/cozy/cozy-libs/commit/53c54e4))
* :bug: Correctly wrap TriggerLaunche into withLocales ([73cc510](https://github.com/cozy/cozy-libs/commit/73cc510))
* **harvest:** :bug: Omit also i18n props from withLocales ([5f88752](https://github.com/cozy/cozy-libs/commit/5f88752))
* **harvest:** :nail_care: Better delete button proptypes handling ([3b3d122](https://github.com/cozy/cozy-libs/commit/3b3d122))
* **harvest:** LoadStart on Android is not dispatched when redirected ([cde2d10](https://github.com/cozy/cozy-libs/commit/cde2d10))
* **harvest:** NeedsFolderPath should also check folders attribute 📝 ([3f6275f](https://github.com/cozy/cozy-libs/commit/3f6275f))
* **harvest:** Rely on messageEvent.source for OAuth message 📝 ([8800778](https://github.com/cozy/cozy-libs/commit/8800778))
* :nail_care: Handle missing password for encrypted placeholder ([84d78bc](https://github.com/cozy/cozy-libs/commit/84d78bc))
* :pencil2: Missing spread ([7947f43](https://github.com/cozy/cozy-libs/commit/7947f43))


### Features

* **harvest:** Add DeleteAccountCard component ✨ ([135c47c](https://github.com/cozy/cozy-libs/commit/135c47c))
* **harvest:** Add display names to HOC 📝 ([5656797](https://github.com/cozy/cozy-libs/commit/5656797))
* **harvest:** Import tranpiled Cozy-UI components ⚙ ([8c1f50c](https://github.com/cozy/cozy-libs/commit/8c1f50c))
* **harvest:** Improve margin bottom in KonnectorModal 📝 ([b20836d](https://github.com/cozy/cozy-libs/commit/b20836d))
* **harvest:** Make HandleOAuthResponse return boolean value ✨ ([f800811](https://github.com/cozy/cozy-libs/commit/f800811))
* **harvest:** Make OAuthWindow and Popup mobile-compatible ✨ ([98f2664](https://github.com/cozy/cozy-libs/commit/98f2664))
* **harvest:** Prepare checkOAuth function in helper 📝 ([b8b20f7](https://github.com/cozy/cozy-libs/commit/b8b20f7))
* **harvest:** Prepare OAuth helper 📝 ([ddbe986](https://github.com/cozy/cozy-libs/commit/ddbe986))
* **harvest:** Prepare OAuthWindow component 📝 ([8acec47](https://github.com/cozy/cozy-libs/commit/8acec47))
* **harvest:** Prepare Popup component 📝 ([96a6eeb](https://github.com/cozy/cozy-libs/commit/96a6eeb))
* **harvest:** Prepare prepareOAuth function in helper 📝 ([7e9c4a6](https://github.com/cozy/cozy-libs/commit/7e9c4a6))
* **harvest:** Prepare terminateOAuth function in helper 📝 ([b6143fe](https://github.com/cozy/cozy-libs/commit/b6143fe))
* **harvest:** Trigger build including recent translations, second try ⚙ ([c803966](https://github.com/cozy/cozy-libs/commit/c803966))
* **harvest:** Trigger manual release to get last translations 🌐 ([8bc3f30](https://github.com/cozy/cozy-libs/commit/8bc3f30))
* **harvest:** Update OAuthForm, move it into TriggerManager ✨ ([ac9d402](https://github.com/cozy/cozy-libs/commit/ac9d402))





# [0.64.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.63.0...cozy-harvest-lib@0.64.0) (2019-07-03)


### Bug Fixes

* **harvest:** When refetching, trigger must be retrieved from state ([8e0eb4b](https://github.com/cozy/cozy-libs/commit/8e0eb4b))


### Features

* **harvest:** Decrease margin between items in LaunchTriggerCard 💄 ([ec117cc](https://github.com/cozy/cozy-libs/commit/ec117cc))





# [0.63.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.62.3...cozy-harvest-lib@0.63.0) (2019-07-01)


### Features

* **harvest:** Add a way to disable the DeleteButtonCard ✨ ([226edd9](https://github.com/cozy/cozy-libs/commit/226edd9))
* **harvest:** Add prop to make LaunchTriggerCard submitting 📝 ([1362a04](https://github.com/cozy/cozy-libs/commit/1362a04))
* **harvest:** Do not render field as errored when disabled 📝 ([6cdaec6](https://github.com/cozy/cozy-libs/commit/6cdaec6))
* **harvest:** Give callbacks to TriggerManager 📝 ([15474ec](https://github.com/cozy/cozy-libs/commit/15474ec))
* **havest:** LaunchTriggerCard is now a component 📝 ([52d7262](https://github.com/cozy/cozy-libs/commit/52d7262))





## [0.62.3](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.62.2...cozy-harvest-lib@0.62.3) (2019-07-01)


### Bug Fixes

* **harvest:** Fix undefined proptypes when transpiled 🚑 ([4cefcfa](https://github.com/cozy/cozy-libs/commit/4cefcfa))





## [0.62.2](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.62.1...cozy-harvest-lib@0.62.2) (2019-06-28)


### Bug Fixes

* **harvest:** Fix TriggerErrorInfo bottom margin 🚑 ([9eec92b](https://github.com/cozy/cozy-libs/commit/9eec92b))





## [0.62.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.62.0...cozy-harvest-lib@0.62.1) (2019-06-27)


### Bug Fixes

* **harvest:** Disable button when editing if an error exists 🚑 ([584deb7](https://github.com/cozy/cozy-libs/commit/584deb7))





# [0.62.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.61.4...cozy-harvest-lib@0.62.0) (2019-06-27)


### Features

* **harvest:** Do not show error when job running on KonnectorModal ✨ ([355fc37](https://github.com/cozy/cozy-libs/commit/355fc37))
* **harvest:** Give callbacks to TriggerLauncher ✨ ([9705a42](https://github.com/cozy/cozy-libs/commit/9705a42))
* **harvest:** Let KonnectorModal display trigger error 📝 ([2591ddd](https://github.com/cozy/cozy-libs/commit/2591ddd))
* **harvest:** Pass props from LaunchTriggerCard to TriggerLauncher 📝 ([6fd3ce5](https://github.com/cozy/cozy-libs/commit/6fd3ce5))





## [0.61.4](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.61.3...cozy-harvest-lib@0.61.4) (2019-06-27)


### Bug Fixes

* **harvest:** Fix style prop to not make React crash 🚑 ([6599d29](https://github.com/cozy/cozy-libs/commit/6599d29))





## [0.61.3](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.61.2...cozy-harvest-lib@0.61.3) (2019-06-27)


### Bug Fixes

* **harvest:** Fix locale 🌐 ([67ef244](https://github.com/cozy/cozy-libs/commit/67ef244))





## [0.61.2](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.61.1...cozy-harvest-lib@0.61.2) (2019-06-27)


### Bug Fixes

* **harvest:** Konnector modal title 🌐 ([1f672d4](https://github.com/cozy/cozy-libs/commit/1f672d4))





## [0.61.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.61.0...cozy-harvest-lib@0.61.1) (2019-06-27)

**Note:** Version bump only for package cozy-harvest-lib





# [0.61.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.60.0...cozy-harvest-lib@0.61.0) (2019-06-26)


### Features

* **harvest:** Add frequency in LaunchTriggerCard ✨ ([0e634fd](https://github.com/cozy/cozy-libs/commit/0e634fd))
* **harvest:** Add last success date in LaunchTriggerCard ✨ ([9f4dcf7](https://github.com/cozy/cozy-libs/commit/9f4dcf7))
* **harvest:** Arrange desktop flex layout for LaunchTriggerCard 💄 ([95b53b6](https://github.com/cozy/cozy-libs/commit/95b53b6))
* **harvest:** Make LaunchTriggerCard responsive 📱 ([3c54292](https://github.com/cozy/cozy-libs/commit/3c54292))
* **harvest:** Prepare frequency methods 📝 ([34c272f](https://github.com/cozy/cozy-libs/commit/34c272f))
* **harvest:** Prepare last success date methods 📝 ([110b6c2](https://github.com/cozy/cozy-libs/commit/110b6c2))
* **harvest:** Refetch trigger after success or error in Launcher 📝 ([0073188](https://github.com/cozy/cozy-libs/commit/0073188))





# [0.60.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.59.0...cozy-harvest-lib@0.60.0) (2019-06-21)


### Features

* **harvest:** Trigger manual release to get last translations 🌐 ([adb6634](https://github.com/cozy/cozy-libs/commit/adb6634))





# [0.59.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.58.0...cozy-harvest-lib@0.59.0) (2019-06-20)


### Features

* **harvest:** Fetch job right after subscribing realtime 📝 ([25b894d](https://github.com/cozy/cozy-libs/commit/25b894d))





# [0.58.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.57.3...cozy-harvest-lib@0.58.0) (2019-06-20)


### Features

* **harvest:** Add LaunchTriggerCard ✨ ([d9fdf4f](https://github.com/cozy/cozy-libs/commit/d9fdf4f))





## [0.57.3](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.57.2...cozy-harvest-lib@0.57.3) (2019-06-20)


### Bug Fixes

* **harvest:** Make TriggerLauncher detects success again 🚑 ([d2487ee](https://github.com/cozy/cozy-libs/commit/d2487ee))





## [0.57.2](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.57.1...cozy-harvest-lib@0.57.2) (2019-06-20)


### Bug Fixes

* :pencil2: Missing spread ([7947f43](https://github.com/cozy/cozy-libs/commit/7947f43))





## [0.57.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.57.0...cozy-harvest-lib@0.57.1) (2019-06-20)


### Bug Fixes

* **harvest:** :bug: Omit also i18n props from withLocales ([5f88752](https://github.com/cozy/cozy-libs/commit/5f88752))





# [0.57.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.56.0...cozy-harvest-lib@0.57.0) (2019-06-18)


### Features

* **harvest:** Improve margin bottom in KonnectorModal 📝 ([b20836d](https://github.com/cozy/cozy-libs/commit/b20836d))





# [0.56.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.55.0...cozy-harvest-lib@0.56.0) (2019-06-18)


### Features

* **harvest:** Add display names to HOC 📝 ([5656797](https://github.com/cozy/cozy-libs/commit/5656797))





# [0.55.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.54.1...cozy-harvest-lib@0.55.0) (2019-06-17)


### Features

* **harvest:** Make HandleOAuthResponse return boolean value ✨ ([f800811](https://github.com/cozy/cozy-libs/commit/f800811))





## [0.54.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.54.0...cozy-harvest-lib@0.54.1) (2019-06-17)


### Bug Fixes

* **harvest:** :nail_care: Better delete button proptypes handling ([3b3d122](https://github.com/cozy/cozy-libs/commit/3b3d122))
* :bug: Correctly wrap TriggerLaunche into withLocales ([73cc510](https://github.com/cozy/cozy-libs/commit/73cc510))





# [0.54.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.53.1...cozy-harvest-lib@0.54.0) (2019-06-17)


### Features

* **harvest:** Trigger manual release to get last translations 🌐 ([8bc3f30](https://github.com/cozy/cozy-libs/commit/8bc3f30))





## [0.53.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.53.0...cozy-harvest-lib@0.53.1) (2019-06-17)


### Bug Fixes

* **harvest:** :bug: Call Delete button callbacks after setState ([53c54e4](https://github.com/cozy/cozy-libs/commit/53c54e4))





# [0.53.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.52.0...cozy-harvest-lib@0.53.0) (2019-06-14)


### Features

* **harvest:** Import tranpiled Cozy-UI components ⚙ ([8c1f50c](https://github.com/cozy/cozy-libs/commit/8c1f50c))





# [0.52.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.51.1...cozy-harvest-lib@0.52.0) (2019-06-14)


### Features

* **harvest:** Trigger build including recent translations, second try ⚙ ([c803966](https://github.com/cozy/cozy-libs/commit/c803966))





## [0.51.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.51.0...cozy-harvest-lib@0.51.1) (2019-06-14)


### Bug Fixes

* **harvest:** Rely on messageEvent.source for OAuth message 📝 ([8800778](https://github.com/cozy/cozy-libs/commit/8800778))





# [0.51.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.50.0...cozy-harvest-lib@0.51.0) (2019-06-11)


### Features

* **harvest:** Add DeleteAccountCard component ✨ ([135c47c](https://github.com/cozy/cozy-libs/commit/135c47c))





<a name="0.50.0"></a>
# [0.50.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.49.6...cozy-harvest-lib@0.50.0) (2019-06-07)


### Bug Fixes

* **harvest:** LoadStart on Android is not dispatched when redirected ([cde2d10](https://github.com/cozy/cozy-libs/commit/cde2d10))
* **harvest:** NeedsFolderPath should also check folders attribute 📝 ([3f6275f](https://github.com/cozy/cozy-libs/commit/3f6275f))


### Features

* **harvest:** Make OAuthWindow and Popup mobile-compatible ✨ ([98f2664](https://github.com/cozy/cozy-libs/commit/98f2664))
* **harvest:** Prepare checkOAuth function in helper 📝 ([b8b20f7](https://github.com/cozy/cozy-libs/commit/b8b20f7))
* **harvest:** Prepare OAuth helper 📝 ([ddbe986](https://github.com/cozy/cozy-libs/commit/ddbe986))
* **harvest:** Prepare OAuthWindow component 📝 ([8acec47](https://github.com/cozy/cozy-libs/commit/8acec47))
* **harvest:** Prepare Popup component 📝 ([96a6eeb](https://github.com/cozy/cozy-libs/commit/96a6eeb))
* **harvest:** Prepare prepareOAuth function in helper 📝 ([7e9c4a6](https://github.com/cozy/cozy-libs/commit/7e9c4a6))
* **harvest:** Prepare terminateOAuth function in helper 📝 ([b6143fe](https://github.com/cozy/cozy-libs/commit/b6143fe))
* **harvest:** Update OAuthForm, move it into TriggerManager ✨ ([ac9d402](https://github.com/cozy/cozy-libs/commit/ac9d402))




<a name="0.49.6"></a>
## [0.49.6](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.49.5...cozy-harvest-lib@0.49.6) (2019-06-07)




**Note:** Version bump only for package cozy-harvest-lib

<a name="0.49.5"></a>
## [0.49.5](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.49.4...cozy-harvest-lib@0.49.5) (2019-06-03)




**Note:** Version bump only for package cozy-harvest-lib

<a name="0.49.4"></a>
## [0.49.4](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.49.3...cozy-harvest-lib@0.49.4) (2019-06-03)


### Bug Fixes

* **harvest:** :bug: Correctly set fetched trigger in KonnectorModal ([177e167](https://github.com/cozy/cozy-libs/commit/177e167))




<a name="0.49.3"></a>
## [0.49.3](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.49.2...cozy-harvest-lib@0.49.3) (2019-05-31)


### Bug Fixes

* **harvest:** :bug: Prevent undefined success callback ([30f16ea](https://github.com/cozy/cozy-libs/commit/30f16ea))




<a name="0.49.2"></a>
## [0.49.2](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.49.1...cozy-harvest-lib@0.49.2) (2019-05-29)


### Bug Fixes

* **harvest:** Add DeleteAccountButton in KonnectorModal ([db646c2](https://github.com/cozy/cozy-libs/commit/db646c2))




<a name="0.49.1"></a>
## [0.49.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.49.0...cozy-harvest-lib@0.49.1) (2019-05-29)


### Bug Fixes

* **harvest:** Remove duplicated error block 🚑 ([2896f29](https://github.com/cozy/cozy-libs/commit/2896f29))




<a name="0.49.0"></a>
# [0.49.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.48.0...cozy-harvest-lib@0.49.0) (2019-05-29)


### Features

* **harvest:** Add and expose KonnectorModal ✨ ([8f0dc8d](https://github.com/cozy/cozy-libs/commit/8f0dc8d))
* **harvest:** Add and expose withKonnectorModal HOC ✨ ([0134e9e](https://github.com/cozy/cozy-libs/commit/0134e9e))
* **harvest:** Add preact hack on KonnectorModal componentWillUnmount 📝 ([85c9b5c](https://github.com/cozy/cozy-libs/commit/85c9b5c))
* **harvest:** Handle account fetch error in Konnector Modal 📝 ([a529eca](https://github.com/cozy/cozy-libs/commit/a529eca))




<a name="0.48.0"></a>
# [0.48.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.47.2...cozy-harvest-lib@0.48.0) (2019-05-29)


### Bug Fixes

* **deps:** update dependency cozy-ui to v20.6.0 ⬆️ ([c4368d0](https://github.com/cozy/cozy-libs/commit/c4368d0))


### Features

* **harvest:** Create local HOC to inject locales 📝 ([5663a50](https://github.com/cozy/cozy-libs/commit/5663a50))




<a name="0.47.2"></a>
## [0.47.2](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.47.1...cozy-harvest-lib@0.47.2) (2019-05-28)




**Note:** Version bump only for package cozy-harvest-lib

<a name="0.47.1"></a>
## [0.47.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.47.0...cozy-harvest-lib@0.47.1) (2019-05-27)


### Bug Fixes

* **harvest:** Prevent form to not submit 🚑 ([0b0eb6b](https://github.com/cozy/cozy-libs/commit/0b0eb6b))




<a name="0.47.0"></a>
# [0.47.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.46.1...cozy-harvest-lib@0.47.0) (2019-05-27)


### Features

* Add --verbose for babel for watch to show transpiled files ([ca442c2](https://github.com/cozy/cozy-libs/commit/ca442c2))




<a name="0.46.1"></a>
## [0.46.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.46.0...cozy-harvest-lib@0.46.1) (2019-05-24)


### Bug Fixes

* AccountFields.props.container is an Element ([1df28d4](https://github.com/cozy/cozy-libs/commit/1df28d4))




<a name="0.46.0"></a>
# [0.46.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.45.6...cozy-harvest-lib@0.46.0) (2019-05-23)


### Features

* **harvest:** :sparkles: Add AccountLogoutButton component ([ec1d050](https://github.com/cozy/cozy-libs/commit/ec1d050))
* **harvest:** :sparkles: Add deleteAccount func ([effb70e](https://github.com/cozy/cozy-libs/commit/effb70e))




<a name="0.45.6"></a>
## [0.45.6](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.45.5...cozy-harvest-lib@0.45.6) (2019-05-17)




**Note:** Version bump only for package cozy-harvest-lib

<a name="0.45.5"></a>
## [0.45.5](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.45.4...cozy-harvest-lib@0.45.5) (2019-05-16)


### Bug Fixes

* :wrench: Upgrade cozy-ui ([cdff2d4](https://github.com/cozy/cozy-libs/commit/cdff2d4))




<a name="0.45.4"></a>
## [0.45.4](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.45.3...cozy-harvest-lib@0.45.4) (2019-05-14)


### Bug Fixes

* :ambulance: Use static attribute for withLocales contextTypes ([dfeb621](https://github.com/cozy/cozy-libs/commit/dfeb621))




<a name="0.45.3"></a>
## [0.45.3](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.45.2...cozy-harvest-lib@0.45.3) (2019-05-14)


### Bug Fixes

* **harvest:** :pencil2: s/twofa_code/twoFACode ([477c87c](https://github.com/cozy/cozy-libs/commit/477c87c))




<a name="0.45.2"></a>
## [0.45.2](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.45.1...cozy-harvest-lib@0.45.2) (2019-05-14)


### Bug Fixes

* **harvest:** :ambulance: Add missing preventDefault to TwoFAForm ([7548130](https://github.com/cozy/cozy-libs/commit/7548130))




<a name="0.45.1"></a>
## [0.45.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.45.0...cozy-harvest-lib@0.45.1) (2019-05-14)


### Bug Fixes

* **harvest:** :ambulance: Use lang from context for withLocales ([f4a1db8](https://github.com/cozy/cozy-libs/commit/f4a1db8))




<a name="0.45.0"></a>
# [0.45.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.44.2...cozy-harvest-lib@0.45.0) (2019-05-13)


### Features

* **harvest:** :nail_care: Use <Infos/> for error messages ([9e98264](https://github.com/cozy/cozy-libs/commit/9e98264))




<a name="0.44.2"></a>
## [0.44.2](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.44.1...cozy-harvest-lib@0.44.2) (2019-05-13)


### Bug Fixes

* **harvest:** :bug: Prevent refresh on 2FA submit with enter ([61a4376](https://github.com/cozy/cozy-libs/commit/61a4376))
* **harvest:** :bug: Remove unsubscribingAll for realtime ([2a328d7](https://github.com/cozy/cozy-libs/commit/2a328d7))
* **harvest:** :nail_care: Unsubscribe realtime on unmount ([c76c2d9](https://github.com/cozy/cozy-libs/commit/c76c2d9))




<a name="0.44.1"></a>
## [0.44.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.44.0...cozy-harvest-lib@0.44.1) (2019-05-13)


### Bug Fixes

* **harvest:** :nail_care: Make 2FA modals not closeable ([0bc1bb4](https://github.com/cozy/cozy-libs/commit/0bc1bb4))




<a name="0.44.0"></a>
# [0.44.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.43.0...cozy-harvest-lib@0.44.0) (2019-05-09)


### Bug Fixes

* **harvest:** :nail_care: Don't show login error when not asked ([7c9aa61](https://github.com/cozy/cozy-libs/commit/7c9aa61))


### Features

* **harvest:** Handle login success state from konnector ([b5ec6d5](https://github.com/cozy/cozy-libs/commit/b5ec6d5))
* **harvest:** Handle login success to disable login success timeout ([a1dda87](https://github.com/cozy/cozy-libs/commit/a1dda87))




<a name="0.43.0"></a>
# [0.43.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.42.2...cozy-harvest-lib@0.43.0) (2019-05-09)


### Features

* **Harvest:** Upgrade cozy-realtime ([80a3f8d](https://github.com/cozy/cozy-libs/commit/80a3f8d))




<a name="0.42.2"></a>
## [0.42.2](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.42.1...cozy-harvest-lib@0.42.2) (2019-05-09)


### Bug Fixes

* **Realtime:** Bump version to 3.0.0 ([1396f2f](https://github.com/cozy/cozy-libs/commit/1396f2f))




<a name="0.42.1"></a>
## [0.42.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.42.0...cozy-harvest-lib@0.42.1) (2019-05-09)




**Note:** Version bump only for package cozy-harvest-lib

<a name="0.42.0"></a>
# [0.42.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.41.2...cozy-harvest-lib@0.42.0) (2019-05-07)


### Bug Fixes

* **harvest:** :nail_care: Pass KonnectorJob directly to TwoFAModal ([925fed8](https://github.com/cozy/cozy-libs/commit/925fed8))
* **harvest:** :nail_care: Split withKonnectorJob from the model ([ac75302](https://github.com/cozy/cozy-libs/commit/ac75302))
* **harvest:** :pencil2: Minor wording change ([48fd910](https://github.com/cozy/cozy-libs/commit/48fd910))
* **harvest:** Handle Two FA code retries correctly ([db6c561](https://github.com/cozy/cozy-libs/commit/db6c561))
* **harvest:** Use the same 2FA Modal for Trigger Manager/Launcher ([66646a8](https://github.com/cozy/cozy-libs/commit/66646a8))


### Features

* **harvest:** :nail_care: Let KonnectorJob handle statuses ([addbecd](https://github.com/cozy/cozy-libs/commit/addbecd))
* **harvest:** Add KonnectorJob ✨ ([486b30c](https://github.com/cozy/cozy-libs/commit/486b30c))
* **harvest:** Add Trigger Launcher ✨ ([9d368a8](https://github.com/cozy/cozy-libs/commit/9d368a8))
* **harvest:** Better success handling 📝" ([a612edc](https://github.com/cozy/cozy-libs/commit/a612edc))
* **harvest:** Creates TwoFAModal ✨ ([0f30174](https://github.com/cozy/cozy-libs/commit/0f30174))
* **harvest:** Enable success timer sooner 📝 ([f4598c2](https://github.com/cozy/cozy-libs/commit/f4598c2))
* **harvest:** Expose findAccount from accounts connections 📝 ([9a954c0](https://github.com/cozy/cozy-libs/commit/9a954c0))
* **harvest:** Provide getAccountId from triggers helper 📝 ([833d210](https://github.com/cozy/cozy-libs/commit/833d210))




<a name="0.41.2"></a>
## [0.41.2](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.41.1...cozy-harvest-lib@0.41.2) (2019-05-03)




**Note:** Version bump only for package cozy-harvest-lib

<a name="0.41.1"></a>
## [0.41.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.41.0...cozy-harvest-lib@0.41.1) (2019-05-02)


### Bug Fixes

* **harvest:** :lipstick: Fix 2FA modal on mobile ([1a7ce84](https://github.com/cozy/cozy-libs/commit/1a7ce84))
* **harvest:** :pencil2: Better 2FA errors messages ([d3cfc30](https://github.com/cozy/cozy-libs/commit/d3cfc30))




<a name="0.41.0"></a>
# [0.41.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.40.4...cozy-harvest-lib@0.41.0) (2019-05-02)


### Bug Fixes

* **deps:** update dependency cozy-ui to v19.28.0 ⬆️ ([d6b8307](https://github.com/cozy/cozy-libs/commit/d6b8307))


### Features

* **harvest:** Add focusNext method in AccountForm ✨ ([f88dbf4](https://github.com/cozy/cozy-libs/commit/f88dbf4))
* **harvest:** Add inputRef prop to AccountField 📝 ([58e7080](https://github.com/cozy/cozy-libs/commit/58e7080))
* **harvest:** Add inputRefByName prop to AccountFields 📝 ([a8af7f5](https://github.com/cozy/cozy-libs/commit/a8af7f5))
* **harvest:** Call focusNext on mobile ✨ ([a04f4d4](https://github.com/cozy/cozy-libs/commit/a04f4d4))




<a name="0.40.4"></a>
## [0.40.4](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.40.3...cozy-harvest-lib@0.40.4) (2019-04-30)


### Bug Fixes

* **harvest:** Reset the account state before running the konnector ([26a123e](https://github.com/cozy/cozy-libs/commit/26a123e))




<a name="0.40.3"></a>
## [0.40.3](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.40.2...cozy-harvest-lib@0.40.3) (2019-04-29)


### Bug Fixes

* **harvest:** Provide account state to reset session ([67cf4e5](https://github.com/cozy/cozy-libs/commit/67cf4e5))




<a name="0.40.2"></a>
## [0.40.2](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.40.1...cozy-harvest-lib@0.40.2) (2019-04-29)


### Bug Fixes

* **harvest:** :wrench: Better handling cozy dependencies as peerDeps ([262f5b9](https://github.com/cozy/cozy-libs/commit/262f5b9))
* **harvest:** :wrench: Use prop-types instead of react-proptypes ([b6f504d](https://github.com/cozy/cozy-libs/commit/b6f504d))




<a name="0.40.1"></a>
## [0.40.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.40.0...cozy-harvest-lib@0.40.1) (2019-04-26)


### Bug Fixes

* **harvest:** Handle Two FA errors ([3e8e10c](https://github.com/cozy/cozy-libs/commit/3e8e10c))




<a name="0.40.0"></a>
# [0.40.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.39.6...cozy-harvest-lib@0.40.0) (2019-04-26)


### Bug Fixes

* **harvest:** :art: Minor changes ([dd44448](https://github.com/cozy/cozy-libs/commit/dd44448))
* **harvest:** :bug: Handle document update conflict ([58d4139](https://github.com/cozy/cozy-libs/commit/58d4139))
* **harvest:** :nail_care: Handle closing TWOFA modal ([231c4df](https://github.com/cozy/cozy-libs/commit/231c4df))


### Features

* **harvest:** :sparkles: Handle 2FA process ([5fbdb60](https://github.com/cozy/cozy-libs/commit/5fbdb60))




<a name="0.39.6"></a>
## [0.39.6](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.39.5...cozy-harvest-lib@0.39.6) (2019-04-17)




**Note:** Version bump only for package cozy-harvest-lib

<a name="0.39.5"></a>
## [0.39.5](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.39.4...cozy-harvest-lib@0.39.5) (2019-04-14)




**Note:** Version bump only for package cozy-harvest-lib

<a name="0.39.4"></a>
## [0.39.4](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.39.3...cozy-harvest-lib@0.39.4) (2019-04-12)




**Note:** Version bump only for package cozy-harvest-lib

<a name="0.39.3"></a>
## [0.39.3](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.39.2...cozy-harvest-lib@0.39.3) (2019-04-05)


### Bug Fixes

* :bug: Use the correct realtime version ([9a9e69c](https://github.com/cozy/cozy-libs/commit/9a9e69c))




<a name="0.39.2"></a>
## [0.39.2](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.39.1...cozy-harvest-lib@0.39.2) (2019-04-04)


### Bug Fixes

* **harvest:** Better realtime initialisation 📝 ([89d9905](https://github.com/cozy/cozy-libs/commit/89d9905))




<a name="0.39.1"></a>
## [0.39.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.39.0...cozy-harvest-lib@0.39.1) (2019-04-04)


### Bug Fixes

* **deps:** update dependency cozy-ui to v19.21.2 ⬆️ ([461ccb2](https://github.com/cozy/cozy-libs/commit/461ccb2))




<a name="0.39.0"></a>
# [0.39.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.38.5...cozy-harvest-lib@0.39.0) (2019-04-04)


### Bug Fixes

* **harvest:** Ensure translated TriggerManager has context 📝 ([c074908](https://github.com/cozy/cozy-libs/commit/c074908))
* **harvest:** Handle keyup event from preact AND React 🚑 ([82da417](https://github.com/cozy/cozy-libs/commit/82da417))


### Features

* **harvest:** Stop exposing AccountForm, not used anymore 🔥 ([a32df85](https://github.com/cozy/cozy-libs/commit/a32df85))




<a name="0.38.5"></a>
## [0.38.5](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.38.4...cozy-harvest-lib@0.38.5) (2019-04-03)


### Bug Fixes

* **deps:** Update cozy-ui to v19.21.0 ([748ce07](https://github.com/cozy/cozy-libs/commit/748ce07))




<a name="0.38.4"></a>
## [0.38.4](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.38.3...cozy-harvest-lib@0.38.4) (2019-04-01)




**Note:** Version bump only for package cozy-harvest-lib

<a name="0.38.3"></a>
## [0.38.3](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.38.2...cozy-harvest-lib@0.38.3) (2019-03-29)


### Bug Fixes

* **harvest:** Initialize realtime with uri from CozyClient 🚑 ([50fd623](https://github.com/cozy/cozy-libs/commit/50fd623))




<a name="0.38.2"></a>
## [0.38.2](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.38.1...cozy-harvest-lib@0.38.2) (2019-03-28)




**Note:** Version bump only for package cozy-harvest-lib

<a name="0.38.1"></a>
## [0.38.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.38.0...cozy-harvest-lib@0.38.1) (2019-03-27)




**Note:** Version bump only for package cozy-harvest-lib

<a name="0.38.0"></a>
# [0.38.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.37.11...cozy-harvest-lib@0.38.0) (2019-03-19)


### Features

* **harvest:** Export KonnectorJobError from module ✨ ([c9c48bd](https://github.com/cozy/cozy-libs/commit/c9c48bd))
* **harvest:** KonnectorJobError now detects user errors ✨ ([4939b61](https://github.com/cozy/cozy-libs/commit/4939b61))




<a name="0.37.11"></a>
## [0.37.11](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.37.10...cozy-harvest-lib@0.37.11) (2019-03-18)




**Note:** Version bump only for package cozy-harvest-lib

<a name="0.37.10"></a>
## [0.37.10](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.37.9...cozy-harvest-lib@0.37.10) (2019-03-15)




**Note:** Version bump only for package cozy-harvest-lib

<a name="0.37.9"></a>
## [0.37.9](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.37.8...cozy-harvest-lib@0.37.9) (2019-03-15)


### Bug Fixes

* **deps:** update dependency cozy-client to v6.11.1 ([52ca2f4](https://github.com/cozy/cozy-libs/commit/52ca2f4))




<a name="0.37.8"></a>
## [0.37.8](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.37.7...cozy-harvest-lib@0.37.8) (2019-03-14)


### Bug Fixes

* **deps:** update dependency cozy-client to v6.9.0 ([3c43b1e](https://github.com/cozy/cozy-libs/commit/3c43b1e))




<a name="0.37.7"></a>
## [0.37.7](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.37.6...cozy-harvest-lib@0.37.7) (2019-03-13)


### Bug Fixes

* **harvest:** Login Failed message was wrong 🚑 ([69e3ae6](https://github.com/cozy/cozy-libs/commit/69e3ae6))




<a name="0.37.6"></a>
## [0.37.6](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.37.5...cozy-harvest-lib@0.37.6) (2019-03-13)


### Bug Fixes

* **harvest:** Import paths 🚑 ([0e118eb](https://github.com/cozy/cozy-libs/commit/0e118eb))




<a name="0.37.5"></a>
## [0.37.5](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.37.4...cozy-harvest-lib@0.37.5) (2019-03-13)


### Bug Fixes

* **harvest:** Success callbacks may be undefined ([40e7bbd](https://github.com/cozy/cozy-libs/commit/40e7bbd))




<a name="0.37.4"></a>
## [0.37.4](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.37.3...cozy-harvest-lib@0.37.4) (2019-03-13)


### Bug Fixes

* **harvest:** Use existing trigger 🚑 ([3212426](https://github.com/cozy/cozy-libs/commit/3212426))




<a name="0.37.3"></a>
## [0.37.3](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.37.2...cozy-harvest-lib@0.37.3) (2019-03-13)




**Note:** Version bump only for package cozy-harvest-lib

<a name="0.37.2"></a>
## [0.37.2](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.37.1...cozy-harvest-lib@0.37.2) (2019-03-13)




**Note:** Version bump only for package cozy-harvest-lib

<a name="0.37.1"></a>
## [0.37.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.37.0...cozy-harvest-lib@0.37.1) (2019-03-12)




**Note:** Version bump only for package cozy-harvest-lib

<a name="0.37.0"></a>
# [0.37.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.36.4...cozy-harvest-lib@0.37.0) (2019-03-12)


### Features

* **harvest:** Add showError prop to AccountForm ✨ ([7c90738](https://github.com/cozy/cozy-libs/commit/7c90738))
* **harvest:** Retrieve error from trigger prop 📝 ([7e3150f](https://github.com/cozy/cozy-libs/commit/7e3150f))




<a name="0.36.4"></a>
## [0.36.4](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.36.3...cozy-harvest-lib@0.36.4) (2019-03-12)




**Note:** Version bump only for package cozy-harvest-lib

<a name="0.36.3"></a>
## [0.36.3](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.36.2...cozy-harvest-lib@0.36.3) (2019-03-12)




**Note:** Version bump only for package cozy-harvest-lib

<a name="0.36.2"></a>
## [0.36.2](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.36.1...cozy-harvest-lib@0.36.2) (2019-03-12)




**Note:** Version bump only for package cozy-harvest-lib

<a name="0.36.1"></a>
## [0.36.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.36.0...cozy-harvest-lib@0.36.1) (2019-03-12)




**Note:** Version bump only for package cozy-harvest-lib

<a name="0.36.0"></a>
# [0.36.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.35.0...cozy-harvest-lib@0.36.0) (2019-03-12)


### Features

* **harvest:** Give focus to identifier field ✨ ([1122ff4](https://github.com/cozy/cozy-libs/commit/1122ff4))




<a name="0.35.0"></a>
# [0.35.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.34.3...cozy-harvest-lib@0.35.0) (2019-03-11)


### Features

* **harvest:** Handle key up on the whole AccountForm 📝 ([5b097db](https://github.com/cozy/cozy-libs/commit/5b097db))




<a name="0.34.3"></a>
## [0.34.3](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.34.2...cozy-harvest-lib@0.34.3) (2019-03-11)


### Bug Fixes

* **harvest:** Inject expected type for Field side prop 📝 ([2f83d2e](https://github.com/cozy/cozy-libs/commit/2f83d2e))




<a name="0.34.2"></a>
## [0.34.2](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.34.1...cozy-harvest-lib@0.34.2) (2019-03-08)


### Bug Fixes

* **deps:** pin dependency react-markdown to 4.0.6 ([#310](https://github.com/cozy/cozy-libs/issues/310)) ([c0b1845](https://github.com/cozy/cozy-libs/commit/c0b1845))




<a name="0.34.1"></a>
## [0.34.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.34.0...cozy-harvest-lib@0.34.1) (2019-03-08)


### Bug Fixes

* **harvest:** Prevent undefined captureStackTrace() 🚑 ([1be3e82](https://github.com/cozy/cozy-libs/commit/1be3e82))




<a name="0.34.0"></a>
# [0.34.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.33.0...cozy-harvest-lib@0.34.0) (2019-03-07)


### Features

* **harvest:** Account update handler also ensures trigger ✨ ([b7734c6](https://github.com/cozy/cozy-libs/commit/b7734c6))
* **harvest:** Keep trigger in TriggerManager state 📝 ([6a9617a](https://github.com/cozy/cozy-libs/commit/6a9617a))




<a name="0.33.0"></a>
# [0.33.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.32.2...cozy-harvest-lib@0.33.0) (2019-03-06)


### Features

* **harvest:** Add AccountFormError ✨ ([d293436](https://github.com/cozy/cozy-libs/commit/d293436))
* **harvest:** Add KonnectorJobError ✨ ([b71ac13](https://github.com/cozy/cozy-libs/commit/b71ac13))
* **harvest:** Catch errors from document mutations ✨ ([97c2e9d](https://github.com/cozy/cozy-libs/commit/97c2e9d))
* **harvest:** Catch errors in TriggerManager ✨ ([a0136c8](https://github.com/cozy/cozy-libs/commit/a0136c8))
* **harvest:** Handle error in AccountForm 📝 ([a72752e](https://github.com/cozy/cozy-libs/commit/a72752e))




<a name="0.32.2"></a>
## [0.32.2](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.32.1...cozy-harvest-lib@0.32.2) (2019-03-05)


### Bug Fixes

* **harvest:** RandomDayTime helper must handle floats 🚑 ([114889c](https://github.com/cozy/cozy-libs/commit/114889c))




<a name="0.32.1"></a>
## [0.32.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.32.0...cozy-harvest-lib@0.32.1) (2019-03-04)


### Bug Fixes

* **harvest:** Folder permission 🚑 ([e837673](https://github.com/cozy/cozy-libs/commit/e837673))




<a name="0.32.0"></a>
# [0.32.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.31.4...cozy-harvest-lib@0.32.0) (2019-03-04)


### Features

* **harvest:** Add files mutations ✨ ([b61ce9a](https://github.com/cozy/cozy-libs/commit/b61ce9a))
* **harvest:** Add getIdentifier() 📝 ([e922681](https://github.com/cozy/cozy-libs/commit/e922681))
* **harvest:** Add konnectors helpers ✨ ([df3c433](https://github.com/cozy/cozy-libs/commit/df3c433))
* **harvest:** Add permission on folder 📝 ([4ecfc6d](https://github.com/cozy/cozy-libs/commit/4ecfc6d))
* **harvest:** Add permissions mutations ✨ ([42a7e2c](https://github.com/cozy/cozy-libs/commit/42a7e2c))
* **harvest:** Add reference to file in konnector 📝 ([74e8932](https://github.com/cozy/cozy-libs/commit/74e8932))
* **harvest:** Add slug helper ✨ ([22bc11d](https://github.com/cozy/cozy-libs/commit/22bc11d))
* **harvest:** Build trigger with folder ✨ ([2774f88](https://github.com/cozy/cozy-libs/commit/2774f88))
* **harvest:** Create folder for konnector ✨ ([3194758](https://github.com/cozy/cozy-libs/commit/3194758))
* **harvest:** Get label from account 📝 ([567e161](https://github.com/cozy/cozy-libs/commit/567e161))
* **harvest:** Store the identifier field in account ✨ ([07e8e8e](https://github.com/cozy/cozy-libs/commit/07e8e8e))




<a name="0.31.4"></a>
## [0.31.4](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.31.3...cozy-harvest-lib@0.31.4) (2019-03-01)


### Bug Fixes

* **harvest:** Job returned on realtime update 🚑 ([0cdc65d](https://github.com/cozy/cozy-libs/commit/0cdc65d))




<a name="0.31.3"></a>
## [0.31.3](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.31.2...cozy-harvest-lib@0.31.3) (2019-02-28)


### Bug Fixes

* **harvest:** Job promise fullfilment 🚑 ([343defc](https://github.com/cozy/cozy-libs/commit/343defc))




<a name="0.31.2"></a>
## [0.31.2](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.31.1...cozy-harvest-lib@0.31.2) (2019-02-28)


### Bug Fixes

* **harvest:** Correct call to get aggregator account 🚑 ([48d00b9](https://github.com/cozy/cozy-libs/commit/48d00b9))




<a name="0.31.1"></a>
## [0.31.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.31.0...cozy-harvest-lib@0.31.1) (2019-02-26)


### Bug Fixes

* **deps:** update dependency final-form to v4.11.1 ([d14df07](https://github.com/cozy/cozy-libs/commit/d14df07))




<a name="0.31.0"></a>
# [0.31.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.30.0...cozy-harvest-lib@0.31.0) (2019-02-25)


### Features

* **harvest:** Prevent autocomplete on inputs ✨ ([de6e0dc](https://github.com/cozy/cozy-libs/commit/de6e0dc))




<a name="0.30.0"></a>
# [0.30.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.29.1...cozy-harvest-lib@0.30.0) (2019-02-21)


### Features

* **harvest:** Add trigger mutations ✨ ([27650e6](https://github.com/cozy/cozy-libs/commit/27650e6))
* **harvest:** Add TriggerManager ✨ ([fedaf26](https://github.com/cozy/cozy-libs/commit/fedaf26))
* **harvest:** Add Triggers helpers ✨ ([b0ba2c2](https://github.com/cozy/cozy-libs/commit/b0ba2c2))
* **harvest:** Add updateAccount mutation ✨ ([c56b4f2](https://github.com/cozy/cozy-libs/commit/c56b4f2))
* **harvest:** Disable AccountForm when submitting ✨ ([c7d910e](https://github.com/cozy/cozy-libs/commit/c7d910e))
* **harvest:** Enable form while editing with empty encrypted value 📝 ([79c9278](https://github.com/cozy/cozy-libs/commit/79c9278))
* **harvest:** Get Account mutations from Cozy-Home ♻️ ([5ef0ce8](https://github.com/cozy/cozy-libs/commit/5ef0ce8))
* **harvest:** Get Daytime helper from Cozy-Home ♻️ ([a5e5cdb](https://github.com/cozy/cozy-libs/commit/a5e5cdb))
* **harvest:** Handle Enter key in AccountForm ✨ ([240f252](https://github.com/cozy/cozy-libs/commit/240f252))
* **harvest:** Prepare AccountCreator component ✨ ([1af5e8d](https://github.com/cozy/cozy-libs/commit/1af5e8d))
* **harvest:** Prepare AccountEditor component ✨ ([4f6a3d0](https://github.com/cozy/cozy-libs/commit/4f6a3d0))
* **harvest:** Prepare TriggerSuccessMessage component ✨ ([1e043dc](https://github.com/cozy/cozy-libs/commit/1e043dc))
* **harvest:** Set up accounts helper ✨ ([8c6dfb8](https://github.com/cozy/cozy-libs/commit/8c6dfb8))




<a name="0.29.1"></a>
## [0.29.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.29.0...cozy-harvest-lib@0.29.1) (2019-02-14)


### Bug Fixes

* **harvest:** Oauth form condition 🚑 ([3232c19](https://github.com/cozy/cozy-libs/commit/3232c19))




<a name="0.29.0"></a>
# [0.29.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.28.1...cozy-harvest-lib@0.29.0) (2019-02-13)


### Features

* **harvest:** Handle legacy locale label 👴 ([6c64021](https://github.com/cozy/cozy-libs/commit/6c64021))




<a name="0.28.1"></a>
## [0.28.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.28.0...cozy-harvest-lib@0.28.1) (2019-02-12)




**Note:** Version bump only for package cozy-harvest-lib

<a name="0.28.0"></a>
# [0.28.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.27.0...cozy-harvest-lib@0.28.0) (2019-02-11)


### Features

* **harvest:** Handle legacy locales 🌐 ([c59d517](https://github.com/cozy/cozy-libs/commit/c59d517))
* Fails on Transifex pull error ❌ ([876205a](https://github.com/cozy/cozy-libs/commit/876205a))




<a name="0.27.0"></a>
# [0.27.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.25.2...cozy-harvest-lib@0.27.0) (2019-02-11)


### Features

* **harvest:** Do not show OAuth button in edit form 📝 ([241dbd4](https://github.com/cozy/cozy-libs/commit/241dbd4))




<a name="0.26.0"></a>
# [0.26.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.25.2...cozy-harvest-lib@0.26.0) (2019-02-07)


### Features

* **harvest:** Do not show OAuth button in edit form 📝 ([241dbd4](https://github.com/cozy/cozy-libs/commit/241dbd4))




<a name="0.25.2"></a>
## [0.25.2](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.25.1...cozy-harvest-lib@0.25.2) (2019-01-30)




**Note:** Version bump only for package cozy-harvest-lib

<a name="0.25.1"></a>
## [0.25.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.25.0...cozy-harvest-lib@0.25.1) (2019-01-29)




**Note:** Version bump only for package cozy-harvest-lib

<a name="0.25.0"></a>
# [0.25.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.24.4...cozy-harvest-lib@0.25.0) (2019-01-24)


### Features

* **harvest:** Add "optional" indicator for non required fields ([83beecc](https://github.com/cozy/cozy-libs/commit/83beecc))
* **harvest:** Handle fields legacy property isRequired 📝 ([1a66ab2](https://github.com/cozy/cozy-libs/commit/1a66ab2))




<a name="0.24.4"></a>
## [0.24.4](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.24.3...cozy-harvest-lib@0.24.4) (2019-01-23)




**Note:** Version bump only for package cozy-harvest-lib

<a name="0.24.3"></a>
## [0.24.3](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.24.2...cozy-harvest-lib@0.24.3) (2019-01-22)




**Note:** Version bump only for package cozy-harvest-lib

<a name="0.24.2"></a>
## [0.24.2](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.24.1...cozy-harvest-lib@0.24.2) (2019-01-21)




**Note:** Version bump only for package cozy-harvest-lib

<a name="0.24.1"></a>
## [0.24.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.24.0...cozy-harvest-lib@0.24.1) (2019-01-21)


### Bug Fixes

* **deps:** update dependency cozy-ui to v18.8.0 ([5008728](https://github.com/cozy/cozy-libs/commit/5008728))




<a name="0.24.0"></a>
# [0.24.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.23.0...cozy-harvest-lib@0.24.0) (2019-01-18)


### Features

* **harvest:** Use SelectBox container prop 📝 ([4a2a2c4](https://github.com/cozy/cozy-libs/commit/4a2a2c4))




<a name="0.23.0"></a>
# [0.23.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.22.1...cozy-harvest-lib@0.23.0) (2019-01-18)


### Features

* **harvest:** Improve placeholder for encrypted fields mechanism 📝 ([e9a6724](https://github.com/cozy/cozy-libs/commit/e9a6724))




<a name="0.22.1"></a>
## [0.22.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.22.0...cozy-harvest-lib@0.22.1) (2019-01-18)




**Note:** Version bump only for package cozy-harvest-lib

<a name="0.22.0"></a>
# [0.22.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.21.0...cozy-harvest-lib@0.22.0) (2019-01-18)


### Features

* **Travis:** Install Transifex 🌐 ([1a6ce8b](https://github.com/cozy/cozy-libs/commit/1a6ce8b))




<a name="0.21.0"></a>
# [0.21.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.20.0...cozy-harvest-lib@0.21.0) (2019-01-18)


### Features

* **harvest:** Handle dates 📝 ([391c413](https://github.com/cozy/cozy-libs/commit/391c413))




<a name="0.20.0"></a>
# [0.20.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.19.0...cozy-harvest-lib@0.20.0) (2019-01-17)


### Features

* **harvest:** Disable identifier with initial value 🚫 ([4390cef](https://github.com/cozy/cozy-libs/commit/4390cef))




<a name="0.19.0"></a>
# [0.19.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.18.0...cozy-harvest-lib@0.19.0) (2019-01-16)


### Features

* **valid:** Add validation to enable submit button ([2ac4108](https://github.com/cozy/cozy-libs/commit/2ac4108))




<a name="0.18.0"></a>
# [0.18.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.17.2...cozy-harvest-lib@0.18.0) (2019-01-15)


### Features

* **harvest:** Add default I18n placeholder ([7912d57](https://github.com/cozy/cozy-libs/commit/7912d57))




<a name="0.17.2"></a>
## [0.17.2](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.17.1...cozy-harvest-lib@0.17.2) (2019-01-11)




**Note:** Version bump only for package cozy-harvest-lib

<a name="0.17.1"></a>
## [0.17.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.17.0...cozy-harvest-lib@0.17.1) (2019-01-11)




**Note:** Version bump only for package cozy-harvest-lib

<a name="0.17.0"></a>
# [0.17.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.16.0...cozy-harvest-lib@0.17.0) (2019-01-11)


### Features

* **harvest:** Sanitize select props ✅ ([7b333f9](https://github.com/cozy/cozy-libs/commit/7b333f9))




<a name="0.16.0"></a>
# [0.16.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.15.0...cozy-harvest-lib@0.16.0) (2019-01-11)


### Features

* **harvest:** Handle default values from manifest ✨ ([017b6f1](https://github.com/cozy/cozy-libs/commit/017b6f1))




<a name="0.15.0"></a>
# [0.15.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.14.1...cozy-harvest-lib@0.15.0) (2019-01-10)


### Features

* **harvest:** Clean PropTypes 📝 ([326eb37](https://github.com/cozy/cozy-libs/commit/326eb37))




<a name="0.14.1"></a>
## [0.14.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.14.0...cozy-harvest-lib@0.14.1) (2019-01-10)




**Note:** Version bump only for package cozy-harvest-lib

<a name="0.14.0"></a>
# [0.14.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.13.0...cozy-harvest-lib@0.14.0) (2019-01-10)


### Features

* **harvest:** Set AccountField PropTypes 📝 ([89b0791](https://github.com/cozy/cozy-libs/commit/89b0791))
* **harvest:** Set AccountFields PropTypes 📝 ([c7533b8](https://github.com/cozy/cozy-libs/commit/c7533b8))




<a name="0.13.0"></a>
# [0.13.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.12.0...cozy-harvest-lib@0.13.0) (2019-01-09)


### Features

* **harvest:** Add field label fallback ✨ ([3c0d63f](https://github.com/cozy/cozy-libs/commit/3c0d63f))




<a name="0.12.0"></a>
# [0.12.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.11.0...cozy-harvest-lib@0.12.0) (2019-01-09)


### Features

* **harvest:** Encrypted placeholders ✨ ([bb14adb](https://github.com/cozy/cozy-libs/commit/bb14adb))
* **harvest:** Sanitize passwords as encrypted 📝 ([56eac76](https://github.com/cozy/cozy-libs/commit/56eac76))




<a name="0.11.0"></a>
# [0.11.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.10.1...cozy-harvest-lib@0.11.0) (2019-01-08)


### Features

* **harvest:** Handle dropdown fields ✨ ([f122a54](https://github.com/cozy/cozy-libs/commit/f122a54))




<a name="0.10.1"></a>
## [0.10.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.10.0...cozy-harvest-lib@0.10.1) (2019-01-08)




**Note:** Version bump only for package cozy-harvest-lib

<a name="0.10.0"></a>
# [0.10.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.9.0...cozy-harvest-lib@0.10.0) (2019-01-08)


### Features

* **harvest:** Add OAuthForm ✨ ([c356ae9](https://github.com/cozy/cozy-libs/commit/c356ae9))
* **harvest:** Predefined labels ✨ ([82bd1a2](https://github.com/cozy/cozy-libs/commit/82bd1a2))




<a name="0.9.0"></a>
# [0.9.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.8.0...cozy-harvest-lib@0.9.0) (2019-01-08)


### Features

* **InputPassword:** Add props labels to InputPassword ([a02a39e](https://github.com/cozy/cozy-libs/commit/a02a39e))




<a name="0.8.0"></a>
# [0.8.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.7.0...cozy-harvest-lib@0.8.0) (2019-01-03)


### Features

* **harvest:** Add PropTypes on AccountForm ✅ ([79e775e](https://github.com/cozy/cozy-libs/commit/79e775e))
* **harvest:** Handle existing account ✨ ([f8caa23](https://github.com/cozy/cozy-libs/commit/f8caa23))




<a name="0.7.0"></a>
# [0.7.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.6.0...cozy-harvest-lib@0.7.0) (2019-01-02)


### Features

* Configure Transifex 🌐 ([ea1d669](https://github.com/cozy/cozy-libs/commit/ea1d669))
* Handle I18n ([a2ad393](https://github.com/cozy/cozy-libs/commit/a2ad393))




<a name="0.6.0"></a>
# [0.6.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.5.0...cozy-harvest-lib@0.6.0) (2019-01-02)


### Features

* **harvest:** Improve AccountForm UI 💄 ([3e3581d](https://github.com/cozy/cozy-libs/commit/3e3581d))




<a name="0.5.0"></a>
# [0.5.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.4.1...cozy-harvest-lib@0.5.0) (2019-01-02)


### Features

* **harvest:** Add AccountForm ✨ ([98475ba](https://github.com/cozy/cozy-libs/commit/98475ba))




<a name="0.4.1"></a>
## [0.4.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.4.0...cozy-harvest-lib@0.4.1) (2018-12-28)




**Note:** Version bump only for package cozy-harvest-lib

<a name="0.4.0"></a>
# [0.4.0](https://github.com/cozy/cozy-libs/compare/cozy-harvest-lib@0.3.0...cozy-harvest-lib@0.4.0) (2018-12-27)


### Features

* **harvest:** Remove advancedFields from old manifests ([a998aa5](https://github.com/cozy/cozy-libs/commit/a998aa5))
* **Harvest:** Add Manifest sanitizer functions ([1f1f87b](https://github.com/cozy/cozy-libs/commit/1f1f87b))




<a name="0.3.0"></a>
# 0.3.0 (2018-12-27)


### Features

* **Harvest:** Rename lib ([7072e54](https://github.com/cozy/cozy-libs/commit/7072e54))




<a name="0.2.3"></a>
## [0.2.3](https://github.com/cozy/cozy-libs/compare/cozy-harvest@0.2.2...cozy-harvest@0.2.3) (2018-12-26)




**Note:** Version bump only for package cozy-harvest

<a name="0.2.2"></a>
## [0.2.2](https://github.com/cozy/cozy-libs/compare/cozy-harvest@0.2.0...cozy-harvest@0.2.2) (2018-12-17)




**Note:** Version bump only for package cozy-harvest

<a name="0.2.1"></a>
## [0.2.1](https://github.com/cozy/cozy-libs/compare/cozy-harvest@0.2.0...cozy-harvest@0.2.1) (2018-12-10)




**Note:** Version bump only for package cozy-harvest

<a name="0.2.0"></a>
# 0.2.0 (2018-12-04)


### Features

* **Harvest:** init cozy-harvest ([9d1ca73](https://github.com/cozy/cozy-libs/commit/9d1ca73))




# Change Log
