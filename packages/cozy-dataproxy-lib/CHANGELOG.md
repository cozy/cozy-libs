# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.4.0](https://github.com/cozy/cozy-libs/compare/cozy-dataproxy-lib@3.3.0...cozy-dataproxy-lib@3.4.0) (2025-02-11)


### Features

* Upgrade peer deps ([bc988ab](https://github.com/cozy/cozy-libs/commit/bc988abf6e417e23a46f93229b2f3ac9bd8b1c2d))





# [3.3.0](https://github.com/cozy/cozy-libs/compare/cozy-dataproxy-lib@3.2.1...cozy-dataproxy-lib@3.3.0) (2025-02-11)


### Features

* Allow init to be called independently ([22b0d73](https://github.com/cozy/cozy-libs/commit/22b0d7362b9d2bb3bdaa6bfcba67679c2b3b9518))





## [3.2.1](https://github.com/cozy/cozy-libs/compare/cozy-dataproxy-lib@3.2.0...cozy-dataproxy-lib@3.2.1) (2025-02-10)

**Note:** Version bump only for package cozy-dataproxy-lib





# [3.2.0](https://github.com/cozy/cozy-libs/compare/cozy-dataproxy-lib@3.1.0...cozy-dataproxy-lib@3.2.0) (2025-02-07)


### Features

* Add PerformanceApi to SearchEngine ([4de7f27](https://github.com/cozy/cozy-libs/commit/4de7f27685961ba2ede539b5a0d821ff28cd3a42)), closes [cozy/cozy-client#1574](https://github.com/cozy/cozy-client/issues/1574)
* Upgrade cozy-client to `53.1.0` ([70a5170](https://github.com/cozy/cozy-libs/commit/70a5170fad152f28d70b6fb20ed5fc3b85539683)), closes [cozy/cozy-client#1574](https://github.com/cozy/cozy-client/issues/1574)





# [3.1.0](https://github.com/cozy/cozy-libs/compare/cozy-dataproxy-lib@3.0.3...cozy-dataproxy-lib@3.1.0) (2025-02-06)


### Features

* Do not rebuild search index from scratch ([008e18d](https://github.com/cozy/cozy-libs/commit/008e18de784db1d31268af6e5871fa2986f02b3c))
* Retry search with exponential backoff ([5b00b12](https://github.com/cozy/cozy-libs/commit/5b00b12c9321935648670f8bc0b8e00296ca0344))





## [3.0.3](https://github.com/cozy/cozy-libs/compare/cozy-dataproxy-lib@3.0.2...cozy-dataproxy-lib@3.0.3) (2025-01-29)


### Bug Fixes

* Prevent registering RealtimePlugin if it is already registered ([24165f3](https://github.com/cozy/cozy-libs/commit/24165f30e817ccfd7daa8ba588a03a03e994cf81))





## [3.0.2](https://github.com/cozy/cozy-libs/compare/cozy-dataproxy-lib@3.0.1...cozy-dataproxy-lib@3.0.2) (2025-01-29)


### Bug Fixes

* Improve indexing time ([4291f76](https://github.com/cozy/cozy-libs/commit/4291f7673a543c67633eed7b8414579d5b4167f0))
* Index documents only after login ([f57e756](https://github.com/cozy/cozy-libs/commit/f57e75699a477cdc53073d20c71f92fc2adea6cb))





## [3.0.1](https://github.com/cozy/cozy-libs/compare/cozy-dataproxy-lib@3.0.0...cozy-dataproxy-lib@3.0.1) (2025-01-28)

**Note:** Version bump only for package cozy-dataproxy-lib





# [3.0.0](https://github.com/cozy/cozy-libs/compare/cozy-dataproxy-lib@2.4.1...cozy-dataproxy-lib@3.0.0) (2025-01-27)


### Bug Fixes

* Cozy-pouch-link as peerDep to avoid version conflict ([5a93d82](https://github.com/cozy/cozy-libs/commit/5a93d8203491e7e1eb5d4e16162320da45fb5989)), closes [/github.com/cozy/cozy-libs/blob/master/packages/cozy-dataproxy-lib/src/search/SearchEngine.ts#L56](https://github.com//github.com/cozy/cozy-libs/blob/master/packages/cozy-dataproxy-lib/src/search/SearchEngine.ts/issues/L56)


### Features

* Handle offline queries ([706ce6e](https://github.com/cozy/cozy-libs/commit/706ce6ec6fa8389e95d01a129bbc32bb2bd00251))


### BREAKING CHANGES

* it is now required to have cozy-pouch-link as
a dependency for a client to benefit from the local search
functionalities.





## [2.4.1](https://github.com/cozy/cozy-libs/compare/cozy-dataproxy-lib@2.4.0...cozy-dataproxy-lib@2.4.1) (2025-01-20)

**Note:** Version bump only for package cozy-dataproxy-lib





# [2.4.0](https://github.com/cozy/cozy-libs/compare/cozy-dataproxy-lib@2.3.1...cozy-dataproxy-lib@2.4.0) (2025-01-16)


### Features

* Make the DataProxyProvider work in Flagship app ([9d770b9](https://github.com/cozy/cozy-libs/commit/9d770b9508d75cb5dbf1c3d0a7266271499b6ff1))





## [2.3.1](https://github.com/cozy/cozy-libs/compare/cozy-dataproxy-lib@2.3.0...cozy-dataproxy-lib@2.3.1) (2025-01-15)


### Bug Fixes

* Export `stylesheet.css` in cozy-dataproxy-lib's package.json ([3180654](https://github.com/cozy/cozy-libs/commit/31806543986efcc98a14ff1d0ede609707bffbe0))





# [2.3.0](https://github.com/cozy/cozy-libs/compare/cozy-dataproxy-lib@2.2.0...cozy-dataproxy-lib@2.3.0) (2024-12-24)


### Features

* Enable search options ([4f07fec](https://github.com/cozy/cozy-libs/commit/4f07fec7aaa0d00c3d3083e5972de5e5823f36d0))





# [2.2.0](https://github.com/cozy/cozy-libs/compare/cozy-dataproxy-lib@2.1.1...cozy-dataproxy-lib@2.2.0) (2024-12-20)


### Features

* Display message if no enough char in query and no assistant ([b78963f](https://github.com/cozy/cozy-libs/commit/b78963f906dc02c409c6885fc73a5f559a8a9b89))





## [2.1.1](https://github.com/cozy/cozy-libs/compare/cozy-dataproxy-lib@2.1.0...cozy-dataproxy-lib@2.1.1) (2024-12-20)


### Bug Fixes

* Do not instanciate iframe for RN env ([15327ad](https://github.com/cozy/cozy-libs/commit/15327ad77e637007b1f8e3ef81287b200a213ebe))





# [2.1.0](https://github.com/cozy/cozy-libs/compare/cozy-dataproxy-lib@2.0.0...cozy-dataproxy-lib@2.1.0) (2024-12-19)


### Bug Fixes

* Deal with malformed docs ([c758aed](https://github.com/cozy/cozy-libs/commit/c758aed7bf7f2f3796f824ddd20e1de7e4ee97b6))
* Force iframe style dimension to 0 ([909dc07](https://github.com/cozy/cozy-libs/commit/909dc07f7cdfa41f5d6842564231f04adf77d9af))


### Features

* Display message if no results and no assistant ([9d1c3b0](https://github.com/cozy/cozy-libs/commit/9d1c3b0227edfc7f29360dc4f220824a97878efc))





# [2.0.0](https://github.com/cozy/cozy-libs/compare/cozy-dataproxy-lib@1.9.0...cozy-dataproxy-lib@2.0.0) (2024-12-19)


### Bug Fixes

* Invalid proptypes for AssistantDesktop ([be7fec2](https://github.com/cozy/cozy-libs/commit/be7fec28ab1500a30befe0ccc257d37e2684f3e3))


### Features

* Add subpath exports ([512e816](https://github.com/cozy/cozy-libs/commit/512e816cfe71a5087060d6cb001dc4f235b744f4))
* Move cozy-device-helper to peerDeps ([90dd54e](https://github.com/cozy/cozy-libs/commit/90dd54e57f86eb1d3f35a7d0da1df2929d58adfb))


### BREAKING CHANGES

* you now need cozy-device-helper >= 3.7.1





# [1.9.0](https://github.com/cozy/cozy-libs/compare/cozy-dataproxy-lib@1.8.4...cozy-dataproxy-lib@1.9.0) (2024-12-17)


### Features

* Adapt search placeholder if assistant is disabled ([9488f39](https://github.com/cozy/cozy-libs/commit/9488f390a3c6c833105996abc7c7190edf5878ec))
* Add locales for assistant SearchDialog ([86fd569](https://github.com/cozy/cozy-libs/commit/86fd56977a0327e5c6da0030a2b6ff7e0167fc40))
* Copy search and assistant UI from cozy-home to cozy-dataproxy-lib ([554e681](https://github.com/cozy/cozy-libs/commit/554e6819238fcde96cf7bd554e6d8d673558e4b4))
* Make AssistantWrapperDesktop generic ([c84845c](https://github.com/cozy/cozy-libs/commit/c84845cbbe53f33d3deb3fea834a9afcd80d36fc))
* Make AssistantWrapperMobile more generic ([2167e2a](https://github.com/cozy/cozy-libs/commit/2167e2a4aa163930a72fbd0b380ddbb78ce82d5c))
* Rename exposed assistant component ([f316ab3](https://github.com/cozy/cozy-libs/commit/f316ab381dd9a6bb36310675f334c86b21b01e47))





## [1.8.4](https://github.com/cozy/cozy-libs/compare/cozy-dataproxy-lib@1.8.3...cozy-dataproxy-lib@1.8.4) (2024-12-13)


### Bug Fixes

* Imprecise search results ([bfe0bd7](https://github.com/cozy/cozy-libs/commit/bfe0bd7ec243e013fe79448971bc103e6c359860))





## [1.8.3](https://github.com/cozy/cozy-libs/compare/cozy-dataproxy-lib@1.8.2...cozy-dataproxy-lib@1.8.3) (2024-12-13)


### Bug Fixes

* Remove file from search after realtime event ([9bf28dc](https://github.com/cozy/cozy-libs/commit/9bf28dc94bda3ec82c8127f041fb44b7be96d355))





## [1.8.2](https://github.com/cozy/cozy-libs/compare/cozy-dataproxy-lib@1.8.1...cozy-dataproxy-lib@1.8.2) (2024-12-12)

**Note:** Version bump only for package cozy-dataproxy-lib





## [1.8.1](https://github.com/cozy/cozy-libs/compare/cozy-dataproxy-lib@1.8.0...cozy-dataproxy-lib@1.8.1) (2024-11-26)


### Bug Fixes

* Revert "feat: Do not use flexsearch store" ([af9880b](https://github.com/cozy/cozy-libs/commit/af9880b6caf3a39d8e1d96605b60b67000332429))





# [1.8.0](https://github.com/cozy/cozy-libs/compare/cozy-dataproxy-lib@1.7.0...cozy-dataproxy-lib@1.8.0) (2024-11-26)


### Features

* Use forward and reverse tokenization ([8ac96fd](https://github.com/cozy/cozy-libs/commit/8ac96fd6593f7fcd9b3e22944e4e98b60608aa34))





# [1.7.0](https://github.com/cozy/cozy-libs/compare/cozy-dataproxy-lib@1.6.0...cozy-dataproxy-lib@1.7.0) (2024-11-26)


### Features

* Do not use flexsearch store ([104ea85](https://github.com/cozy/cozy-libs/commit/104ea850ef9b2bf5ae5094f5d10f81bf8872bcf1))





# [1.6.0](https://github.com/cozy/cozy-libs/compare/cozy-dataproxy-lib@1.5.0...cozy-dataproxy-lib@1.6.0) (2024-11-20)


### Features

* Improve indexing time ([6b98c7a](https://github.com/cozy/cozy-libs/commit/6b98c7a3b6bba2aa7cbb0e75b2db936d31e1e611))





# [1.5.0](https://github.com/cozy/cozy-libs/compare/cozy-dataproxy-lib@1.4.1...cozy-dataproxy-lib@1.5.0) (2024-11-19)


### Features

* Use parent path in secondary url and subtitle ([d3493db](https://github.com/cozy/cozy-libs/commit/d3493db2a6503ba1be9fafddc076bbaeaba343f7))





## [1.4.1](https://github.com/cozy/cozy-libs/compare/cozy-dataproxy-lib@1.4.0...cozy-dataproxy-lib@1.4.1) (2024-11-19)


### Bug Fixes

* Handle shared notes ([ec8014c](https://github.com/cozy/cozy-libs/commit/ec8014c01722668c886dc5def455a55ca7f38cff))





# [1.4.0](https://github.com/cozy/cozy-libs/compare/cozy-dataproxy-lib@1.3.1...cozy-dataproxy-lib@1.4.0) (2024-11-13)


### Features

* Add secondaryUrl to search result ([eab168c](https://github.com/cozy/cozy-libs/commit/eab168c1603b926cd8de8e6d7b9893e75ddd764c))





## [1.3.1](https://github.com/cozy/cozy-libs/compare/cozy-dataproxy-lib@1.3.0...cozy-dataproxy-lib@1.3.1) (2024-11-13)


### Bug Fixes

* Clean path only for files, not directory ([ba015d9](https://github.com/cozy/cozy-libs/commit/ba015d9a7e5ab9ad355ddb8c0867abd2f86ca90f))
* Remove file name from path after search ([431c37b](https://github.com/cozy/cozy-libs/commit/431c37bc7395525ca51fe4bf009f57f923a254a5))





# [1.3.0](https://github.com/cozy/cozy-libs/compare/cozy-dataproxy-lib@1.2.0...cozy-dataproxy-lib@1.3.0) (2024-11-08)


### Bug Fixes

* Realtime ([a9e2ad5](https://github.com/cozy/cozy-libs/commit/a9e2ad5a9c66c19bfd9e2e8c40bf114e936ac984))


### Features

* Handle search on both path and name ([50bcdf3](https://github.com/cozy/cozy-libs/commit/50bcdf3098e12e2cf5e992d5ab04453a6b9e62e8))





# [1.2.0](https://github.com/cozy/cozy-libs/compare/cozy-dataproxy-lib@1.1.1...cozy-dataproxy-lib@1.2.0) (2024-11-08)


### Features

* Use local search only for peristent sessions ([dc2b38e](https://github.com/cozy/cozy-libs/commit/dc2b38ec6c2a5ff37517a6697a863d7c83656496))





## 1.1.1 (2024-11-06)


### Bug Fixes

* Rename cozy-dataproxy to cozy-dataproxy-lib ([635d421](https://github.com/cozy/cozy-libs/commit/635d421045fc0374ca88cd68ec4941c95c40a0dd))





# 1.1.0 (2024-11-06)


### Features

* Upgrade cozy-client and cozy-pouch-link ([67f5241](https://github.com/cozy/cozy-libs/commit/67f5241754e0472a991dad3e5fafd0b1c5edb9c6)), closes [cozy/cozy-client#1553](https://github.com/cozy/cozy-client/issues/1553) [cozy/cozy-client#1556](https://github.com/cozy/cozy-client/issues/1556)
