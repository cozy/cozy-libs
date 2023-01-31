# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 5.4.0 (2023-01-31)


### Features

* Update cozy-client and cozy-ui ([6ae3b04](https://github.com/cozy/cozy-libs/commit/6ae3b04925ae64fa30f3ec8b6e716453d0a630fe))





# 5.3.0 (2023-01-27)


### Features

* Add tax_notice aquisitionSteps ([7dc2ce6](https://github.com/cozy/cozy-libs/commit/7dc2ce63b3271208ad45283bbee0f0e116e9a187))





# 5.2.0 (2022-11-28)


### Bug Fixes

* **mespapiers:** Breaking change of cozy-ui 77 ([be3098e](https://github.com/cozy/cozy-libs/commit/be3098e4acb8d5781cb5444ee82e77c38d2db01d))


### Features

* Update eslint-config-cozy-app ([a0a55db](https://github.com/cozy/cozy-libs/commit/a0a55dbd95477bc99d9a927c65cffc08c824e80b))





## 5.1.1 (2022-10-03)

**Note:** Version bump only for package eslint-config-cozy-app





# [5.1.0](https://github.com/cozy/cozy-libs/compare/eslint-config-cozy-app@5.0.0...eslint-config-cozy-app@5.1.0) (2022-09-12)


### Features

* Add new extend for TS files in lint conf ([70c0370](https://github.com/cozy/cozy-libs/commit/70c03703827ce7a2951c78c23636d8ae8510a3f4))





# 5.0.0 (2022-08-31)


### Features

* **mespapiers-lib:** Update `cozy-ui` dependency to v70.5.1 ([ce13857](https://github.com/cozy/cozy-libs/commit/ce13857943ea887c7d30d82c20f0b538c9f7139f))
* Update eslint-config-cozy-app ([d86a9ec](https://github.com/cozy/cozy-libs/commit/d86a9ec688527778829aa33688194c6487fbaebe))


### BREAKING CHANGES

* - Removing Vue linting

We were a bit behind in versions, bugs started to leak in our lints.
These version upgrades should fix them,
but they also have a small chance to detect new lint errors.





## 4.2.1 (2022-08-01)


### Bug Fixes

* **node:** Upgrade to Node 16 ([3a82521](https://github.com/cozy/cozy-libs/commit/3a825217b4a55d6434b20660d73df44ab17e7bd0))





# [4.2.0](https://github.com/cozy/cozy-libs/compare/eslint-config-cozy-app@4.1.1...eslint-config-cozy-app@4.2.0) (2022-06-10)


### Features

* Upgrade eslint-plugin-react-hooks ([b8d3895](https://github.com/cozy/cozy-libs/commit/b8d38952ed2c00e085bb67d9b0db3b20a00b32d2))





## [4.1.1](https://github.com/cozy/cozy-libs/compare/eslint-config-cozy-app@4.1.0...eslint-config-cozy-app@4.1.1) (2022-06-10)


### Bug Fixes

* **eslint-config-cozy-app:** Settings for react ([37dbedb](https://github.com/cozy/cozy-libs/commit/37dbedb6885f5b29d0d1dbc93ff73de4e278308e))





# 4.1.0 (2022-06-09)


### Features

* **eslint-config:** Add `react/jsx-curly-brace-presence` rule ([be2e0a9](https://github.com/cozy/cozy-libs/commit/be2e0a9d9b520dee7fbcce8939a07444d75c0f2c)), closes [#1549](https://github.com/cozy/cozy-libs/issues/1549)





## [4.0.2](https://github.com/cozy/cozy-libs/compare/eslint-config-cozy-app@4.0.1...eslint-config-cozy-app@4.0.2) (2022-04-22)


### Bug Fixes

* **eslint-config:** Add rule for Windows user ([58918cf](https://github.com/cozy/cozy-libs/commit/58918cfa666d898f565845299cf8c669318b8740))





## 4.0.1 (2022-04-14)


### Bug Fixes

* **eslint-config:** Upgrade dependencies ([7a3111a](https://github.com/cozy/cozy-libs/commit/7a3111abb41b5c34a8a8c63fe925c2e41e6a1039))





# [4.0.0](https://github.com/cozy/cozy-libs/compare/eslint-config-cozy-app@3.0.1...eslint-config-cozy-app@4.0.0) (2022-01-07)


### Features

* **eslint:** Propose Eslint plugin promise ([1fded18](https://github.com/cozy/cozy-libs/commit/1fded18))


### BREAKING CHANGES

* **eslint:** Most errors are not auto fixable,
if needed, use // disable-next-line

Or insert in .eslintrc:
{
  "rules": {
    "promise/always-return": "warn",
    "promise/no-return-wrap": "warn",
    "promise/param-names": "warn",
    "promise/catch-or-return": "warn",
    "promise/no-native": "warn",
    "promise/no-nesting": "warn",
    "promise/no-promise-in-callback": "warn",
    "promise/no-callback-in-promise": "warn",
    "promise/avoid-new": "warn",
    "promise/no-new-statics": "warn",
    "promise/no-return-in-finally": "warn",
    "promise/valid-params": "warn"
  }
}





## [3.0.1](https://github.com/cozy/cozy-libs/compare/eslint-config-cozy-app@3.0.0...eslint-config-cozy-app@3.0.1) (2022-01-01)


### Bug Fixes

* Update eslint config to better handle TS projects ([5d35039](https://github.com/cozy/cozy-libs/commit/5d35039))





# 3.0.0 (2021-12-02)


### Features

* Add confirm trusted recipients dialog ([dfe1695](https://github.com/cozy/cozy-libs/commit/dfe1695))
* Handle Typescript files in eslint and babel configs ([fe658ed](https://github.com/cozy/cozy-libs/commit/fe658ed))


### BREAKING CHANGES

* - upgrade from eslint 5 to eslint 8
- upgrade prettier from 1 to 2
- you'll need to run --fix to fix lint issues after
the upgrade. Few errors are not auto fixable, you
can // disable-next-line if needed





## 2.1.1 (2021-09-03)


### Bug Fixes

* **deps:** update dependency eslint-plugin-react to v7.24.0 ([43af8c1](https://github.com/cozy/cozy-libs/commit/43af8c1))





# 2.1.0 (2021-02-12)


### Features

* Add finance theme ([bb8cf35](https://github.com/cozy/cozy-libs/commit/bb8cf35))





# [2.0.0](https://github.com/cozy/cozy-libs/compare/eslint-config-cozy-app@1.6.0...eslint-config-cozy-app@2.0.0) (2020-10-01)


### Bug Fixes

* Lint issue ([aa10617](https://github.com/cozy/cozy-libs/commit/aa10617))


### Features

* Throw error if comments are not spaced ([6dae942](https://github.com/cozy/cozy-libs/commit/6dae942))


### BREAKING CHANGES

* Comments without starting with a
space will throw an error. To fix them, you should
run lint --fix





# 1.6.0 (2020-09-01)


### Features

* Activate the no-param-reassign rule ([4bf903f](https://github.com/cozy/cozy-libs/commit/4bf903f)), closes [#1073](https://github.com/cozy/cozy-libs/issues/1073)





# 1.5.0 (2020-02-14)


### Features

* Adds no-console as eslint errors ([e5605fd](https://github.com/cozy/cozy-libs/commit/e5605fd))





# [1.4.0](https://github.com/cozy/cozy-libs/compare/eslint-config-cozy-app@1.3.4...eslint-config-cozy-app@1.4.0) (2020-01-21)


### Features

* **eslint-config-cozy-app:** Add react-hooks plugin ([6bea38b](https://github.com/cozy/cozy-libs/commit/6bea38b))





## 1.3.4 (2020-01-06)

**Note:** Version bump only for package eslint-config-cozy-app





## [1.3.3](https://github.com/cozy/cozy-libs/compare/eslint-config-cozy-app@1.3.2...eslint-config-cozy-app@1.3.3) (2019-10-07)

**Note:** Version bump only for package eslint-config-cozy-app





## [1.3.2](https://github.com/cozy/cozy-libs/compare/eslint-config-cozy-app@1.3.1...eslint-config-cozy-app@1.3.2) (2019-09-16)

**Note:** Version bump only for package eslint-config-cozy-app





## [1.3.1](https://github.com/cozy/cozy-libs/compare/eslint-config-cozy-app@1.3.0...eslint-config-cozy-app@1.3.1) (2019-09-05)


### Bug Fixes

* **deps:** update dependency eslint-config-prettier to v4.3.0 ([b92900c](https://github.com/cozy/cozy-libs/commit/b92900c))





# 1.3.0 (2019-09-05)


### Features

* Add account route ([7986708](https://github.com/cozy/cozy-libs/commit/7986708))





## [1.2.3](https://github.com/cozy/cozy-libs/compare/eslint-config-cozy-app@1.2.2...eslint-config-cozy-app@1.2.3) (2019-09-04)

**Note:** Version bump only for package eslint-config-cozy-app





## [1.2.2](https://github.com/cozy/cozy-libs/compare/eslint-config-cozy-app@1.2.1...eslint-config-cozy-app@1.2.2) (2019-08-21)


### Bug Fixes

* **deps:** update dependency eslint-plugin-prettier to v3.1.0 ([96d689f](https://github.com/cozy/cozy-libs/commit/96d689f))





## 1.2.1 (2019-08-20)


### Bug Fixes

* Only use defaultDir in the manifest ([dee6277](https://github.com/cozy/cozy-libs/commit/dee6277))





# 1.2.0 (2019-07-18)


### Bug Fixes

* **eslint-config-cozy-app:** Update eslint-plugin-vue to v5.2.3 ([#663](https://github.com/CPatchane/create-cozy-app/issues/663)) ([8049e10](https://github.com/CPatchane/create-cozy-app/commit/8049e10))


### Features

* **cozy-doctypes:** Add BankAccountStats model ([4535696](https://github.com/CPatchane/create-cozy-app/commit/4535696))





<a name="1.1.12"></a>
## [1.1.12](https://github.com/CPatchane/create-cozy-app/compare/eslint-config-cozy-app@1.1.11...eslint-config-cozy-app@1.1.12) (2019-03-12)


### Bug Fixes

* **deps:** update dependency eslint-config-prettier to v4 ([1825941](https://github.com/CPatchane/create-cozy-app/commit/1825941))
* **deps:** Update dependency eslint-plugin-vue to v5.2.2 ([536670d](https://github.com/CPatchane/create-cozy-app/commit/536670d))




<a name="1.1.11"></a>
## [1.1.11](https://github.com/CPatchane/create-cozy-app/compare/eslint-config-cozy-app@1.1.10...eslint-config-cozy-app@1.1.11) (2019-03-12)


### Bug Fixes

* **deps:** update dependency prettier to v1.16.4 ([0bbe7ac](https://github.com/CPatchane/create-cozy-app/commit/0bbe7ac))




<a name="1.1.10"></a>
## [1.1.10](https://github.com/CPatchane/create-cozy-app/compare/eslint-config-cozy-app@1.1.9...eslint-config-cozy-app@1.1.10) (2019-03-08)


### Bug Fixes

* **deps:** update dependency eslint to v5.15.1 ([#79](https://github.com/CPatchane/create-cozy-app/issues/79)) ([21c246a](https://github.com/CPatchane/create-cozy-app/commit/21c246a))




<a name="1.1.9"></a>
## [1.1.9](https://github.com/CPatchane/create-cozy-app/compare/eslint-config-cozy-app@1.1.8...eslint-config-cozy-app@1.1.9) (2019-03-04)




**Note:** Version bump only for package eslint-config-cozy-app

<a name="1.1.8"></a>
## [1.1.8](https://github.com/CPatchane/create-cozy-app/compare/eslint-config-cozy-app@1.1.7...eslint-config-cozy-app@1.1.8) (2019-01-21)


### Bug Fixes

* **deps:** update dependency eslint-config-prettier to v3 ([c146f84](https://github.com/CPatchane/create-cozy-app/commit/c146f84))




<a name="1.1.7"></a>
## [1.1.7](https://github.com/CPatchane/create-cozy-app/compare/eslint-config-cozy-app@1.1.4...eslint-config-cozy-app@1.1.7) (2019-01-03)




**Note:** Version bump only for package eslint-config-cozy-app

<a name="1.1.6"></a>
## [1.1.6](https://github.com/CPatchane/create-cozy-app/compare/eslint-config-cozy-app@1.1.4...eslint-config-cozy-app@1.1.6) (2019-01-03)




**Note:** Version bump only for package eslint-config-cozy-app

<a name="1.1.5"></a>
## [1.1.5](https://github.com/CPatchane/create-cozy-app/compare/eslint-config-cozy-app@1.1.4...eslint-config-cozy-app@1.1.5) (2018-12-10)




**Note:** Version bump only for package eslint-config-cozy-app

<a name="1.1.4"></a>
## [1.1.4](https://github.com/CPatchane/create-cozy-app/compare/eslint-config-cozy-app@1.1.3...eslint-config-cozy-app@1.1.4) (2018-10-17)


### Bug Fixes

* **eslint-config-cozy-app:** Use latest react version ([69c5b05](https://github.com/CPatchane/create-cozy-app/commit/69c5b05))




<a name="1.1.3"></a>
## [1.1.3](https://github.com/CPatchane/create-cozy-app/compare/eslint-config-cozy-app@1.1.2...eslint-config-cozy-app@1.1.3) (2018-09-21)




**Note:** Version bump only for package eslint-config-cozy-app

<a name="1.1.2"></a>
## [1.1.2](https://github.com/CPatchane/create-cozy-app/compare/eslint-config-cozy-app@1.1.1...eslint-config-cozy-app@1.1.2) (2018-09-21)




**Note:** Version bump only for package eslint-config-cozy-app

<a name="1.1.1"></a>
## [1.1.1](https://github.com/CPatchane/create-cozy-app/compare/eslint-config-cozy-app@1.1.0...eslint-config-cozy-app@1.1.1) (2018-08-22)




**Note:** Version bump only for package eslint-config-cozy-app

<a name="1.1.0"></a>
# 1.1.0 (2018-08-09)


### Features

* import babel and eslint cozy-app from create-cozy-app ([0a3ab19](https://github.com/CPatchane/create-cozy-app/commit/0a3ab19))
