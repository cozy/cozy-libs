# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.3.0](https://github.com/cozy/cozy-libs/compare/cozy-flags@2.2.5...cozy-flags@2.3.0) (2020-07-08)


### Features

* Emit events when plugins are ready ([5fc182c](https://github.com/cozy/cozy-libs/commit/5fc182c))





## [2.2.5](https://github.com/cozy/cozy-libs/compare/cozy-flags@2.2.4...cozy-flags@2.2.5) (2020-06-09)


### Bug Fixes

* Remove initialization of flag did not work ([d743e09](https://github.com/cozy/cozy-libs/commit/d743e09))





## [2.2.4](https://github.com/cozy/cozy-libs/compare/cozy-flags@2.2.3...cozy-flags@2.2.4) (2020-02-27)

**Note:** Version bump only for package cozy-flags





## [2.2.3](https://github.com/cozy/cozy-libs/compare/cozy-flags@2.2.2...cozy-flags@2.2.3) (2020-02-25)

**Note:** Version bump only for package cozy-flags





## [2.2.2](https://github.com/cozy/cozy-libs/compare/cozy-flags@2.2.1...cozy-flags@2.2.2) (2020-02-24)


### Bug Fixes

* Init flags when client is already logged in ([ff4d3ed](https://github.com/cozy/cozy-libs/commit/ff4d3ed))





## [2.2.1](https://github.com/cozy/cozy-libs/compare/cozy-flags@2.2.0...cozy-flags@2.2.1) (2020-02-24)


### Bug Fixes

* Load flags from legacy DOM ([#968](https://github.com/cozy/cozy-libs/issues/968)) ([6f54cc7](https://github.com/cozy/cozy-libs/commit/6f54cc7))





# 2.2.0 (2020-02-06)


### Bug Fixes

* Use useEffect to clean up event handlers on unmount ([3cdf5be](https://github.com/cozy/cozy-libs/commit/3cdf5be))


### Features

* Add CozyClient plugin for automatic flag initialisation ([0959c8b](https://github.com/cozy/cozy-libs/commit/0959c8b))
* Deprecate flags.enable with an array ([85000f5](https://github.com/cozy/cozy-libs/commit/85000f5))
* Expose only 1 method to initialize flags ([f5a65ec](https://github.com/cozy/cozy-libs/commit/f5a65ec))
* Initialize flags from DOM ([d822f68](https://github.com/cozy/cozy-libs/commit/d822f68))
* Initialize from remote endpoint ([1383590](https://github.com/cozy/cozy-libs/commit/1383590))
* Use data-cozy-flags attribute instead of data-flags ([4254a8b](https://github.com/cozy/cozy-libs/commit/4254a8b))





# 2.1.0 (2020-01-24)


### Features

* Add notes folder ([94fa863](https://github.com/cozy/cozy-libs/commit/94fa863))
* Adds a useFlag react hook ([4c3df09](https://github.com/cozy/cozy-libs/commit/4c3df09))





# [2.0.0](https://github.com/cozy/cozy-libs/compare/cozy-flags@1.11.0...cozy-flags@2.0.0) (2019-12-09)


### Features

* Use conventional display name for HOC ([350e3c3](https://github.com/cozy/cozy-libs/commit/350e3c3))


### BREAKING CHANGES

* Components wrapped in `withFlags` HOC now have a
different `displayName`, that is more in coherence with other HOC in our
codebase. This will require a snapshots update.
Ex: flag_WrappedComponent becomes withFlags(WrappedComponent)





# 1.11.0 (2019-11-04)


### Bug Fixes

* Add account link ([9745b34](https://github.com/cozy/cozy-libs/commit/9745b34))


### Features

* Sort flags ([b60e44c](https://github.com/cozy/cozy-libs/commit/b60e44c))





# 1.10.0 (2019-09-05)


### Features

* Add account route ([7986708](https://github.com/cozy/cozy-libs/commit/7986708))





## [1.9.3](https://github.com/cozy/cozy-libs/compare/cozy-flags@1.9.2...cozy-flags@1.9.3) (2019-07-19)

**Note:** Version bump only for package cozy-flags





## [1.9.2](https://github.com/cozy/cozy-libs/compare/cozy-flags@1.9.1...cozy-flags@1.9.2) (2019-07-19)

**Note:** Version bump only for package cozy-flags





## [1.9.1](https://github.com/cozy/cozy-libs/compare/cozy-flags@1.9.0...cozy-flags@1.9.1) (2019-07-11)

**Note:** Version bump only for package cozy-flags





# [1.9.0](https://github.com/cozy/cozy-libs/compare/cozy-flags@1.8.0...cozy-flags@1.9.0) (2019-07-04)


### Bug Fixes

* Do not remove import with no specifiers (side-effect imports) ([4d0ad6c](https://github.com/cozy/cozy-libs/commit/4d0ad6c))
* Topbar back button ([100ffb9](https://github.com/cozy/cozy-libs/commit/100ffb9))


### Features

* Count JSX as React identifier ([f573490](https://github.com/cozy/cozy-libs/commit/f573490))





# [1.8.0](https://github.com/cozy/cozy-libs/compare/cozy-flags@1.7.0...cozy-flags@1.8.0) (2019-06-10)


### Features

* Add codemod for flags accessible via "cozy-flags apply" ([9327f24](https://github.com/cozy/cozy-libs/commit/9327f24))
* Remove unused imports after removing flags ([af43da1](https://github.com/cozy/cozy-libs/commit/af43da1))





<a name="1.7.0"></a>
# [1.7.0](https://github.com/cozy/cozy-libs/compare/cozy-flags@1.6.1...cozy-flags@1.7.0) (2019-05-23)


### Features

* Flag automatically backs up to localStorage if present ([24bcd04](https://github.com/cozy/cozy-libs/commit/24bcd04))




<a name="1.6.1"></a>
## 1.6.1 (2019-05-03)


### Bug Fixes

* Expose FlagSwitcher only in browser context ([f2fafa7](https://github.com/cozy/cozy-libs/commit/f2fafa7)), closes [#402](https://github.com/cozy/cozy-libs/issues/402)
* Fix cozy-mjml with nsjail ([#392](https://github.com/cozy/cozy-libs/issues/392)) ([300a4e6](https://github.com/cozy/cozy-libs/commit/300a4e6))




<a name="1.6.0"></a>
# [1.6.0](https://github.com/cozy/cozy-libs/compare/cozy-flags@1.5.9...cozy-flags@1.6.0) (2019-03-29)


### Features

* Flag hoc to connect to store ([98130a9](https://github.com/cozy/cozy-libs/commit/98130a9))
* Store flags in an object to avoid querying localStorage ([1f46ad1](https://github.com/cozy/cozy-libs/commit/1f46ad1))




<a name="1.5.9"></a>
## [1.5.9](https://github.com/cozy/cozy-libs/compare/cozy-flags@1.5.8...cozy-flags@1.5.9) (2019-03-18)




**Note:** Version bump only for package cozy-flags

<a name="1.5.8"></a>
## [1.5.8](https://github.com/cozy/cozy-libs/compare/cozy-flags@1.5.7...cozy-flags@1.5.8) (2019-03-12)




**Note:** Version bump only for package cozy-flags

<a name="1.5.7"></a>
## [1.5.7](https://github.com/cozy/cozy-libs/compare/cozy-flags@1.5.6...cozy-flags@1.5.7) (2019-03-12)




**Note:** Version bump only for package cozy-flags

<a name="1.5.6"></a>
## [1.5.6](https://github.com/cozy/cozy-libs/compare/cozy-flags@1.5.4...cozy-flags@1.5.6) (2019-03-12)




**Note:** Version bump only for package cozy-flags

<a name="1.5.5"></a>
## [1.5.5](https://github.com/cozy/cozy-libs/compare/cozy-flags@1.5.4...cozy-flags@1.5.5) (2019-02-12)




**Note:** Version bump only for package cozy-flags

<a name="1.5.4"></a>
## [1.5.4](https://github.com/cozy/cozy-libs/compare/cozy-flags@1.5.3...cozy-flags@1.5.4) (2019-02-11)




**Note:** Version bump only for package cozy-flags

<a name="1.5.3"></a>
## [1.5.3](https://github.com/cozy/cozy-libs/compare/cozy-flags@1.5.2...cozy-flags@1.5.3) (2019-01-30)




**Note:** Version bump only for package cozy-flags

<a name="1.5.2"></a>
## [1.5.2](https://github.com/cozy/cozy-libs/compare/cozy-flags@1.5.1...cozy-flags@1.5.2) (2019-01-29)




**Note:** Version bump only for package cozy-flags

<a name="1.5.1"></a>
## [1.5.1](https://github.com/cozy/cozy-libs/compare/cozy-flags@1.5.0...cozy-flags@1.5.1) (2019-01-11)




**Note:** Version bump only for package cozy-flags

<a name="1.5.0"></a>
# [1.5.0](https://github.com/cozy/cozy-libs/compare/cozy-flags@1.4.0...cozy-flags@1.5.0) (2019-01-04)


### Bug Fixes

* **flags:** Handle case where __ENABLED_FLAGS__ is undefined properly ([c771ff8](https://github.com/cozy/cozy-libs/commit/c771ff8))


### Features

* **flags:** Export enableFlags under flag namespace ([56a136f](https://github.com/cozy/cozy-libs/commit/56a136f))




<a name="1.4.0"></a>
# [1.4.0](https://github.com/cozy/cozy-libs/compare/cozy-flags@1.3.7...cozy-flags@1.4.0) (2019-01-03)


### Features

* **flags:** Handle flags enabled at build time ([87de30a](https://github.com/cozy/cozy-libs/commit/87de30a))




<a name="1.3.7"></a>
## [1.3.7](https://github.com/cozy/cozy-libs/compare/cozy-flags@1.3.6...cozy-flags@1.3.7) (2018-12-28)




**Note:** Version bump only for package cozy-flags

<a name="1.3.6"></a>
## [1.3.6](https://github.com/cozy/cozy-libs/compare/cozy-flags@1.3.5...cozy-flags@1.3.6) (2018-12-26)




**Note:** Version bump only for package cozy-flags

<a name="1.3.5"></a>
## [1.3.5](https://github.com/cozy/cozy-libs/compare/cozy-flags@1.3.4...cozy-flags@1.3.5) (2018-12-17)




**Note:** Version bump only for package cozy-flags

<a name="1.3.4"></a>
## [1.3.4](https://github.com/cozy/cozy-libs/compare/cozy-flags@1.3.2...cozy-flags@1.3.4) (2018-12-11)


### Bug Fixes

* **flags:** Use detect-node dep ([8bdf522](https://github.com/cozy/cozy-libs/commit/8bdf522))




<a name="1.3.3"></a>
## [1.3.3](https://github.com/cozy/cozy-libs/compare/cozy-flags@1.3.2...cozy-flags@1.3.3) (2018-12-10)




**Note:** Version bump only for package cozy-flags

<a name="1.3.2"></a>
## [1.3.2](https://github.com/cozy/cozy-libs/compare/cozy-flags@1.3.1...cozy-flags@1.3.2) (2018-12-10)


### Bug Fixes

* **flags:** Node and browser detection ([0b3c4d7](https://github.com/cozy/cozy-libs/commit/0b3c4d7))




<a name="1.3.1"></a>
## [1.3.1](https://github.com/cozy/cozy-libs/compare/cozy-flags@1.3.0...cozy-flags@1.3.1) (2018-12-06)


### Bug Fixes

* **flags:** Add default property to require ([94a4465](https://github.com/cozy/cozy-libs/commit/94a4465))




<a name="1.3.0"></a>
# [1.3.0](https://github.com/cozy/cozy-libs/compare/cozy-flags@1.2.12...cozy-flags@1.3.0) (2018-12-06)


### Features

* **flags:** Add node implementation ([a2aeb6c](https://github.com/cozy/cozy-libs/commit/a2aeb6c))




<a name="1.2.12"></a>
## [1.2.12](https://github.com/cozy/cozy-libs/compare/cozy-flags@1.2.11...cozy-flags@1.2.12) (2018-12-06)




**Note:** Version bump only for package cozy-flags

<a name="1.2.11"></a>
## [1.2.11](https://github.com/cozy/cozy-libs/compare/cozy-flags@1.2.10...cozy-flags@1.2.11) (2018-10-30)


### Bug Fixes

* Update homepage link ([728a850](https://github.com/cozy/cozy-libs/commit/728a850))




<a name="1.2.10"></a>
## [1.2.10](https://github.com/cozy/cozy-libs/compare/cozy-flags@1.2.9...cozy-flags@1.2.10) (2018-10-02)




**Note:** Version bump only for package cozy-flags

<a name="1.2.9"></a>
## [1.2.9](https://github.com/cozy/cozy-libs/compare/cozy-flags@1.2.8...cozy-flags@1.2.9) (2018-09-25)




**Note:** Version bump only for package cozy-flags

<a name="1.2.8"></a>
## [1.2.8](https://github.com/cozy/cozy-libs/compare/cozy-flags@1.2.7...cozy-flags@1.2.8) (2018-09-25)




**Note:** Version bump only for package cozy-flags

<a name="1.2.7"></a>
## [1.2.7](https://github.com/cozy/cozy-libs/compare/cozy-flags@1.2.6...cozy-flags@1.2.7) (2018-09-24)




**Note:** Version bump only for package cozy-flags

<a name="1.2.6"></a>
## [1.2.6](https://github.com/cozy/cozy-libs/compare/cozy-flags@1.2.5...cozy-flags@1.2.6) (2018-09-21)




**Note:** Version bump only for package cozy-flags

<a name="1.2.5"></a>
## [1.2.5](https://github.com/cozy/cozy-libs/compare/cozy-flags@1.2.4...cozy-flags@1.2.5) (2018-09-11)


### Bug Fixes

* **flags:** Return null if flag doesn't exist ([54096a7](https://github.com/cozy/cozy-libs/commit/54096a7))




<a name="1.2.4"></a>
## [1.2.4](https://github.com/cozy/cozy-libs/compare/cozy-flags@1.2.3...cozy-flags@1.2.4) (2018-08-30)




**Note:** Version bump only for package cozy-flags

<a name="1.2.3"></a>
## [1.2.3](https://github.com/cozy/cozy-libs/compare/cozy-flags@1.2.2...cozy-flags@1.2.3) (2018-08-22)




**Note:** Version bump only for package cozy-flags

<a name="1.2.2"></a>
## [1.2.2](https://github.com/cozy/cozy-libs/compare/cozy-flags@1.2.1...cozy-flags@1.2.2) (2018-08-09)




**Note:** Version bump only for package cozy-flags

<a name="1.2.1"></a>
## [1.2.1](https://github.com/cozy/cozy-libs/compare/cozy-flags@1.2.0...cozy-flags@1.2.1) (2018-08-08)




**Note:** Version bump only for package cozy-flags

<a name="1.2.0"></a>
# 1.2.0 (2018-08-08)


### Bug Fixes

* remove unused dependency 🔥 ([5fd7f1e](https://github.com/cozy/flags/commit/5fd7f1e))


### Features

* add flags library 😎 ([d42220b](https://github.com/cozy/flags/commit/d42220b))
