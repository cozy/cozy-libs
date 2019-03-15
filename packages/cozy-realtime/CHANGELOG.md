# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

  <a name="2.0.6"></a>
## [2.0.6](https://github.com/cozy/cozy-libs/compare/cozy-realtime@2.0.5...cozy-realtime@2.0.6) (2019-03-12)




**Note:** Version bump only for package cozy-realtime

  <a name="2.0.5"></a>
## [2.0.5](https://github.com/cozy/cozy-libs/compare/cozy-realtime@2.0.4...cozy-realtime@2.0.5) (2019-03-12)




**Note:** Version bump only for package cozy-realtime

 <a name="2.0.4"></a>
## [2.0.4](https://github.com/cozy/cozy-libs/compare/cozy-realtime@2.0.2...cozy-realtime@2.0.4) (2019-03-12)




**Note:** Version bump only for package cozy-realtime

<a name="2.0.3"></a>
## [2.0.3](https://github.com/cozy/cozy-libs/compare/cozy-realtime@2.0.2...cozy-realtime@2.0.3) (2019-02-12)




**Note:** Version bump only for package cozy-realtime

<a name="2.0.2"></a>
## [2.0.2](https://github.com/cozy/cozy-libs/compare/cozy-realtime@2.0.1...cozy-realtime@2.0.2) (2019-02-11)




**Note:** Version bump only for package cozy-realtime

<a name="2.0.1"></a>
## [2.0.1](https://github.com/cozy/cozy-libs/compare/cozy-realtime@2.0.0...cozy-realtime@2.0.1) (2019-02-07)




**Note:** Version bump only for package cozy-realtime

<a name="2.0.0"></a>
# [2.0.0](https://github.com/cozy/cozy-libs/compare/cozy-realtime@1.4.0...cozy-realtime@2.0.0) (2019-02-07)


### Bug Fixes

