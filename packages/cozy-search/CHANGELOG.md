# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.6.1](https://github.com/cozy/cozy-libs/compare/cozy-search@0.6.0...cozy-search@0.6.1) (2025-05-16)

### Bug Fixes

- Do not crash on missing myself contact ([c9acd32](https://github.com/cozy/cozy-libs/commit/c9acd325d871e6c3df9d2bf82209d09bc059551b))

# [0.6.0](https://github.com/cozy/cozy-libs/compare/cozy-search@0.5.1...cozy-search@0.6.0) (2025-05-14)

### Bug Fixes

- Display no result even if assistant disabled ([59e8a55](https://github.com/cozy/cozy-libs/commit/59e8a55503ab74fbc448f231ec45eac008eff941))

### Features

- Remove isTwakeTheme from cozy-search ([be40991](https://github.com/cozy/cozy-libs/commit/be409919551c3e78b15bfbc50c4994fa56d2922c))

## [0.5.1](https://github.com/cozy/cozy-libs/compare/cozy-search@0.5.0...cozy-search@0.5.1) (2025-04-16)

### Bug Fixes

- Set correct avatar size ([8ec8788](https://github.com/cozy/cozy-libs/commit/8ec87883250eeadf72b4468b72d7e93354117aa6))

# [0.5.0](https://github.com/cozy/cozy-libs/compare/cozy-search@0.4.0...cozy-search@0.5.0) (2025-04-16)

### Bug Fixes

- ConversationBar end icons were not round ([2a0d33a](https://github.com/cozy/cozy-libs/commit/2a0d33a8c61ac2146cf4dd0268b3bca89b522c4b))
- Use correct size for Avatar ([8745f51](https://github.com/cozy/cozy-libs/commit/8745f5118d0e6a7583bc02658160744984be93c7))

### Features

- Add an AssistantLink ([cf3e0ae](https://github.com/cozy/cozy-libs/commit/cf3e0ae3e1483fba93683f797187af1aca75528e))

# [0.4.0](https://github.com/cozy/cozy-libs/compare/cozy-search@0.3.0...cozy-search@0.4.0) (2025-04-10)

### Features

- **Search:** Add AI assistant in Twake theme ([ba8d70d](https://github.com/cozy/cozy-libs/commit/ba8d70d0e56c502d7e1cba9546094aeecc02d54d))
- **Search:** Allow to disable hover in SearchBarDesktop ([3396e17](https://github.com/cozy/cozy-libs/commit/3396e1787de2b4d2ff37dce5f3f84713c8687247))
- **Search:** Set same color for icon as placeholder in Twake theme ([3c9e9c4](https://github.com/cozy/cozy-libs/commit/3c9e9c4068d3c53651a19e16c83362fe261a3781))
- **Search:** Update mobile search bar in Twake theme ([aee189b](https://github.com/cozy/cozy-libs/commit/aee189bf4e6eb0ce6c9e63585b55c04991438e8a))
- Use primary color for assistant icon ([0514a2f](https://github.com/cozy/cozy-libs/commit/0514a2f757b8f111b65223df6c554a5183ea0e0d))

# [0.3.0](https://github.com/cozy/cozy-libs/compare/cozy-search@0.2.0...cozy-search@0.3.0) (2025-04-04)

### Features

- Allow to pass className in componentsProps.SearchBarDesktop ([52c41f1](https://github.com/cozy/cozy-libs/commit/52c41f1525e3ce89873d67c99f63f3721d407386))
- Update cozy-ui in cozy-search ([88d04a6](https://github.com/cozy/cozy-libs/commit/88d04a676ab76132a388c8a4e424bb92c185098d))

### BREAKING CHANGES

- You need `cozy-ui >= 122.0.0`. AssistantDesktop
  componentsProps.SearchBarDesktop.elevation is now a number instead of
  a bool. Default value is the same.

# [0.2.0](https://github.com/cozy/cozy-libs/compare/cozy-search@0.1.0...cozy-search@0.2.0) (2025-03-27)

### Features

- **Search:** Change search icon depending on theme ([54e2e06](https://github.com/cozy/cozy-libs/commit/54e2e069889e4f889e8e70eccf86aa4b5e0dfdfd))
- **Search:** Upgrade cozy-ui ([1d6fcd0](https://github.com/cozy/cozy-libs/commit/1d6fcd06e25b993c3ab41a7e903941761f030b37))

### BREAKING CHANGES

- **Search:** You must have `cozy-ui >= 121.5.0`

# 0.1.0 (2025-03-14)

### Features

- Create a cozy-search package ([38fb9fa](https://github.com/cozy/cozy-libs/commit/38fb9fa92027769be11987ae4aa1309dfde72358))
