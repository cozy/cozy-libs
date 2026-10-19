# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [36.2.3](https://github.com/cozy/cozy-libs/compare/cozy-bar@36.2.2...cozy-bar@36.2.3) (2026-10-19)

**Note:** Version bump only for package cozy-bar

## [36.2.2](https://github.com/cozy/cozy-libs/compare/cozy-bar@36.2.1...cozy-bar@36.2.2) (2026-10-12)

**Note:** Version bump only for package cozy-bar

## [36.2.1](https://github.com/cozy/cozy-libs/compare/cozy-bar@36.2.0...cozy-bar@36.2.1) (2026-10-08)

**Note:** Version bump only for package cozy-bar

# [36.2.0](https://github.com/cozy/cozy-libs/compare/cozy-bar@36.1.4...cozy-bar@36.2.0) (2026-10-06)

### Bug Fixes

- **cozy-bar:** Bundle the Spanish dates in the standalone bar ([bc2d622](https://github.com/cozy/cozy-libs/commit/bc2d6225c8bfcf219a9e72ae04074dbb62841a3d))
- **cozy-bar:** Keep the home button width while its icon loads ([d123448](https://github.com/cozy/cozy-libs/commit/d123448432a52ed98cde006954277389ff842193))
- **cozy-bar:** Load the home icon once instead of on every render ([53d82af](https://github.com/cozy/cozy-libs/commit/53d82afc997a819c654d6ceae9973ebc8a0caf11))
- **cozy-bar:** Read the theme variables of adjacent CSS rules ([b84c4f1](https://github.com/cozy/cozy-libs/commit/b84c4f1a0d77473a6e3aeb52a345445647dc9da9))
- **cozy-bar:** Watch the library build again ([533b03c](https://github.com/cozy/cozy-libs/commit/533b03cdc8c02ab850513808bc71025b4192075a))

### Features

- **cozy-bar:** Accept app icons as URLs in BarLeft ([986188b](https://github.com/cozy/cozy-libs/commit/986188b3f87219c4342e69fda9759b2f824a67b9))
- **cozy-bar:** Add standalone bar bundle exposing window.TwakeBar ([6523f74](https://github.com/cozy/cozy-libs/commit/6523f7457952a3859371f8beb58636f2141c0f47))
- **cozy-bar:** Exchange the id token in the standalone bar ([683b06a](https://github.com/cozy/cozy-libs/commit/683b06a4ed796962a019625badef30fd9d19ccbb))
- **cozy-bar:** Return a promise from every standalone bar call ([415d3f0](https://github.com/cozy/cozy-libs/commit/415d3f0340e14278e2f9ce0a64906026dd81a0a1))

## [36.1.4](https://github.com/cozy/cozy-libs/compare/cozy-bar@36.1.3...cozy-bar@36.1.4) (2026-10-06)

**Note:** Version bump only for package cozy-bar

## [36.1.3](https://github.com/cozy/cozy-libs/compare/cozy-bar@36.1.2...cozy-bar@36.1.3) (2026-10-06)

**Note:** Version bump only for package cozy-bar

## [36.1.2](https://github.com/cozy/cozy-libs/compare/cozy-bar@36.1.1...cozy-bar@36.1.2) (2026-10-06)

**Note:** Version bump only for package cozy-bar

## [36.1.1](https://github.com/cozy/cozy-libs/compare/cozy-bar@36.1.0...cozy-bar@36.1.1) (2026-10-06)

**Note:** Version bump only for package cozy-bar

# [36.1.0](https://github.com/cozy/cozy-libs/compare/cozy-bar@36.0.8...cozy-bar@36.1.0) (2026-10-06)

### Features

- **cozy-bar:** Add Spanish, German and Italian locales ([3307d77](https://github.com/cozy/cozy-libs/commit/3307d77164f3ce148207fdb40adecff74ce37a58))

## [36.0.8](https://github.com/cozy/cozy-libs/compare/cozy-bar@36.0.7...cozy-bar@36.0.8) (2026-10-06)

**Note:** Version bump only for package cozy-bar

## [36.0.7](https://github.com/cozy/cozy-libs/compare/cozy-bar@36.0.6...cozy-bar@36.0.7) (2026-10-06)

**Note:** Version bump only for package cozy-bar

## [36.0.6](https://github.com/cozy/cozy-libs/compare/cozy-bar@36.0.5...cozy-bar@36.0.6) (2026-10-05)

**Note:** Version bump only for package cozy-bar

## [36.0.5](https://github.com/cozy/cozy-libs/compare/cozy-bar@36.0.4...cozy-bar@36.0.5) (2026-10-05)

**Note:** Version bump only for package cozy-bar

## [36.0.4](https://github.com/cozy/cozy-libs/compare/cozy-bar@36.0.3...cozy-bar@36.0.4) (2026-10-05)

### Bug Fixes

- **cozy-bar:** Remove lodash.set ([1805102](https://github.com/cozy/cozy-libs/commit/18051028e511f6002edda102fae62bfa5daaaf2b))

## [36.0.3](https://github.com/cozy/cozy-libs/compare/cozy-bar@36.0.2...cozy-bar@36.0.3) (2026-10-04)

**Note:** Version bump only for package cozy-bar

## [36.0.2](https://github.com/cozy/cozy-libs/compare/cozy-bar@36.0.1...cozy-bar@36.0.2) (2026-10-02)

**Note:** Version bump only for package cozy-bar

## [36.0.1](https://github.com/cozy/cozy-libs/compare/cozy-bar@36.0.0...cozy-bar@36.0.1) (2026-10-02)

**Note:** Version bump only for package cozy-bar

# [36.0.0](https://github.com/cozy/cozy-libs/compare/cozy-bar@35.5.0...cozy-bar@36.0.0) (2026-10-01)

- feat(cozy-bar)!: Let the app decide when to hide the home button ([ef22c28](https://github.com/cozy/cozy-libs/commit/ef22c288d1f96e8a77693e5882984b6490150263))

### BREAKING CHANGES

- the home button and its divider are no longer hidden
  when the app slug is `home`. The home app must now pass
  `componentsProps={{ BarLeft: { noCozyHome: true } }}` where it wants
  them hidden.

# [35.5.0](https://github.com/cozy/cozy-libs/compare/cozy-bar@35.4.13...cozy-bar@35.5.0) (2026-10-01)

### Features

- **cozy-bar:** Forward componentsProps.BarSearch to search bar ([c0c0c4b](https://github.com/cozy/cozy-libs/commit/c0c0c4b0fa7e77605f8237b3346b6b9c1c5c49f4))

## [35.4.13](https://github.com/cozy/cozy-libs/compare/cozy-bar@35.4.12...cozy-bar@35.4.13) (2026-10-01)

**Note:** Version bump only for package cozy-bar

## [35.4.12](https://github.com/cozy/cozy-libs/compare/cozy-bar@35.4.11...cozy-bar@35.4.12) (2026-09-30)

**Note:** Version bump only for package cozy-bar

## [35.4.11](https://github.com/cozy/cozy-libs/compare/cozy-bar@35.4.10...cozy-bar@35.4.11) (2026-09-30)

**Note:** Version bump only for package cozy-bar

## [35.4.10](https://github.com/cozy/cozy-libs/compare/cozy-bar@35.4.9...cozy-bar@35.4.10) (2026-09-23)

**Note:** Version bump only for package cozy-bar

## [35.4.9](https://github.com/cozy/cozy-libs/compare/cozy-bar@35.4.8...cozy-bar@35.4.9) (2026-09-23)

**Note:** Version bump only for package cozy-bar

## [35.4.8](https://github.com/cozy/cozy-libs/compare/cozy-bar@35.4.7...cozy-bar@35.4.8) (2026-09-22)

### Bug Fixes

- **cozy-bar:** Give platform banners the theme background ([970669b](https://github.com/cozy/cozy-libs/commit/970669bfd8122e56998ba469ef9e41c53bff0012))

## [35.4.7](https://github.com/cozy/cozy-libs/compare/cozy-bar@35.4.6...cozy-bar@35.4.7) (2026-09-22)

### Bug Fixes

- **cozy-bar:** Use uniform platform banner padding ([ab33906](https://github.com/cozy/cozy-libs/commit/ab33906b687e1c84a3395cd6652b9f5ba5000031))

## [35.4.6](https://github.com/cozy/cozy-libs/compare/cozy-bar@35.4.5...cozy-bar@35.4.6) (2026-09-21)

**Note:** Version bump only for package cozy-bar

## [35.4.5](https://github.com/cozy/cozy-libs/compare/cozy-bar@35.4.4...cozy-bar@35.4.5) (2026-09-16)

**Note:** Version bump only for package cozy-bar

## [35.4.4](https://github.com/cozy/cozy-libs/compare/cozy-bar@35.4.3...cozy-bar@35.4.4) (2026-09-16)

**Note:** Version bump only for package cozy-bar

## [35.4.3](https://github.com/cozy/cozy-libs/compare/cozy-bar@35.4.2...cozy-bar@35.4.3) (2026-09-15)

**Note:** Version bump only for package cozy-bar

## [35.4.2](https://github.com/cozy/cozy-libs/compare/cozy-bar@35.4.1...cozy-bar@35.4.2) (2026-09-14)

**Note:** Version bump only for package cozy-bar

## [35.4.1](https://github.com/cozy/cozy-libs/compare/cozy-bar@35.4.0...cozy-bar@35.4.1) (2026-09-10)

**Note:** Version bump only for package cozy-bar

# [35.4.0](https://github.com/cozy/cozy-libs/compare/cozy-bar@35.3.2...cozy-bar@35.4.0) (2026-09-08)

### Features

- **cozy-bar:** Update the platform banners over realtime ([c7ca124](https://github.com/cozy/cozy-libs/commit/c7ca12444df65d63a2b45667f8ef823448d67f7a))

## [35.3.2](https://github.com/cozy/cozy-libs/compare/cozy-bar@35.3.1...cozy-bar@35.3.2) (2026-09-07)

**Note:** Version bump only for package cozy-bar

## [35.3.1](https://github.com/cozy/cozy-libs/compare/cozy-bar@35.3.0...cozy-bar@35.3.1) (2026-09-02)

**Note:** Version bump only for package cozy-bar

# [35.3.0](https://github.com/cozy/cozy-libs/compare/cozy-bar@35.2.22...cozy-bar@35.3.0) (2026-09-02)

### Features

- **cozy-bar:** Render the io.cozy.banners platform banners ([981132b](https://github.com/cozy/cozy-libs/commit/981132ba9ef15e6a78b0870be40896cc1e49d702))

## [35.2.22](https://github.com/cozy/cozy-libs/compare/cozy-bar@35.2.21...cozy-bar@35.2.22) (2026-09-01)

**Note:** Version bump only for package cozy-bar

## [35.2.21](https://github.com/cozy/cozy-libs/compare/cozy-bar@35.2.20...cozy-bar@35.2.21) (2026-08-31)

**Note:** Version bump only for package cozy-bar

## [35.2.20](https://github.com/cozy/cozy-libs/compare/cozy-bar@35.2.19...cozy-bar@35.2.20) (2026-08-31)

**Note:** Version bump only for package cozy-bar

## [35.2.19](https://github.com/cozy/cozy-libs/compare/cozy-bar@35.2.18...cozy-bar@35.2.19) (2026-08-26)

**Note:** Version bump only for package cozy-bar

## [35.2.18](https://github.com/cozy/cozy-libs/compare/cozy-bar@35.2.17...cozy-bar@35.2.18) (2026-08-25)

**Note:** Version bump only for package cozy-bar

## [35.2.17](https://github.com/cozy/cozy-libs/compare/cozy-bar@35.2.16...cozy-bar@35.2.17) (2026-08-25)

**Note:** Version bump only for package cozy-bar

## [35.2.16](https://github.com/cozy/cozy-libs/compare/cozy-bar@35.2.15...cozy-bar@35.2.16) (2026-08-25)

**Note:** Version bump only for package cozy-bar

## [35.2.15](https://github.com/cozy/cozy-libs/compare/cozy-bar@35.2.14...cozy-bar@35.2.15) (2026-08-24)

**Note:** Version bump only for package cozy-bar

## [35.2.14](https://github.com/cozy/cozy-libs/compare/cozy-bar@35.2.13...cozy-bar@35.2.14) (2026-07-30)

**Note:** Version bump only for package cozy-bar

## [35.2.13](https://github.com/cozy/cozy-libs/compare/cozy-bar@35.2.12...cozy-bar@35.2.13) (2026-07-30)

**Note:** Version bump only for package cozy-bar

## [35.2.12](https://github.com/cozy/cozy-libs/compare/cozy-bar@35.2.11...cozy-bar@35.2.12) (2026-07-30)

**Note:** Version bump only for package cozy-bar

## [35.2.11](https://github.com/cozy/cozy-libs/compare/cozy-bar@35.2.10...cozy-bar@35.2.11) (2026-07-29)

**Note:** Version bump only for package cozy-bar

## [35.2.10](https://github.com/cozy/cozy-libs/compare/cozy-bar@35.2.9...cozy-bar@35.2.10) (2026-07-29)

**Note:** Version bump only for package cozy-bar

## [35.2.9](https://github.com/cozy/cozy-libs/compare/cozy-bar@35.2.8...cozy-bar@35.2.9) (2026-07-29)

**Note:** Version bump only for package cozy-bar

## [35.2.8](https://github.com/cozy/cozy-libs/compare/cozy-bar@35.2.7...cozy-bar@35.2.8) (2026-07-28)

**Note:** Version bump only for package cozy-bar

## [35.2.7](https://github.com/cozy/cozy-libs/compare/cozy-bar@35.2.6...cozy-bar@35.2.7) (2026-07-28)

**Note:** Version bump only for package cozy-bar

## [35.2.6](https://github.com/cozy/cozy-libs/compare/cozy-bar@35.2.5...cozy-bar@35.2.6) (2026-07-27)

**Note:** Version bump only for package cozy-bar

## [35.2.5](https://github.com/cozy/cozy-libs/compare/cozy-bar@35.2.4...cozy-bar@35.2.5) (2026-07-23)

**Note:** Version bump only for package cozy-bar

## [35.2.4](https://github.com/cozy/cozy-libs/compare/cozy-bar@35.2.3...cozy-bar@35.2.4) (2026-07-22)

**Note:** Version bump only for package cozy-bar

## [35.2.3](https://github.com/cozy/cozy-libs/compare/cozy-bar@35.2.2...cozy-bar@35.2.3) (2026-07-22)

**Note:** Version bump only for package cozy-bar

## [35.2.2](https://github.com/cozy/cozy-libs/compare/cozy-bar@35.2.1...cozy-bar@35.2.2) (2026-07-22)

### Bug Fixes

- Add small padding to user section ([ab72cf8](https://github.com/cozy/cozy-libs/commit/ab72cf8bd4f5c64ffe7e82fe1722d039f6682977))

## [35.2.1](https://github.com/cozy/cozy-libs/compare/cozy-bar@35.2.0...cozy-bar@35.2.1) (2026-07-21)

**Note:** Version bump only for package cozy-bar

# [35.2.0](https://github.com/cozy/cozy-libs/compare/cozy-bar@35.1.9...cozy-bar@35.2.0) (2026-07-21)

### Features

- **cozy-bar:** Add midellipsis on user menu email ([1f26c4a](https://github.com/cozy/cozy-libs/commit/1f26c4a66d2d4bb52631cad8a683649079b4efca))

## [35.1.9](https://github.com/cozy/cozy-libs/compare/cozy-bar@35.1.8...cozy-bar@35.1.9) (2026-07-21)

**Note:** Version bump only for package cozy-bar

## [35.1.8](https://github.com/cozy/cozy-libs/compare/cozy-bar@35.1.7...cozy-bar@35.1.8) (2026-07-21)

**Note:** Version bump only for package cozy-bar

## [35.1.7](https://github.com/cozy/cozy-libs/compare/cozy-bar@35.1.6...cozy-bar@35.1.7) (2026-07-17)

**Note:** Version bump only for package cozy-bar

## [35.1.6](https://github.com/cozy/cozy-libs/compare/cozy-bar@35.1.5...cozy-bar@35.1.6) (2026-07-16)

**Note:** Version bump only for package cozy-bar

## [35.1.5](https://github.com/cozy/cozy-libs/compare/cozy-bar@35.1.4...cozy-bar@35.1.5) (2026-07-16)

**Note:** Version bump only for package cozy-bar

## [35.1.4](https://github.com/cozy/cozy-libs/compare/cozy-bar@35.1.3...cozy-bar@35.1.4) (2026-07-16)

**Note:** Version bump only for package cozy-bar

## [35.1.3](https://github.com/cozy/cozy-libs/compare/cozy-bar@35.1.2...cozy-bar@35.1.3) (2026-07-09)

**Note:** Version bump only for package cozy-bar

## [35.1.2](https://github.com/cozy/cozy-libs/compare/cozy-bar@35.1.1...cozy-bar@35.1.2) (2026-07-09)

**Note:** Version bump only for package cozy-bar

## [35.1.1](https://github.com/cozy/cozy-libs/compare/cozy-bar@35.1.0...cozy-bar@35.1.1) (2026-07-08)

**Note:** Version bump only for package cozy-bar

# [35.1.0](https://github.com/cozy/cozy-libs/compare/cozy-bar@35.0.0...cozy-bar@35.1.0) (2026-07-01)

### Features

- Display all entrypoints ([ff2d416](https://github.com/cozy/cozy-libs/commit/ff2d41695f6c2a78e57a8801dbdde2a6fdc63eb3))

# [35.0.0](https://github.com/cozy/cozy-libs/compare/cozy-bar@34.0.2...cozy-bar@35.0.0) (2026-06-25)

### Features

- Ugrade twake-icons in libs and remove test mock ([46178bc](https://github.com/cozy/cozy-libs/commit/46178bcfff73fb8486b6a5209a14e306b497371b))

### BREAKING CHANGES

- You must have `@linagora/twake-icons >=2.6.6`

## [34.0.2](https://github.com/cozy/cozy-libs/compare/cozy-bar@34.0.1...cozy-bar@34.0.2) (2026-06-24)

**Note:** Version bump only for package cozy-bar

## [34.0.1](https://github.com/cozy/cozy-libs/compare/cozy-bar@34.0.0...cozy-bar@34.0.1) (2026-06-24)

**Note:** Version bump only for package cozy-bar

# [34.0.0](https://github.com/cozy/cozy-libs/compare/cozy-bar@33.3.7...cozy-bar@34.0.0) (2026-06-24)

### Features

- **cozy-bar:** Add twake-icons ([f2e9d55](https://github.com/cozy/cozy-libs/commit/f2e9d553faaac7e4ee203b2e8217551cf4ea91b9))

### BREAKING CHANGES

- **cozy-bar:** You must add `@linagora/twake-icons >= 2.6.2`.

## [33.3.7](https://github.com/cozy/cozy-libs/compare/cozy-bar@33.3.6...cozy-bar@33.3.7) (2026-06-22)

**Note:** Version bump only for package cozy-bar

## [33.3.6](https://github.com/cozy/cozy-libs/compare/cozy-bar@33.3.5...cozy-bar@33.3.6) (2026-06-11)

**Note:** Version bump only for package cozy-bar

## [33.3.5](https://github.com/cozy/cozy-libs/compare/cozy-bar@33.3.4...cozy-bar@33.3.5) (2026-06-11)

**Note:** Version bump only for package cozy-bar

## [33.3.4](https://github.com/cozy/cozy-libs/compare/cozy-bar@33.3.3...cozy-bar@33.3.4) (2026-05-26)

### Bug Fixes

- Avoid uncapped home icon size on flagship ([f59dfe5](https://github.com/cozy/cozy-libs/commit/f59dfe5ead6a9175b9adc705884903ba57fbaf80))

## [33.3.3](https://github.com/cozy/cozy-libs/compare/cozy-bar@33.3.2...cozy-bar@33.3.3) (2026-05-18)

### Bug Fixes

- **cozy-bar:** Add ability to force bar theme type ([183a243](https://github.com/cozy/cozy-libs/commit/183a243515081bf9123290c2a7ca2406b9b45bc7))

## [33.3.2](https://github.com/cozy/cozy-libs/compare/cozy-bar@33.3.1...cozy-bar@33.3.2) (2026-05-07)

**Note:** Version bump only for package cozy-bar

## [33.3.1](https://github.com/cozy/cozy-libs/compare/cozy-bar@33.3.0...cozy-bar@33.3.1) (2026-04-22)

**Note:** Version bump only for package cozy-bar

# [33.3.0](https://github.com/cozy/cozy-libs/compare/cozy-bar@33.2.0...cozy-bar@33.3.0) (2026-04-16)

### Bug Fixes

- **cozy-bar:** Use correct local provider for EmailDomainChip ([24f3d2a](https://github.com/cozy/cozy-libs/commit/24f3d2a7010e215cc1dd5c79b6339eb17deeedb0))

### Features

- **cozy-bar:** Use fetch back again to retrieve Home icon from stack ([ff0e32a](https://github.com/cozy/cozy-libs/commit/ff0e32aab45885b9597cbf30f97e411375a82a86))

# [33.2.0](https://github.com/cozy/cozy-libs/compare/cozy-bar@33.1.3...cozy-bar@33.2.0) (2026-04-16)

### Features

- Add `showEmailDomainChip` prop to show/hide this component ([b8a5c53](https://github.com/cozy/cozy-libs/commit/b8a5c53f78b2ed7d08885724a54aabba659548fc))
- Add EmailDomainChip component ([3e7a08e](https://github.com/cozy/cozy-libs/commit/3e7a08e0b45338eb7e96a31f20dc842109e02760))
- Remove unsupported ES locales ([57ac660](https://github.com/cozy/cozy-libs/commit/57ac660b555bc94b45240d9e53c8aa3176c0d573))

## [33.1.3](https://github.com/cozy/cozy-libs/compare/cozy-bar@33.1.2...cozy-bar@33.1.3) (2026-04-07)

**Note:** Version bump only for package cozy-bar

## [33.1.2](https://github.com/cozy/cozy-libs/compare/cozy-bar@33.1.1...cozy-bar@33.1.2) (2026-04-02)

**Note:** Version bump only for package cozy-bar

## [33.1.1](https://github.com/cozy/cozy-libs/compare/cozy-bar@33.1.0...cozy-bar@33.1.1) (2026-04-02)

**Note:** Version bump only for package cozy-bar

# [33.1.0](https://github.com/cozy/cozy-libs/compare/cozy-bar@33.0.1...cozy-bar@33.1.0) (2026-04-01)

### Features

- **cozy-bar:** Add `noCozyHome` prop on BarLeft element ([4bc15d5](https://github.com/cozy/cozy-libs/commit/4bc15d5a05afd91cbb6dfbc7106da94baa0a3b48))
- **cozy-bar:** Remove `isInvertedTheme` prop ([a27dd2f](https://github.com/cozy/cozy-libs/commit/a27dd2f057bb59756d754d5efacb5c21199b8d9a))

## [33.0.1](https://github.com/cozy/cozy-libs/compare/cozy-bar@33.0.0...cozy-bar@33.0.1) (2026-03-27)

**Note:** Version bump only for package cozy-bar

# 33.0.0 (2026-03-26)

### Bug Fixes

- ID mismatch between lookup and creation ([d586c2e](https://github.com/cozy/cozy-libs/commit/d586c2e64e13a8000545d80739de6da8b19fd65c))
- Prevent tabnabbing for shortcuts and entrypoints ([f38e150](https://github.com/cozy/cozy-libs/commit/f38e1505cce5f5780965f705deb1ef55a56e78e5))

### Features

- **cozy-bar:** Add cozy-bar package ([fa654c9](https://github.com/cozy/cozy-libs/commit/fa654c93de10cdae113b509f48cc9491b56d7dc9))
- **cozy-bar:** Remove BarTheme ([6607ff6](https://github.com/cozy/cozy-libs/commit/6607ff6607637d1ccbbec26a7a0a45be9bbf2bb7))
- **cozy-bar:** Remove unused config files ([a356704](https://github.com/cozy/cozy-libs/commit/a356704c826ec1b18285c0ad7546112205cccfe4))
- **cozy-bar:** Remove unused locales ([1eb2a34](https://github.com/cozy/cozy-libs/commit/1eb2a3413a218e53be4637acaa751054633b26eb))
- **cozy-bar:** Remove useless docs folder ([982c287](https://github.com/cozy/cozy-libs/commit/982c287cc9d3f83a81440cda7d4d1618b9b25820))
- **cozy-bar:** Update babel configuration ([f61600f](https://github.com/cozy/cozy-libs/commit/f61600fc7afc9d9a735e96c8d2af19885e3e1d34))
- **cozy-bar:** Update jest configuration ([e32d475](https://github.com/cozy/cozy-libs/commit/e32d47586bf5c76b2e42267e6137d7151d2b6ff9))
- **cozy-bar:** Update package.json ([502ca2e](https://github.com/cozy/cozy-libs/commit/502ca2e21dbf110efc8b78c8412f15563d20c970))

### BREAKING CHANGES

- **cozy-bar:** BarTheme has been removed because theme are not
  supported anymore by cozy-ui. Remove the component.

## v5.0.8 (2018-06-27)

- Fixed Drawer z-index so it goes over Nav

## v5.0.7 (2018-06-25)

- Fixed FOUC issues

## v5.0.6 (2018-06-12)

- Much better swipe UX

## v5.0.5 (2018-06-12)

- Added RTL swipe support for closing the drawer on mobile

## v5.0.4 (2018-05-28)

- Fix typo in GDPR message

## v5.0.3 (2018-05-24)

#### :bug: Bug Fix

- [#207](https://github.com/cozy/cozy-bar/pull/207) Temporary get back editor as name prefix. ([@CPatchane](https://github.com/CPatchane))

## [v5.0.2] (2018-05-23)

#### :rocket: Enhancement

- [#205](https://github.com/cozy/cozy-bar/pull/205) Improve CGU banner. ([@CPatchane](https://github.com/CPatchane))

#### :bug: Bug Fix

- [#206](https://github.com/cozy/cozy-bar/pull/206) Handle missing app icon in apps list. ([@CPatchane](https://github.com/CPatchane))

## [v5.0.1] - 2018-05-21

#### :rocket: Enhancement

- [#204](https://github.com/cozy/cozy-bar/pull/204) fix z-index of menu on ios. ([@ptbrowne](https://github.com/ptbrowne))

## [v5.0.0] - 2018-05-11

### Changed

- **Breaking:** now the bar uses the `name_prefix` from the manifest to display the prefix with the app name instead of using the `editor` property

### Fixed

- Use a spinner in the mobile drawer when fetching apps

## [v4.10.4] - 2018-05-09

### Added

- Add a new banner display for CGU update

### Fixed

- bug about fetching apps in mobile drawer

## [v4.10.3] - 2018-05-07

### Fixed

- Add spinner on apps menu opening

## [v4.10.2] - 2018-04-17

No changes, fixes the previous broken release.

## [v4.10.1] - 2018-04-17

### Fixed

- Fade search bar on blur

## [v4.10.0] - 2018-04-06

### Fixed

- Better handling categories list from manifest (legacy support) ✨

### Removed

- Remove Claudy & Support on mobile 🌬
- Remove coming soon app on mobile 👋

## [v4.9.4] - 2018-03-27

### Fixed

- Hide the search bar on public pages

## [v4.9.3] - 2018-03-14

### Fixed

- Fixed a bug when clearing the search request and starting another one

## [v4.9.2] - 2018-03-13

### Fixed

- Another tweak to search request debouncing

## [v4.9.1] - 2018-03-12

### Changed

- Enable the search bar by default _but only on Cozy Drive_
- Changed the search bar's styling and slight behavior tweak (debounced requests)

## [v4.9.0] - 2018-03-08

### Changed

- Enable search bar by default

### Fixed

- Race conditions in search results

## [v4.8.9] - 2018-02-27

### Fixed

- Added `Object.assign` polyfill for IE 11
- Allow scrolling in the pop menu on firefox

## [v4.8.8] - 2018-02-16

### Fixed

- Hide scrolling bars for the pop menus

## [v4.8.7] - 2018-01-31

### Fixed

- ESC should hide the suggestion list in the search bar

## [v4.8.6] - 2018-01-30

### Changed

- Small UI & behavior changes to the search bar

## [v4.8.5] - 2018-01-22

### Fixed

- Filter correctly coming soon apps if apps already installed

## [v4.8.4] - 2018-01-22

### Fixed

- Get editor name to display it on title

## [v4.8.3] - 2018-01-22

### Added

- Add storage link to storage settings view
- Add coming soon modal description for cozy-store

### Fixed

- Get back coming soon apps in apps list menu
- Improve global keyboard accessibility

## [v4.8.2] - 2018-01-10

### Fixed

- Typo in logout function name

## [v4.8.1] - 2018-01-10

### Fixed

- Force Transifex version to avoid regression

## [v4.8.0] - 2018-01-10

### Removed

- `beta` after app name

## [v4.7.0] - 2018-01-04

### Added

- `onLogOut` option on initialization. If you pass it, it is used instead of original log out mechanism [b836202](https://github.com/cozy/cozy-bar/commit/b8362026453b922dbf46c4436555fe427a26f2a5)

## [v4.6.0] - 2017-12-22

### Added

- Ask permissions for apps if the list of apps can't be fetched [ac7b506](https://github.com/cozy/cozy-bar/commit/ac7b506c86657369808b1f1bf1d8c30e958e2855)

### Fixed

- Fixed support modal [02b774](https://github.com/cozy/cozy-bar/commit/02b774ff26dac85f0c4d7ccb07b0f55c06e63beb)

## [v4.5.5] - 2017-12-12

### Added

- Documentation of cozy bar customization API [c0d08bf](https://github.com/cozy/cozy-bar/commit/c0d08bf7796dfe79b328fbac8ab51760bbe5d775)
- Persiste state on mobile with localForage [1d03fb2](https://github.com/cozy/cozy-bar/commit/1d03fb2f42228429e689567c88f9ebba8756515c)
- Add function to update accessToken [7e523a7](https://github.com/cozy/cozy-bar/commit/7e523a714e956f76b9dfb48ac76965bc233c2758)
- Save apps on redux store [6037eb7](https://github.com/cozy/cozy-bar/commit/6037eb74d645433e78986b5ecf9aa38b719a49e7)
- chore: Add bundlesize script to monitor build size 🔧 [a9b95f1](https://github.com/cozy/cozy-bar/commit/a9b95f101446171cbce310413e38c725cf9d9ead)
- feat: Remove own app on mobile AppsList [1692363](https://github.com/cozy/cozy-bar/commit/16923634c5e0affe46e3267f8f75724d6e893225)

### Fixed

- Upgrade cozy-ui 🚀 [969a41c](https://github.com/cozy/cozy-bar/commit/969a41c7add89df22138b0a4539159bbc924a10b), [ecee45c](https://github.com/cozy/cozy-bar/commit/ecee45c9166f7368579555b5a939f1a3f5b73790)
- Display default icon when app don't have one [a63e08c](https://github.com/cozy/cozy-bar/commit/a63e08c278fb6a41ae229e4d7f5fc63b1c2aba3c)
- If context is not present on stack don't ask again [20e7e43](https://github.com/cozy/cozy-bar/commit/20e7e43e5ed649b3bd7c14c3e82d7c157f250681)

## [v4.5.4] - 2017-12-03

### Fixed

- Prevent `getLocale` returning the full store state

## [v4.5.3] - 2017-11-29

### Changed

- Storage computing in bytes ✏️
- Use I18n from cozy-ui

## [v4.5.2] - 2017-11-23

### Added

- Add an icon in search results :framed_picture:

### Changed

- Get back `Beta` status

## [v4.5.1] - 2017-11-22

### Fixed

- Bar elements position on mobile :ambulance:

## [v4.5.0] - 2017-11-21

### Fixed

- Claudy drawer positin on mobile
- Hide app drawer button on mobile if the option is enabled

### Added

- Better UI for the search bar

### Changed

- Removed beta tag \o/
- Added a warning : the `displayOnMobile` default value will be changed to `true` in an upcoming version.

## [v4.4.0] - 2017-11-13

### Fixed

- remove isRequired property for I18n props
- fix problems with Claudy

### Added

- Highlight matching texts in search results

## [v4.3.7] - 2017-11-08

### Fixed

- Remove a typo causing a bug in the search bar component :ambulance: [[390ff7b]](https://github.com/cozy/cozy-bar/commit/390ff7bb34f5d0aa082bcf10acf65a1205ba69ce)

## [v4.3.6] - 2017-11-08

### Changed

- styl: Remove unnecessary space on mobile application :art: [[bbea1bd]](https://github.com/cozy/cozy-bar/commit/bbea1bd44b768883784dd81f2bfeb0f1e241f841)
- lint: fix lint issues + add config file using eslint-config-cozy-app :rotating_light: [[587ae08]](https://github.com/cozy/cozy-bar/commit/587ae08a9773830e2559054c577cc7cf518e55ee)
- fix: use data-tutorial attribute for buttons targeted by app tutorials :art: [[564d7b8]](https://github.com/cozy/cozy-bar/commit/564d7b8b97f2625a1b3a1a9eaa16086cd06c7901)
- chore: use eslint for linting (cozy-app standard config) :rotating_light: [[d688455]](https://github.com/cozy/cozy-bar/commit/d688455d219e0f2bffa63f7232a23576203c69bb)
- styl: reduce item size in apps lists :lipstick: [[af83f45]](https://github.com/cozy/cozy-bar/commit/af83f45f3040f7426b606d710b1d03354a17b202)

## [v4.3.5] - 2017-11-3

### Fixed

- Uncaught error on Safari mobile caused blank screens

## [v4.3.4] - 2017-11-2

### Fixed

- Drawer can be opened on mobile
- Languages are working again

## [v4.3.3] - 2017-10-31

### Added

- API to set content of the Bar (setBar{Right,Left,Center} and <Bar{Left,Right, Center} />)

v4.3.0, v4.3.2, v4.3.3 are only there because of build problems on Travis.

### Removed

- none yet

## [v4.2.6] - 2017-10-25

### Add

- Add ability to display on mobile
- Expose a new method `setLocale` to change the bar locale without reloading the app page

### Changed

- Update intents library
- Remove useless then() for support intent
- Remove some unused styles
- Update dependencies
- Change `Apps` button icon

## [v4.2.5] - 2017-10-04

### Added

- Modal allowing to send email to support when click on "Help" link

## [v4.2.4] - 2017-09-26

### Fixed

- Re-instaured spacer between the app title and navigation icons

## [v4.2.3] - 2017-09-26

### Fixed

- Fucked up the previous release

## [v4.2.2] - 2017-09-26

### Fixed

- Temporarily disable the searchbar

## [v4.2.1] - 2017-09-21

### Fixed

- Prevent the search bar from taking up too much space

## [v4.2.0] - 2017-09-19

### Changed

- Updated cozy-client-js

### Added

- Added the search bar

## [v4.1.4] - 2017-08-08

### Changed

- Update intent lib according to new cozy-client-js update to handle `resizeClient()` css transition
- Better handling Claudy active status (desktop version)

## [v4.1.3] - 2017-07-26

### Fixed

- Bug about coming soon apps filtering

## [v4.1.2] - 2017-07-24

### Changed

- Better claudy loading CSS animation

### Removed

- Some now unused tx locales

## [v4.1.1] - 2017-07-21

### Fixed

- Do not hijack click outside the nav for react apps

## [v4.1.0] - 2017-07-21

### Changed

- Now the Claudy menu is displayed as an intent using a `cozy-settings` service.

## [v4.0.2] - 2017-07-12

### Fixed

- Apps are now opened in the same tab

## [v4.0.1] - 2017-07-11

### Fixed

- Fix `__SERVER__ is not defined` error

## [v4.0.0] - 2017-07-10

### Changed

- Rewrited entirely using preact/preact-compat with JSX components
- Better popups and drawer displaying/hidding transition

### Fixed

- Bug about displaying blue spinner at apps/settings loading
- Bug about duplicated items in settings menu

### Added

- Dependencies due to Preact usage

### Removed

- SvelteJS usage and dependency
- Some now unused dependencies

## [v3.2.2] - 2017-07-06

### Fixed

- filter coming soon app

## [v3.2.1] - 2017-07-06 [YANKED]

### Fixed

- filter coming soon app

## [v3.2.0] - 2017-07-05

### Changed

- Help link is now fetched from stack context

### Fixed

- Avoid apps being displayed twice

## [v3.1.1] - 2017-06-27

### Fixed

- Force claudy to rerender when the locale changes
- Fix bug about others apps category not alwayes at the end of the list
- Don't allow to close the drawer when Claudy is opened
- Fix bug when app detection for Claudy app links

### Added

- Piwik environment variables for production build

## [v3.1.0] - 2017-06-26

### Changed

- The 'others' apps category will always be displayed at the end of the apps list

### Fixed

- Long app name are correctly handled using ellipsis in the apps list of the desktop view

### Added

- Claudy: a list of actions available for the Cozy and suggested to the user (according the Cozy context setting), in desktop and mobile views

## [v3.0.1] - 2017-06-23

### Fixed

- Fixed wrong path for Cozy Store icon

## [v3.0.0] - 2017-06-20

### Changed

- Support link href

[Unreleased]: https://github.com/cozy/cozy-bar/compare/v4.10.4...HEAD
[v4.10.4]: https://github.com/cozy/cozy-bar/compare/v4.10.3...v4.10.4
[v4.10.3]: https://github.com/cozy/cozy-bar/compare/v4.10.2...v4.10.3
[v4.10.2]: https://github.com/cozy/cozy-bar/compare/v4.10.1...v4.10.2
[v4.10.1]: https://github.com/cozy/cozy-bar/compare/v4.10.0...v4.10.1
[v4.10.0]: https://github.com/cozy/cozy-bar/compare/v4.9.4...v4.10.0
[v4.9.4]: https://github.com/cozy/cozy-bar/compare/v4.9.3...v4.9.4
[v4.9.3]: https://github.com/cozy/cozy-bar/compare/v4.9.2...v4.9.3
[v4.9.2]: https://github.com/cozy/cozy-bar/compare/v4.9.1...v4.9.2
[v4.9.1]: https://github.com/cozy/cozy-bar/compare/v4.9.0...v4.9.1
[v4.9.0]: https://github.com/cozy/cozy-bar/compare/v4.8.9...v4.9.0
[v4.8.9]: https://github.com/cozy/cozy-bar/compare/v4.8.8...v4.8.9
[v4.8.8]: https://github.com/cozy/cozy-bar/compare/v4.8.7...v4.8.8
[v4.8.7]: https://github.com/cozy/cozy-bar/compare/v4.8.6...v4.8.7
[v4.8.6]: https://github.com/cozy/cozy-bar/compare/v4.8.5...v4.8.6
[v4.8.5]: https://github.com/cozy/cozy-bar/compare/v4.8.4...v4.8.5
[v4.8.4]: https://github.com/cozy/cozy-bar/compare/v4.8.3...v4.8.4
[v4.8.3]: https://github.com/cozy/cozy-bar/compare/v4.8.2...v4.8.3
[v4.8.1]: https://github.com/cozy/cozy-bar/compare/v4.8.1...v4.8.2
[v4.8.1]: https://github.com/cozy/cozy-bar/compare/v4.8.0...v4.8.1
[v4.8.0]: https://github.com/cozy/cozy-bar/compare/v4.7.0...v4.8.0
[v4.7.0]: https://github.com/cozy/cozy-bar/compare/v4.6.0...v4.7.0
[v4.6.0]: https://github.com/cozy/cozy-bar/compare/v4.5.5...v4.6.0
[v4.5.4]: https://github.com/cozy/cozy-bar/compare/v4.5.4...v4.5.5
[v4.5.4]: https://github.com/cozy/cozy-bar/compare/v4.5.3...v4.5.4
[v4.5.3]: https://github.com/cozy/cozy-bar/compare/v4.5.2...v4.5.3
[v4.5.2]: https://github.com/cozy/cozy-bar/compare/v4.5.1...v4.5.2
[v4.5.0]: https://github.com/cozy/cozy-bar/compare/v4.4.0...v4.5.0
[v4.4.0]: https://github.com/cozy/cozy-bar/compare/v4.3.7...v4.4.0
[v4.3.7]: https://github.com/cozy/cozy-bar/compare/v4.3.6...v4.3.7
[v4.3.6]: https://github.com/cozy/cozy-bar/compare/v4.3.5...v4.3.6
[v4.3.5]: https://github.com/cozy/cozy-bar/compare/v4.3.4...v4.3.5
[v4.3.4]: https://github.com/cozy/cozy-bar/compare/v4.3.3...v4.3.4
[v4.3.3]: https://github.com/cozy/cozy-bar/compare/v4.2.6...v4.3.3
[v4.2.6]: https://github.com/cozy/cozy-bar/compare/v4.2.5...v4.2.6
[v4.2.5]: https://github.com/cozy/cozy-bar/compare/v4.2.4...v4.2.5
[v4.2.4]: https://github.com/cozy/cozy-bar/compare/v4.2.3...v4.2.4
[v4.2.3]: https://github.com/cozy/cozy-bar/compare/v4.2.2...v4.2.3
[v4.2.2]: https://github.com/cozy/cozy-bar/compare/v4.2.1...v4.2.2
[v4.2.1]: https://github.com/cozy/cozy-bar/compare/v4.2.0...v4.2.1
[v4.2.0]: https://github.com/cozy/cozy-bar/compare/v4.1.4...v4.2.0
[v4.1.4]: https://github.com/cozy/cozy-bar/compare/v4.1.3...v4.1.4
[v4.1.3]: https://github.com/cozy/cozy-bar/compare/v4.1.2...v4.1.3
[v4.1.2]: https://github.com/cozy/cozy-bar/compare/v4.1.1...v4.1.2
[v4.1.1]: https://github.com/cozy/cozy-bar/compare/v4.1.0...v4.1.1
[v4.1.0]: https://github.com/cozy/cozy-bar/compare/v4.0.2...v4.1.0
[v4.0.2]: https://github.com/cozy/cozy-bar/compare/v4.0.1...v4.0.2
[v4.0.1]: https://github.com/cozy/cozy-bar/compare/v4.0.0...v4.0.1
[v4.0.0]: https://github.com/cozy/cozy-bar/compare/v3.2.1...v4.0.0
[v3.2.1]: https://github.com/cozy/cozy-bar/compare/v3.2.0...v3.2.1
[v3.2.0]: https://github.com/cozy/cozy-bar/compare/v3.1.1...v3.2.0
[v3.1.1]: https://github.com/cozy/cozy-bar/compare/v3.1.0...v3.1.1
[v3.1.0]: https://github.com/cozy/cozy-bar/compare/v3.0.1...v3.1.0
[v3.0.1]: https://github.com/cozy/cozy-bar/compare/v3.0.0...v3.0.1