* :nail_care: Handle correctly websocket retries ([efd26d8](https://github.com/cozy/cozy-libs/commit/efd26d8)), closes [#199](https://github.com/cozy/cozy-libs/issues/199)
* :wrench: cache the socket promise instead of the socket itself ([f5a6c1d](https://github.com/cozy/cozy-libs/commit/f5a6c1d)), closes [#143](https://github.com/cozy/cozy-libs/issues/143)
* **realtime:** :bug: Better handling subscriptions state cleaning ([f6bc6fb](https://github.com/cozy/cozy-libs/commit/f6bc6fb))
* **realtime:** :bug: Func initCozySocket must define global cozySocket ([9d4c8c3](https://github.com/cozy/cozy-libs/commit/9d4c8c3))
* **realtime:** :nail_care: Remove async ([c426ffa](https://github.com/cozy/cozy-libs/commit/c426ffa))
* **realtime:** :nail_care: Use only global cozySocket ([d3b62e0](https://github.com/cozy/cozy-libs/commit/d3b62e0))
* **realtime:** :wrench: Minor review changes ([fbc7dfa](https://github.com/cozy/cozy-libs/commit/fbc7dfa))
* **realtime:** :wrench: Reorder subscribeWhenReady arguments ([40b81dc](https://github.com/cozy/cozy-libs/commit/40b81dc))
* **realtime:** 💅  Add max poll tries + tests to subscribeWhenReady ([3849ac6](https://github.com/cozy/cozy-libs/commit/3849ac6))


### Code Refactoring

* **realtime:** :sparkles: Remove async + use simpler API ([65e5a16](https://github.com/cozy/cozy-libs/commit/65e5a16)), closes [#145](https://github.com/cozy/cozy-libs/issues/145)


### Features

* **realtime:** Use promise instead of polling to handle authenticating ([bdbf440](https://github.com/cozy/cozy-libs/commit/bdbf440))


### BREAKING CHANGES

* **realtime:** New and simpler API + no more async usage




<a name="1.2.8"></a>
## [1.2.8](https://github.com/cozy/cozy-libs/compare/cozy-realtime@1.2.7...cozy-realtime@1.2.8) (2019-01-28)


### Bug Fixes

* **realtime:** Wrong links [skip ci] ([d80b3a0](https://github.com/cozy/cozy-libs/commit/d80b3a0))




<a name="1.2.7"></a>
## [1.2.7](https://github.com/cozy/cozy-libs/compare/cozy-realtime@1.2.6...cozy-realtime@1.2.7) (2019-01-16)


### Bug Fixes

* **RealTime:** Right repo URL ([1cdef02](https://github.com/cozy/cozy-libs/commit/1cdef02))




<a name="1.2.6"></a>
## [1.2.6](https://github.com/cozy/cozy-realtime/compare/cozy-realtime@1.2.5...cozy-realtime@1.2.6) (2019-01-11)




**Note:** Version bump only for package cozy-realtime

<a name="1.2.5"></a>
## [1.2.5](https://github.com/cozy/cozy-realtime/compare/cozy-realtime@1.2.4...cozy-realtime@1.2.5) (2018-12-28)




**Note:** Version bump only for package cozy-realtime

<a name="1.2.4"></a>
## [1.2.4](https://github.com/cozy/cozy-realtime/compare/cozy-realtime@1.2.3...cozy-realtime@1.2.4) (2018-12-26)




**Note:** Version bump only for package cozy-realtime

<a name="1.2.3"></a>
## [1.2.3](https://github.com/cozy/cozy-realtime/compare/cozy-realtime@1.2.1...cozy-realtime@1.2.3) (2018-12-17)




**Note:** Version bump only for package cozy-realtime

<a name="1.2.2"></a>
## [1.2.2](https://github.com/cozy/cozy-realtime/compare/cozy-realtime@1.2.1...cozy-realtime@1.2.2) (2018-12-10)




**Note:** Version bump only for package cozy-realtime

<a name="1.2.1"></a>
## [1.2.1](https://github.com/cozy/cozy-realtime/compare/cozy-realtime@1.2.0...cozy-realtime@1.2.1) (2018-11-27)




**Note:** Version bump only for package cozy-realtime

<a name="1.2.0"></a>
# [1.2.0](https://github.com/cozy/cozy-realtime/compare/cozy-realtime@1.1.10...cozy-realtime@1.2.0) (2018-10-04)


### Features

* **realtime:** Add secure parameter ✨ ([8993ac0](https://github.com/cozy/cozy-realtime/commit/8993ac0))
* **realtime:** Better string validation 📝 ([1c57d6b](https://github.com/cozy/cozy-realtime/commit/1c57d6b))
* **realtime:** Handle domain in config ✨ ([55b2be6](https://github.com/cozy/cozy-realtime/commit/55b2be6))
* **realtime:** New validation rules ✨ ([6f58276](https://github.com/cozy/cozy-realtime/commit/6f58276))
* **realtime:** Throw error when no domain 💥 ([e5b7669](https://github.com/cozy/cozy-realtime/commit/e5b7669))
* **realtime:** Validate url ✅ ([86f59b7](https://github.com/cozy/cozy-realtime/commit/86f59b7))




<a name="1.1.10"></a>
## [1.1.10](https://github.com/cozy/cozy-realtime/compare/cozy-realtime@1.1.9...cozy-realtime@1.1.10) (2018-10-02)




**Note:** Version bump only for package cozy-realtime

<a name="1.1.9"></a>
## [1.1.9](https://github.com/cozy/cozy-realtime/compare/cozy-realtime@1.1.8...cozy-realtime@1.1.9) (2018-09-25)




**Note:** Version bump only for package cozy-realtime

<a name="1.1.8"></a>
## [1.1.8](https://github.com/cozy/cozy-realtime/compare/cozy-realtime@1.1.7...cozy-realtime@1.1.8) (2018-09-25)




**Note:** Version bump only for package cozy-realtime

<a name="1.1.7"></a>
## [1.1.7](https://github.com/cozy/cozy-realtime/compare/cozy-realtime@1.1.6...cozy-realtime@1.1.7) (2018-09-24)




**Note:** Version bump only for package cozy-realtime

<a name="1.1.6"></a>
## [1.1.6](https://github.com/cozy/cozy-realtime/compare/cozy-realtime@1.1.5...cozy-realtime@1.1.6) (2018-09-21)




**Note:** Version bump only for package cozy-realtime

<a name="1.1.5"></a>
## [1.1.5](https://github.com/cozy/cozy-realtime/compare/cozy-realtime@1.1.4...cozy-realtime@1.1.5) (2018-08-30)




**Note:** Version bump only for package cozy-realtime

<a name="1.1.4"></a>
## [1.1.4](https://github.com/cozy/cozy-realtime/compare/cozy-realtime@1.1.3...cozy-realtime@1.1.4) (2018-08-22)




**Note:** Version bump only for package cozy-realtime

<a name="1.1.3"></a>
## [1.1.3](https://github.com/cozy/cozy-realtime/compare/cozy-realtime@1.1.2...cozy-realtime@1.1.3) (2018-08-17)


### Bug Fixes

* **realtime:** Domain parsing 🚑 ([9ffbc26](https://github.com/cozy/cozy-realtime/commit/9ffbc26))




<a name="1.1.2"></a>
## [1.1.2](https://github.com/cozy/cozy-realtime/compare/cozy-realtime@1.1.1...cozy-realtime@1.1.2) (2018-08-09)




**Note:** Version bump only for package cozy-realtime

<a name="1.1.1"></a>
## 1.1.1 (2018-08-08)




**Note:** Version bump only for package cozy-realtime
