# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.7.1](https://github.com/cozy/cozy-libs/compare/twake-i18n@0.7.0...twake-i18n@0.7.1) (2026-10-12)

### Bug Fixes

- **twake-i18n:** Type the options of t and f ([2bfe5e1](https://github.com/cozy/cozy-libs/commit/2bfe5e13be76780005c2df8ff953ab44ba13b4c4))

# [0.7.0](https://github.com/cozy/cozy-libs/compare/twake-i18n@0.6.1...twake-i18n@0.7.0) (2026-10-06)

### Features

- **twake-i18n:** Add German and Italian date-fns locales ([a21bb10](https://github.com/cozy/cozy-libs/commit/a21bb1055c45cfe5e6ff60ad1693a84ae98dfaa9))

## [0.6.1](https://github.com/cozy/cozy-libs/compare/twake-i18n@0.6.0...twake-i18n@0.6.1) (2026-10-05)

### Bug Fixes

- **twake-i18n:** Import only the date-fns locales in use ([0c92b7c](https://github.com/cozy/cozy-libs/commit/0c92b7caaa429aba1c97230be4f9cc3092b5b293))

# [0.6.0](https://github.com/cozy/cozy-libs/compare/twake-i18n@0.5.0...twake-i18n@0.6.0) (2026-10-04)

### Bug Fixes

- **twake-i18n:** Type I18n return value without global JSX namespace ([6ddc1d5](https://github.com/cozy/cozy-libs/commit/6ddc1d5b81209d4b8f1d1b7515d658b249966c53))

### Features

- **twake-i18n:** Accept React 19 as a peer dependency ([23212d3](https://github.com/cozy/cozy-libs/commit/23212d3c4ef518f062a5b4c47aaa4ad0242069bd))

# [0.5.0](https://github.com/cozy/cozy-libs/compare/twake-i18n@0.4.1...twake-i18n@0.5.0) (2026-09-14)

### Code Refactoring

- Drop usage of deprecated API ([4cd765f](https://github.com/cozy/cozy-libs/commit/4cd765f687bd3c63df8a1cffd9e8142cc842ed67))

### BREAKING CHANGES

- I18n is now a function component and no longer
  provides the legacy React context. Components reading `t`, `f`,
  `polyglot` or `lang` through `contextTypes` must use `useI18n()` or
  `translate()` instead. Code building a translator with `new I18n(...)`
  followed by `getChildContext()` or `getContextValue()` must use
  `getI18n()` instead.

## [0.4.1](https://github.com/cozy/cozy-libs/compare/twake-i18n@0.4.0...twake-i18n@0.4.1) (2026-03-17)

**Note:** Version bump only for package twake-i18n

# [0.4.0](https://github.com/cozy/cozy-libs/compare/twake-i18n@0.3.4...twake-i18n@0.4.0) (2026-03-17)

### Features

- Upgrade Jest to 28 ([b92c56c](https://github.com/cozy/cozy-libs/commit/b92c56ce2fdd65b3dd8e9c5170dc5eb86cc369a7))

## [0.3.4](https://github.com/cozy/cozy-libs/compare/twake-i18n@0.3.3...twake-i18n@0.3.4) (2026-03-16)

### Bug Fixes

- Add ru and vi in twake-i18n formatting helpers ([66bcc84](https://github.com/cozy/cozy-libs/commit/66bcc84b56eae4f65a302775790b6095179f7fe7))

## [0.3.3](https://github.com/cozy/cozy-libs/compare/twake-i18n@0.3.2...twake-i18n@0.3.3) (2026-03-16)

**Note:** Version bump only for package twake-i18n

## [0.3.2](https://github.com/cozy/cozy-libs/compare/twake-i18n@0.3.1...twake-i18n@0.3.2) (2026-03-05)

**Note:** Version bump only for package twake-i18n

## [0.3.1](https://github.com/cozy/cozy-libs/compare/twake-i18n@0.3.0...twake-i18n@0.3.1) (2026-01-29)

**Note:** Version bump only for package twake-i18n

# [0.3.0](https://github.com/cozy/cozy-libs/compare/twake-i18n@0.2.0...twake-i18n@0.3.0) (2025-12-04)

### Features

- **i18n:** Expose more functions ([67afcdc](https://github.com/cozy/cozy-libs/commit/67afcdcc38d8066fbc3e295785f0194c594b770e))

# 0.2.0 (2025-12-04)

### Features

- Create twake-i18n packages ([2ad44b1](https://github.com/cozy/cozy-libs/commit/2ad44b15b23f9e4c2b3836c8f3f32e10b206bf8f))
