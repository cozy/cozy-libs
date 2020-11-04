# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.4.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@2.3.1...cozy-sharing@2.4.0) (2020-11-04)


### Features

* RecipientAvatar are greyed if pending ([f8a7a53](https://github.com/cozy/cozy-libs/commit/f8a7a53))
* RecipientsAvatars doesn't show owner avatar if it's 'me' ([3adbba6](https://github.com/cozy/cozy-libs/commit/3adbba6))
* SharedStatus shows avatars instead of text ([0f7bf9b](https://github.com/cozy/cozy-libs/commit/0f7bf9b))





## [2.3.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@2.3.0...cozy-sharing@2.3.1) (2020-11-03)

**Note:** Version bump only for package cozy-sharing





# [2.3.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@2.2.0...cozy-sharing@2.3.0) (2020-10-29)


### Features

* Add size to title ([5f14685](https://github.com/cozy/cozy-libs/commit/5f14685))
* Display the document name in the Sharing Modale ([a7832ac](https://github.com/cozy/cozy-libs/commit/a7832ac))





# [2.2.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@2.1.0...cozy-sharing@2.2.0) (2020-10-26)


### Bug Fixes

* Add open_sharing attribute to share() ([8dd6f8d](https://github.com/cozy/cozy-libs/commit/8dd6f8d))
* GetPrimaryCozy is not exactly the same between doctypes and models ([f7e6a09](https://github.com/cozy/cozy-libs/commit/f7e6a09))
* If sharingType is read only don't display read / write option ([69f8be5](https://github.com/cozy/cozy-libs/commit/69f8be5))


### Features

* Pass the sharing Object down to the tree ([6b5e26b](https://github.com/cozy/cozy-libs/commit/6b5e26b))
* Upgrade Cozy-Client ([aac9610](https://github.com/cozy/cozy-libs/commit/aac9610))
* Upgrade cozy-client to get SharingAPI ([40b6e14](https://github.com/cozy/cozy-libs/commit/40b6e14))





# [2.1.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@2.0.0...cozy-sharing@2.1.0) (2020-10-19)


### Features

* Use @cozy/minilog instead of minilog ([621abad](https://github.com/cozy/cozy-libs/commit/621abad))





# [2.0.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.16.2...cozy-sharing@2.0.0) (2020-10-19)


### Bug Fixes

* SelectBox is displayed 'fixed' ([2445e83](https://github.com/cozy/cozy-libs/commit/2445e83))


### Features

* Upgrade Cozy-UI ([ca1cb0d](https://github.com/cozy/cozy-libs/commit/ca1cb0d))


### BREAKING CHANGES

* You have to upgrade at least
to UI 36.2.0 to have access to non
 ExperimentalDialog





## [1.16.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.16.1...cozy-sharing@1.16.2) (2020-10-01)


### Bug Fixes

* Lint issue ([aa10617](https://github.com/cozy/cozy-libs/commit/aa10617))





## [1.16.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.16.0...cozy-sharing@1.16.1) (2020-09-15)

**Note:** Version bump only for package cozy-sharing





# [1.16.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.15.2...cozy-sharing@1.16.0) (2020-09-10)


### Features

* Support sharings with shortcuts ([1c24ed0](https://github.com/cozy/cozy-libs/commit/1c24ed0))
* Use avatar from server ([2c56ac8](https://github.com/cozy/cozy-libs/commit/2c56ac8))





## [1.15.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.15.1...cozy-sharing@1.15.2) (2020-09-04)

**Note:** Version bump only for package cozy-sharing





## [1.15.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.15.0...cozy-sharing@1.15.1) (2020-09-02)


### Bug Fixes

* Ability to copy links ([69791e7](https://github.com/cozy/cozy-libs/commit/69791e7))
* Don't show clipboard error if automatic copy fails ([c21c690](https://github.com/cozy/cozy-libs/commit/c21c690))





# [1.15.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.14.0...cozy-sharing@1.15.0) (2020-08-28)


### Bug Fixes

* Adjust aligment issues ([efdf056](https://github.com/cozy/cozy-libs/commit/efdf056))
* Make keys more relevant ([2e77114](https://github.com/cozy/cozy-libs/commit/2e77114))


### Features

* Add MUI dependency ([15037a8](https://github.com/cozy/cozy-libs/commit/15037a8))
* Change share modal layout ([ad74703](https://github.com/cozy/cozy-libs/commit/ad74703))
* Dedicate dropdown menu to permissions ([337bb2c](https://github.com/cozy/cozy-libs/commit/337bb2c))
* Different display for error statuses ([c476b3c](https://github.com/cozy/cozy-libs/commit/c476b3c))
* Remove who has access title ([96fa93b](https://github.com/cozy/cozy-libs/commit/96fa93b))
* Sharing status is now always displayed ([b02cef3](https://github.com/cozy/cozy-libs/commit/b02cef3))
* Show pending status when we dont support the real status ([498640e](https://github.com/cozy/cozy-libs/commit/498640e))





# [1.14.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.13.8...cozy-sharing@1.14.0) (2020-08-21)


### Bug Fixes

* Remove warning in tests concerning Button label ([88ba928](https://github.com/cozy/cozy-libs/commit/88ba928))
* Use global minilog if available and remove logging by default ([91e3959](https://github.com/cozy/cozy-libs/commit/91e3959))


### Features

* Add isRequired on ShareModal `link` prop ([b3cd14e](https://github.com/cozy/cozy-libs/commit/b3cd14e))
* Update cozy-ui across all libs ([73549b0](https://github.com/cozy/cozy-libs/commit/73549b0))





## [1.13.8](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.13.7...cozy-sharing@1.13.8) (2020-08-20)


### Bug Fixes

* Use label instead of text to remove Proptypes warning ([10616e2](https://github.com/cozy/cozy-libs/commit/10616e2))





## [1.13.7](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.13.6...cozy-sharing@1.13.7) (2020-08-20)

**Note:** Version bump only for package cozy-sharing





## [1.13.6](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.13.5...cozy-sharing@1.13.6) (2020-08-20)

**Note:** Version bump only for package cozy-sharing





## [1.13.5](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.13.4...cozy-sharing@1.13.5) (2020-08-05)

**Note:** Version bump only for package cozy-sharing





## [1.13.4](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.13.3...cozy-sharing@1.13.4) (2020-08-05)


### Bug Fixes

* Shared Element when the document has no path ([#1054](https://github.com/cozy/cozy-libs/issues/1054)) ([6ebd223](https://github.com/cozy/cozy-libs/commit/6ebd223))





## [1.13.3](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.13.2...cozy-sharing@1.13.3) (2020-08-03)

**Note:** Version bump only for package cozy-sharing





## [1.13.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.13.1...cozy-sharing@1.13.2) (2020-07-27)

**Note:** Version bump only for package cozy-sharing





## [1.13.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.13.0...cozy-sharing@1.13.1) (2020-07-21)


### Bug Fixes

* Use same Cozy-UI and CozyClient version everywhere ([6216e62](https://github.com/cozy/cozy-libs/commit/6216e62))





# [1.13.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.12.0...cozy-sharing@1.13.0) (2020-07-20)


### Features

* Update cozy-client ([14ca0b9](https://github.com/cozy/cozy-libs/commit/14ca0b9))
* Update cozy-ui ([a8710f9](https://github.com/cozy/cozy-libs/commit/a8710f9))





# [1.12.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.11.7...cozy-sharing@1.12.0) (2020-07-16)


### Features

* Update lodash accross all packages ([6a20128](https://github.com/cozy/cozy-libs/commit/6a20128))





## [1.11.7](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.11.6...cozy-sharing@1.11.7) (2020-07-08)


### Bug Fixes

* Defer loading data until cozy-client is ready ([5b2a2c0](https://github.com/cozy/cozy-libs/commit/5b2a2c0))





## [1.11.6](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.11.5...cozy-sharing@1.11.6) (2020-07-08)

**Note:** Version bump only for package cozy-sharing





## [1.11.5](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.11.4...cozy-sharing@1.11.5) (2020-07-07)

**Note:** Version bump only for package cozy-sharing





## [1.11.4](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.11.3...cozy-sharing@1.11.4) (2020-06-29)

**Note:** Version bump only for package cozy-sharing





## [1.11.3](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.11.2...cozy-sharing@1.11.3) (2020-06-25)

**Note:** Version bump only for package cozy-sharing





## [1.11.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.11.1...cozy-sharing@1.11.2) (2020-06-17)

**Note:** Version bump only for package cozy-sharing





## [1.11.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.11.0...cozy-sharing@1.11.1) (2020-06-03)


### Bug Fixes

* No special case for sharing notes ([425b227](https://github.com/cozy/cozy-libs/commit/425b227))





# [1.11.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.10.1...cozy-sharing@1.11.0) (2020-04-27)


### Bug Fixes

* Export all components with locales ([5dd92cb](https://github.com/cozy/cozy-libs/commit/5dd92cb))
* Missing translation ([dddaf29](https://github.com/cozy/cozy-libs/commit/dddaf29))
* Removed extra space in string ([651f804](https://github.com/cozy/cozy-libs/commit/651f804))
* Upgrade ui and client ([c0b9b77](https://github.com/cozy/cozy-libs/commit/c0b9b77))


### Features

* Allow to update a link sharing in state ([d8970f3](https://github.com/cozy/cozy-libs/commit/d8970f3))
* Handle permission errors ([b7979f5](https://github.com/cozy/cozy-libs/commit/b7979f5))
* Removed share by link description ([abc9309](https://github.com/cozy/cozy-libs/commit/abc9309))
* Support writable link-sharing ([e099c7e](https://github.com/cozy/cozy-libs/commit/e099c7e))





## [1.10.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.10.0...cozy-sharing@1.10.1) (2020-03-26)

**Note:** Version bump only for package cozy-sharing





# [1.10.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.9.1...cozy-sharing@1.10.0) (2020-03-25)


### Features

* Expose hasWriteAccess function in context ([571fdc4](https://github.com/cozy/cozy-libs/commit/571fdc4))
* Expose SharingContext for usage in hooks ([04b0b5b](https://github.com/cozy/cozy-libs/commit/04b0b5b))





## [1.9.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.9.0...cozy-sharing@1.9.1) (2020-03-25)


### Bug Fixes

* Use _id instead of id ([de27d3b](https://github.com/cozy/cozy-libs/commit/de27d3b))





# [1.9.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.8.12...cozy-sharing@1.9.0) (2020-03-23)


### Bug Fixes

* Better regex to handle more complexe emails ([c2d6959](https://github.com/cozy/cozy-libs/commit/c2d6959))


### Features

* Handle copy paste string with emails + refacto ([f7042dd](https://github.com/cozy/cozy-libs/commit/f7042dd))





## [1.8.12](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.8.11...cozy-sharing@1.8.12) (2020-03-13)


### Bug Fixes

* Call revokeSelf if not the owner of the sharing ([f7afc60](https://github.com/cozy/cozy-libs/commit/f7afc60))





## [1.8.11](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.8.10...cozy-sharing@1.8.11) (2020-03-05)


### Bug Fixes

* Don't import from index ([9ab678c](https://github.com/cozy/cozy-libs/commit/9ab678c))





## [1.8.10](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.8.9...cozy-sharing@1.8.10) (2020-03-03)

**Note:** Version bump only for package cozy-sharing





## [1.8.9](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.8.8...cozy-sharing@1.8.9) (2020-02-27)

**Note:** Version bump only for package cozy-sharing





## [1.8.8](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.8.7...cozy-sharing@1.8.8) (2020-02-26)

**Note:** Version bump only for package cozy-sharing





## [1.8.7](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.8.6...cozy-sharing@1.8.7) (2020-02-26)

**Note:** Version bump only for package cozy-sharing





## [1.8.6](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.8.5...cozy-sharing@1.8.6) (2020-02-25)

**Note:** Version bump only for package cozy-sharing





## [1.8.5](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.8.4...cozy-sharing@1.8.5) (2020-02-24)

**Note:** Version bump only for package cozy-sharing





## [1.8.4](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.8.3...cozy-sharing@1.8.4) (2020-02-24)

**Note:** Version bump only for package cozy-sharing





## [1.8.3](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.8.2...cozy-sharing@1.8.3) (2020-02-24)

**Note:** Version bump only for package cozy-sharing





## [1.8.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.8.1...cozy-sharing@1.8.2) (2020-02-17)

**Note:** Version bump only for package cozy-sharing





## [1.8.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.8.0...cozy-sharing@1.8.1) (2020-02-17)

**Note:** Version bump only for package cozy-sharing





# [1.8.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.7.0...cozy-sharing@1.8.0) (2020-01-28)


### Features

* Add RefreshableSharings to expose a way to refresh sharings ([6afd92f](https://github.com/cozy/cozy-libs/commit/6afd92f))





# [1.7.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.6.2...cozy-sharing@1.7.0) (2020-01-27)


### Bug Fixes

* Better alignment for the display status ([a4b9c3b](https://github.com/cozy/cozy-libs/commit/a4b9c3b))
* Since we have a bug in the Stack, don't manipulate trashed files ([9e04ffc](https://github.com/cozy/cozy-libs/commit/9e04ffc))


### Features

* Add a onFileDelete method to refresh the Provider ([98e921e](https://github.com/cozy/cozy-libs/commit/98e921e))
* Add a tooltip on the LinkIcon and set the right color ([8a6d998](https://github.com/cozy/cozy-libs/commit/8a6d998))





## [1.6.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.6.1...cozy-sharing@1.6.2) (2020-01-21)

**Note:** Version bump only for package cozy-sharing





## [1.6.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.6.0...cozy-sharing@1.6.1) (2020-01-20)


### Bug Fixes

* Use minilog cozy fork ([6f815ed](https://github.com/cozy/cozy-libs/commit/6f815ed))





# [1.6.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.5.5...cozy-sharing@1.6.0) (2020-01-17)


### Bug Fixes

* Fix issue with svg loader ([753a066](https://github.com/cozy/cozy-libs/commit/753a066))
* Uniq key name ([bbc1a0b](https://github.com/cozy/cozy-libs/commit/bbc1a0b))


### Features

* Add a prop to tell if the request has been done at least one. ([a8c66d2](https://github.com/cozy/cozy-libs/commit/a8c66d2))





## [1.5.5](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.5.4...cozy-sharing@1.5.5) (2020-01-17)


### Bug Fixes

* Check active attribute to know if a sharing is still active or not ([b9d5902](https://github.com/cozy/cozy-libs/commit/b9d5902))
* Since shared-by-link is paginated, we need to load other perms ([61fe18f](https://github.com/cozy/cozy-libs/commit/61fe18f))





## [1.5.4](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.5.3...cozy-sharing@1.5.4) (2020-01-10)

**Note:** Version bump only for package cozy-sharing





## [1.5.3](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.5.2...cozy-sharing@1.5.3) (2020-01-03)

**Note:** Version bump only for package cozy-sharing





## [1.5.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.5.1...cozy-sharing@1.5.2) (2020-01-03)


### Bug Fixes

* Sharing has sideeffect on css files ([cc6eff9](https://github.com/cozy/cozy-libs/commit/cc6eff9))





## [1.5.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.5.0...cozy-sharing@1.5.1) (2020-01-02)

**Note:** Version bump only for package cozy-sharing





# [1.5.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.4.0...cozy-sharing@1.5.0) (2019-12-23)


### Features

* Export withLocales from cozy-sharing ([c727aa3](https://github.com/cozy/cozy-libs/commit/c727aa3))





# [1.4.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.3.2...cozy-sharing@1.4.0) (2019-12-18)


### Bug Fixes

* **cozy-sharing:** Patch is necessary for cozy-notes ([46c6ffc](https://github.com/cozy/cozy-libs/commit/46c6ffc))


### Features

* **cozy-sharing:** Updates cozy-client peer dep ([d872c6f](https://github.com/cozy/cozy-libs/commit/d872c6f))





## [1.3.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.3.1...cozy-sharing@1.3.2) (2019-12-18)


### Bug Fixes

* Translation key for notes ([baa8942](https://github.com/cozy/cozy-libs/commit/baa8942))





## [1.3.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.3.0...cozy-sharing@1.3.1) (2019-12-18)

**Note:** Version bump only for package cozy-sharing





# [1.3.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.2.0...cozy-sharing@1.3.0) (2019-12-18)


### Bug Fixes

* **cozy-sharing:** URL for notes public link ([b065d43](https://github.com/cozy/cozy-libs/commit/b065d43))


### Features

* **cozy-sharing:** Allows notes to be edited through a public link ([300e88d](https://github.com/cozy/cozy-libs/commit/300e88d))





# [1.2.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.1.0...cozy-sharing@1.2.0) (2019-12-18)


### Features

* URL polyfill is useless ([c574e76](https://github.com/cozy/cozy-libs/commit/c574e76))





# 1.1.0 (2019-12-16)


### Features

* Rebase cozy-sharing in cozy-libs ([#873](https://github.com/cozy/cozy-libs/issues/873)) ([1aa8a50](https://github.com/cozy/cozy-libs/commit/1aa8a50))
