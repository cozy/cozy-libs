# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.16.0](https://github.com/cozy/cozy-libs/compare/cozy-external-bridge@0.15.1...cozy-external-bridge@0.16.0) (2025-06-30)

### Features

- Expose notification API ([f19578c](https://github.com/cozy/cozy-libs/commit/f19578caccc443eb87a7c397d8f5fa8c701adff2))

## [0.15.1](https://github.com/cozy/cozy-libs/compare/cozy-external-bridge@0.15.0...cozy-external-bridge@0.15.1) (2025-06-13)

### Bug Fixes

- Upload empty Docs file ([dff8161](https://github.com/cozy/cozy-libs/commit/dff81613c93655891b33df5e3d666f7bf93a99f9))

# [0.15.0](https://github.com/cozy/cozy-libs/compare/cozy-external-bridge@0.14.0...cozy-external-bridge@0.15.0) (2025-06-13)

### Features

- Use specific extension for Docs notes ([38796e8](https://github.com/cozy/cozy-libs/commit/38796e872e2820147713b457eac38eea22f51429))

# [0.14.0](https://github.com/cozy/cozy-libs/compare/cozy-external-bridge@0.13.0...cozy-external-bridge@0.14.0) (2025-06-03)

### Features

- **cozy-external-bridge:** Update file name ([a4e2829](https://github.com/cozy/cozy-libs/commit/a4e2829d144cca92487eaebb0623d6c4f35ec698))

# [0.13.0](https://github.com/cozy/cozy-libs/compare/cozy-external-bridge@0.12.2...cozy-external-bridge@0.13.0) (2025-06-03)

### Features

- **cozy-external-bridge:** Add search ([4fcba27](https://github.com/cozy/cozy-libs/commit/4fcba27bd7ca08d8b464e2ea10d14647c8771ca5))

## [0.12.2](https://github.com/cozy/cozy-libs/compare/cozy-external-bridge@0.12.1...cozy-external-bridge@0.12.2) (2025-06-03)

### Bug Fixes

- Do not execute multiple times bridge methods ([8865ea6](https://github.com/cozy/cozy-libs/commit/8865ea6c0f6c660525c64e4f0cee0cb96f50f504))

## [0.12.1](https://github.com/cozy/cozy-libs/compare/cozy-external-bridge@0.12.0...cozy-external-bridge@0.12.1) (2025-06-03)

### Bug Fixes

- Docs update ([e3f0bcd](https://github.com/cozy/cozy-libs/commit/e3f0bcd95c81b8e1a59946998b898e2d48280fd4))

# [0.12.0](https://github.com/cozy/cozy-libs/compare/cozy-external-bridge@0.11.0...cozy-external-bridge@0.12.0) (2025-06-02)

### Features

- **cozy-external-bridge:** Create and update file ([6589057](https://github.com/cozy/cozy-libs/commit/6589057d72a237d64fb99b2ee8f18522acd510ed))

# [0.11.0](https://github.com/cozy/cozy-libs/compare/cozy-external-bridge@0.10.0...cozy-external-bridge@0.11.0) (2025-05-22)

### Bug Fixes

- Redirect on load display blank page ([13684ea](https://github.com/cozy/cozy-libs/commit/13684ea6627586b987f9172cb77f087591f8498d))

### BREAKING CHANGES

- useExternalBridge hook does not redirect
  the iframe automatically if necessaru and returns instead an
  `urlToLoad` url in its return value

# [0.10.0](https://github.com/cozy/cozy-libs/compare/cozy-external-bridge@0.9.0...cozy-external-bridge@0.10.0) (2025-05-22)

### Features

- Add log for useRedirectOnLoad ([9b03927](https://github.com/cozy/cozy-libs/commit/9b03927605fba958078e1dfa8a1b9193223acb4b))
- Return boolean if bridge is ready ([7e1bf42](https://github.com/cozy/cozy-libs/commit/7e1bf42f9a12b0ec0519ce31817e5515d2e031cb))

# [0.9.0](https://github.com/cozy/cozy-libs/compare/cozy-external-bridge@0.8.0...cozy-external-bridge@0.9.0) (2025-05-14)

### Features

- **cozy-external-bridge:** Add a bridge route prefix ([ac9d66d](https://github.com/cozy/cozy-libs/commit/ac9d66d0f788d96b61afdbfa2532835d3c7a924f))
- **cozy-external-bridge:** Use Minilog for container app logs ([88302a6](https://github.com/cozy/cozy-libs/commit/88302a6b97ed31220e6e80f70e6c8cbc8308623b))

### BREAKING CHANGES

- **cozy-external-bridge:** You now need to install cozy-minilog >=3.10.0
  to use cozy-external-bridge

# [0.8.0](https://github.com/cozy/cozy-libs/compare/cozy-external-bridge@0.7.0...cozy-external-bridge@0.8.0) (2025-04-10)

### Features

- **ExternalBridge:** Add new accepted domain ([e77f6c3](https://github.com/cozy/cozy-libs/commit/e77f6c3b56154ccd18956f27a6d41ccec18fa410))

# [0.7.0](https://github.com/cozy/cozy-libs/compare/cozy-external-bridge@0.6.0...cozy-external-bridge@0.7.0) (2025-04-03)

### Bug Fixes

- Extra space in package.json blocks CI ([a26658a](https://github.com/cozy/cozy-libs/commit/a26658aba3d6dc063bd80360f3dbdd926bc33a3c))

### Features

- Use parent origin instead of document.referrer ([ed218c3](https://github.com/cozy/cozy-libs/commit/ed218c393921d4528af8371899bc4ba71fa4b594))

# [0.6.0](https://github.com/cozy/cozy-libs/compare/cozy-external-bridge@0.5.0...cozy-external-bridge@0.6.0) (2025-03-27)

### Features

- Add a setupBridge method ([5bb0b88](https://github.com/cozy/cozy-libs/commit/5bb0b88b1b16e3a6f8f6952b0acef32c02d85264))

# [0.5.0](https://github.com/cozy/cozy-libs/compare/cozy-external-bridge@0.4.0...cozy-external-bridge@0.5.0) (2025-03-21)

### Features

- Add more temporary dev exception ([3c9ea5d](https://github.com/cozy/cozy-libs/commit/3c9ea5db74ef773a357eedd25d0650373ee3e669))

# [0.4.0](https://github.com/cozy/cozy-libs/compare/cozy-external-bridge@0.3.0...cozy-external-bridge@0.4.0) (2025-03-17)

### Features

- Add temporary dev exception ([1083a44](https://github.com/cozy/cozy-libs/commit/1083a4499ec87dbb6ace83202fe347d977d648d7))

# [0.3.0](https://github.com/cozy/cozy-libs/compare/cozy-external-bridge@0.2.1...cozy-external-bridge@0.3.0) (2025-03-13)

### Features

- Add temporary dev exception ([f04e1cf](https://github.com/cozy/cozy-libs/commit/f04e1cf707b69659db51cd45158343ca1a0ad2ec))
- Expose getFlag ([7e710d3](https://github.com/cozy/cozy-libs/commit/7e710d3c8ce0acb2f75db3a4f9a88c0c7bfdd5f3))
- Log getContacts and getFlag results ([297d5d0](https://github.com/cozy/cozy-libs/commit/297d5d0d2a8152938eb22d5984f4a59b2d69470c))
- Move exposed methods in an object ([729a3de](https://github.com/cozy/cozy-libs/commit/729a3dec5a58f415527c67ae6da956c96d325cfd))

## [0.2.1](https://github.com/cozy/cozy-libs/compare/cozy-external-bridge@0.2.0...cozy-external-bridge@0.2.1) (2025-03-11)

### Bug Fixes

- Do not redirect at init if we are at root url ([6f6156c](https://github.com/cozy/cozy-libs/commit/6f6156cfca6f61ceb7077b43400ef2591357aec2))

# [0.2.0](https://github.com/cozy/cozy-libs/compare/cozy-external-bridge@0.1.0...cozy-external-bridge@0.2.0) (2025-03-11)

### Features

- Start history syncing automatically ([e0d68c0](https://github.com/cozy/cozy-libs/commit/e0d68c07a3b5d9f2f88e9de339540d5a9a03dd71))

# 0.1.0 (2025-03-11)

### Features

- Add a simple cozy-external-bridge lib ([205611e](https://github.com/cozy/cozy-libs/commit/205611e676258000615de78455a6990d0425c9ae))
