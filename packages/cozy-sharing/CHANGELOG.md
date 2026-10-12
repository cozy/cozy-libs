# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [39.0.4](https://github.com/cozy/cozy-libs/compare/cozy-sharing@39.0.3...cozy-sharing@39.0.4) (2026-10-12)

**Note:** Version bump only for package cozy-sharing

## [39.0.3](https://github.com/cozy/cozy-libs/compare/cozy-sharing@39.0.2...cozy-sharing@39.0.3) (2026-10-08)

### Bug Fixes

- **cozy-sharing:** Keep drive members after a recipient changes a role ([13e609c](https://github.com/cozy/cozy-libs/commit/13e609c5edf6b051321d53956b3b5e0b390ce207))
- **cozy-sharing:** Refetch the displayed document after a role change ([5cfb13d](https://github.com/cozy/cozy-libs/commit/5cfb13dd6acf0a2c03a6d9acd2539bb06d5c04a6))

## [39.0.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@39.0.1...cozy-sharing@39.0.2) (2026-10-06)

### Bug Fixes

- **cozy-sharing:** Avoid falling back to driveId for nested sharing ([eac16ad](https://github.com/cozy/cozy-libs/commit/eac16ad94e2eddab74ea0d9b249cb91a05e98ac1))

## [39.0.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@39.0.0...cozy-sharing@39.0.1) (2026-10-06)

**Note:** Version bump only for package cozy-sharing

# [39.0.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@38.2.1...cozy-sharing@39.0.0) (2026-10-06)

### Bug Fixes

- **cozy-sharing:** Expose duplicate-invite errors at Share.errors ([80a78d9](https://github.com/cozy/cozy-libs/commit/80a78d9142033f458714ec31383a08bfe8475d01))

### BREAKING CHANGES

- **cozy-sharing:** In an app that reads or overrides the cozy-sharing
  keys Share.errors.errors._, rename them to Share.errors._.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01EzbMP6xL3QaMcFeBaPS7aA

## [38.2.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@38.2.0...cozy-sharing@38.2.1) (2026-10-06)

**Note:** Version bump only for package cozy-sharing

# [38.2.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@38.1.13...cozy-sharing@38.2.0) (2026-10-06)

### Bug Fixes

- **cozy-sharing:** Expose es, de and it duplicate-invite errors ([562d67a](https://github.com/cozy/cozy-libs/commit/562d67ac867888b18f30e304dc597c14073135ff))

### Features

- **cozy-sharing:** Add Spanish, German and Italian locales ([727cb18](https://github.com/cozy/cozy-libs/commit/727cb18811efaed89c2bb7d6a8952f30b55d482a))

## [38.1.13](https://github.com/cozy/cozy-libs/compare/cozy-sharing@38.1.12...cozy-sharing@38.1.13) (2026-10-06)

**Note:** Version bump only for package cozy-sharing

## [38.1.12](https://github.com/cozy/cozy-libs/compare/cozy-sharing@38.1.11...cozy-sharing@38.1.12) (2026-10-06)

**Note:** Version bump only for package cozy-sharing

## [38.1.11](https://github.com/cozy/cozy-libs/compare/cozy-sharing@38.1.10...cozy-sharing@38.1.11) (2026-10-05)

**Note:** Version bump only for package cozy-sharing

## [38.1.10](https://github.com/cozy/cozy-libs/compare/cozy-sharing@38.1.9...cozy-sharing@38.1.10) (2026-10-05)

### Bug Fixes

- **cozy-sharing:** Respect nested permissions in hasWriteAccess ([b04a8aa](https://github.com/cozy/cozy-libs/commit/b04a8aa6bda15e5ef5dfa357c3c75a5fdc040e1a))

## [38.1.9](https://github.com/cozy/cozy-libs/compare/cozy-sharing@38.1.8...cozy-sharing@38.1.9) (2026-10-04)

**Note:** Version bump only for package cozy-sharing

## [38.1.8](https://github.com/cozy/cozy-libs/compare/cozy-sharing@38.1.7...cozy-sharing@38.1.8) (2026-10-02)

### Bug Fixes

- Share child on inherited viewer upgrade ([97af54e](https://github.com/cozy/cozy-libs/commit/97af54ededf883e6577a33e4b4864167811b4845))

## [38.1.7](https://github.com/cozy/cozy-libs/compare/cozy-sharing@38.1.6...cozy-sharing@38.1.7) (2026-10-02)

### Bug Fixes

- **cozy-sharing:** Clear effective recipients when the sharing is gone ([24897a7](https://github.com/cozy/cozy-libs/commit/24897a7ed7381a2f9f6bd2c229622689756a23ad)), closes [linagora/twake-drive#4264](https://github.com/linagora/twake-drive/issues/4264)

## [38.1.6](https://github.com/cozy/cozy-libs/compare/cozy-sharing@38.1.5...cozy-sharing@38.1.6) (2026-10-01)

### Bug Fixes

- **cozy-sharing:** Keep an unshared folder shareable by its owner ([d0bdac7](https://github.com/cozy/cozy-libs/commit/d0bdac725d3b854be789def6c67ae31ca8db59bd)), closes [linagora/twake-drive#4264](https://github.com/linagora/twake-drive/issues/4264)

## [38.1.5](https://github.com/cozy/cozy-libs/compare/cozy-sharing@38.1.4...cozy-sharing@38.1.5) (2026-09-30)

**Note:** Version bump only for package cozy-sharing

## [38.1.4](https://github.com/cozy/cozy-libs/compare/cozy-sharing@38.1.3...cozy-sharing@38.1.4) (2026-09-30)

**Note:** Version bump only for package cozy-sharing

## [38.1.3](https://github.com/cozy/cozy-libs/compare/cozy-sharing@38.1.2...cozy-sharing@38.1.3) (2026-09-23)

### Bug Fixes

- **sharing:** Downgrade member on shared parents when confirming ([3602a68](https://github.com/cozy/cozy-libs/commit/3602a6879e6a7c585f9233d2336812ee9972e612))

## [38.1.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@38.1.1...cozy-sharing@38.1.2) (2026-09-23)

### Bug Fixes

- **sharing:** Reuse the ancestor drive sharing for nested documents ([698048c](https://github.com/cozy/cozy-libs/commit/698048c808fc5f244a57ced6498cb0a9f6562df0))

## [38.1.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@38.1.0...cozy-sharing@38.1.1) (2026-09-21)

### Bug Fixes

- **sharing:** Keep full share modal for nested-folder editors ([014c848](https://github.com/cozy/cozy-libs/commit/014c848bb46699cee47eb4baf8bb7a365edaf2f1))
- **sharing:** Show editable share modal for members with write access ([cba3a13](https://github.com/cozy/cozy-libs/commit/cba3a13185d1fe088136c3a758ec94f0d3472b69))

# [38.1.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@38.0.0...cozy-sharing@38.1.0) (2026-09-16)

### Features

- **sharing:** Add hideCreateCozyAction prop to SharingBannerPlugin ([946fcb7](https://github.com/cozy/cozy-libs/commit/946fcb73ce27fca02511a2b03b34affdc0584d3b))

# [38.0.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@37.7.0...cozy-sharing@38.0.0) (2026-09-16)

### Bug Fixes

- **cozy-sharing:** Fix invisible folder icons in downgrade dialog ([6908d83](https://github.com/cozy/cozy-libs/commit/6908d83421ad65e5d4bd34659b9a24929609e5b5))
- **cozy-sharing:** Upgrade packages ([e632bc8](https://github.com/cozy/cozy-libs/commit/e632bc894af136e071e8315eb25ba2c276952249))

### BREAKING CHANGES

- **cozy-sharing:** you must have `@linagora/twake-icons >= 2.9.0`

# [37.7.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@37.6.2...cozy-sharing@37.7.0) (2026-09-15)

### Bug Fixes

- **cozy-sharing:** Stop getSharedParentPath self-matching ([54c6bfe](https://github.com/cozy/cozy-libs/commit/54c6bfe7874ebdfd8174905e749e9a0b584457a1))

### Features

- **cozy-sharing:** Confirm downgrade affecting a shared parent folder ([7a57bd9](https://github.com/cozy/cozy-libs/commit/7a57bd9b34ae93a0a394e69fc3f272a3ca4969d6))

## [37.6.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@37.6.1...cozy-sharing@37.6.2) (2026-09-14)

**Note:** Version bump only for package cozy-sharing

## [37.6.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@37.6.0...cozy-sharing@37.6.1) (2026-09-10)

**Note:** Version bump only for package cozy-sharing

# [37.6.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@37.5.5...cozy-sharing@37.6.0) (2026-09-07)

### Features

- **cozy-sharing:** Add tools to get and manager effective recipients ([d1bacbf](https://github.com/cozy/cozy-libs/commit/d1bacbf2d13cefd1863677d13a420964796a3d03))
- **cozy-sharing:** Show effective recipients in share modals ([e4f36aa](https://github.com/cozy/cozy-libs/commit/e4f36aa619762b5dfb2d64d3acdec38c011553b1))

## [37.5.5](https://github.com/cozy/cozy-libs/compare/cozy-sharing@37.5.4...cozy-sharing@37.5.5) (2026-09-01)

**Note:** Version bump only for package cozy-sharing

## [37.5.4](https://github.com/cozy/cozy-libs/compare/cozy-sharing@37.5.3...cozy-sharing@37.5.4) (2026-08-31)

### Bug Fixes

- **cozy-sharing:** Render the public banner button icons ([b4627f7](https://github.com/cozy/cozy-libs/commit/b4627f7689f73db592147f99a3baab11df612131))

## [37.5.3](https://github.com/cozy/cozy-libs/compare/cozy-sharing@37.5.2...cozy-sharing@37.5.3) (2026-08-31)

**Note:** Version bump only for package cozy-sharing

## [37.5.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@37.5.1...cozy-sharing@37.5.2) (2026-08-26)

### Bug Fixes

- **cozy-sharing:** Guard canReshare against missing sharing ([56cc19d](https://github.com/cozy/cozy-libs/commit/56cc19d09eed55472646cdc04ce8f4c7f2eb7f1e))

## [37.5.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@37.5.0...cozy-sharing@37.5.1) (2026-08-25)

### Bug Fixes

- **sharing:** Restore allLoaded gate for federated modal routing ([fcb492a](https://github.com/cozy/cozy-libs/commit/fcb492a3d09110beb0cd3a9e524d3547bdaafa21))

# [37.5.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@37.4.0...cozy-sharing@37.5.0) (2026-08-25)

### Features

- **cozy-sharing:** Export recipient types ([ca5fd55](https://github.com/cozy/cozy-libs/commit/ca5fd554471320993cd89eaca33a65a09d2ecc46))

# [37.4.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@37.3.0...cozy-sharing@37.4.0) (2026-08-25)

### Features

- Build sharing link staticaly instead of using io.cozy.apps ([285f608](https://github.com/cozy/cozy-libs/commit/285f60883c5f60c5c306a2d7a0a7f00c6d1de238))

# [37.3.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@37.2.12...cozy-sharing@37.3.0) (2026-08-24)

### Features

- **cozy-sharing:** Export group avatar ([6029b34](https://github.com/cozy/cozy-libs/commit/6029b349a818a6bb6e082f3958f3c67aca111a1f))

## [37.2.12](https://github.com/cozy/cozy-libs/compare/cozy-sharing@37.2.11...cozy-sharing@37.2.12) (2026-07-30)

### Bug Fixes

- **sharing:** Make shared-drive member modals consistent and correct ([9dcf67d](https://github.com/cozy/cozy-libs/commit/9dcf67d375600a1a02298dc3036880ae37d08aef))

## [37.2.11](https://github.com/cozy/cozy-libs/compare/cozy-sharing@37.2.10...cozy-sharing@37.2.11) (2026-07-30)

**Note:** Version bump only for package cozy-sharing

## [37.2.10](https://github.com/cozy/cozy-libs/compare/cozy-sharing@37.2.9...cozy-sharing@37.2.10) (2026-07-30)

**Note:** Version bump only for package cozy-sharing

## [37.2.9](https://github.com/cozy/cozy-libs/compare/cozy-sharing@37.2.8...cozy-sharing@37.2.9) (2026-07-29)

**Note:** Version bump only for package cozy-sharing

## [37.2.8](https://github.com/cozy/cozy-libs/compare/cozy-sharing@37.2.7...cozy-sharing@37.2.8) (2026-07-29)

**Note:** Version bump only for package cozy-sharing

## [37.2.7](https://github.com/cozy/cozy-libs/compare/cozy-sharing@37.2.6...cozy-sharing@37.2.7) (2026-07-29)

### Bug Fixes

- **cozy-sharing:** Style of shared only by link banner wasn't correct ([1f63fca](https://github.com/cozy/cozy-libs/commit/1f63fca78e72670f47100950fef8f699b518889a))

## [37.2.6](https://github.com/cozy/cozy-libs/compare/cozy-sharing@37.2.5...cozy-sharing@37.2.6) (2026-07-28)

**Note:** Version bump only for package cozy-sharing

## [37.2.5](https://github.com/cozy/cozy-libs/compare/cozy-sharing@37.2.4...cozy-sharing@37.2.5) (2026-07-28)

**Note:** Version bump only for package cozy-sharing

## [37.2.4](https://github.com/cozy/cozy-libs/compare/cozy-sharing@37.2.3...cozy-sharing@37.2.4) (2026-07-27)

**Note:** Version bump only for package cozy-sharing

## [37.2.3](https://github.com/cozy/cozy-libs/compare/cozy-sharing@37.2.2...cozy-sharing@37.2.3) (2026-07-23)

### Bug Fixes

- **cozy-sharing:** Add padding to document chips ([0a26e8e](https://github.com/cozy/cozy-libs/commit/0a26e8ece49e40343e5eb800777d8b55234ac90f))

## [37.2.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@37.2.1...cozy-sharing@37.2.2) (2026-07-22)

**Note:** Version bump only for package cozy-sharing

## [37.2.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@37.2.0...cozy-sharing@37.2.1) (2026-07-22)

**Note:** Version bump only for package cozy-sharing

# [37.2.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@37.1.0...cozy-sharing@37.2.0) (2026-07-21)

### Bug Fixes

- **sharing:** Constrain document icons in link access chips ([7749db2](https://github.com/cozy/cozy-libs/commit/7749db2bd4ccdaada1e8ad2aadba472612235c08))
- **sharing:** Make share link access updates consistent ([d2a350a](https://github.com/cozy/cozy-libs/commit/d2a350a5589bf21f494a83618c6e0f82d0ec0825))
- **sharing:** Refine link access modal layout ([b4e004d](https://github.com/cozy/cozy-libs/commit/b4e004d2f4052ea07b48e37da51d05002e5803b4))

### Features

- **cozy-sharing:** Remove CTA in empty group and change wording ([3f36cb1](https://github.com/cozy/cozy-libs/commit/3f36cb1312b76f9515cb69535a913cc02e9ec2e8))
- **sharing:** Add link access management to SharingProvider ([328b43b](https://github.com/cozy/cozy-libs/commit/328b43b4c804c1df123361d26aaaa507b6646a00))
- **sharing:** Add ShareLinkAccessModal ([5982905](https://github.com/cozy/cozy-libs/commit/598290547626045a5c2e0b2b3ef902b739ee9f58))

# [37.1.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@37.0.2...cozy-sharing@37.1.0) (2026-07-21)

### Features

- Display image from user in chip ([fd7a03b](https://github.com/cozy/cozy-libs/commit/fd7a03bc6607e7688d639b63f6b0ecc00a936369))

## [37.0.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@37.0.1...cozy-sharing@37.0.2) (2026-07-21)

**Note:** Version bump only for package cozy-sharing

## [37.0.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@37.0.0...cozy-sharing@37.0.1) (2026-07-17)

### Bug Fixes

- **cozy-sharing:** Restore federated recipient management ([7442f26](https://github.com/cozy/cozy-libs/commit/7442f26f6cdb757d62d656f19d237d7694335c0c))

# [37.0.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@36.5.0...cozy-sharing@37.0.0) (2026-07-16)

### Features

- Display correct icon and colors for group avatar ([e630c7a](https://github.com/cozy/cozy-libs/commit/e630c7a9c9cc2d3b784c3bce1848bdcbbf257c25))
- Update cozy-ui ([8d1d2a1](https://github.com/cozy/cozy-libs/commit/8d1d2a1a32963e7b1fc8efdc07ca76f3e48a430b))

### BREAKING CHANGES

- You need cozy-ui >= 140.5.0

# [36.5.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@36.4.2...cozy-sharing@36.5.0) (2026-07-09)

### Features

- Extract PermissionTypeMenu and export it ([a7ee85a](https://github.com/cozy/cozy-libs/commit/a7ee85a4b87295b6c4276710f3e8090f95a6dbba))

## [36.4.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@36.4.1...cozy-sharing@36.4.2) (2026-07-09)

**Note:** Version bump only for package cozy-sharing

## [36.4.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@36.4.0...cozy-sharing@36.4.1) (2026-07-08)

**Note:** Version bump only for package cozy-sharing

# [36.4.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@36.3.0...cozy-sharing@36.4.0) (2026-07-07)

### Features

- **cozy-sharing:** Expose MemberAvatar in main API ([2af294e](https://github.com/cozy/cozy-libs/commit/2af294e565eb3c727a9d0505e6e5c204f3d8e05c))
- **cozy-sharing:** MemberAvatar can get avatar image with cozy.url path ([2f694bd](https://github.com/cozy/cozy-libs/commit/2f694bde7c8bd2e30ae9b5c6a51d31e229fec2ef))
- **cozy-sharing:** Now getInitials return 2 letters if possible ([175ad40](https://github.com/cozy/cozy-libs/commit/175ad40116f6face3bdfdff1642a8d26cdc01596))
- **cozy-sharing:** Use MemberAvatar in ContactSuggestion ([b03da9f](https://github.com/cozy/cozy-libs/commit/b03da9f1d3f3e23b5b90154c313fd5adbab7aa8a))

# [36.3.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@36.2.1...cozy-sharing@36.3.0) (2026-07-01)

### Features

- **cozy-sharing:** Hide email for org instance owner ([5d15a29](https://github.com/cozy/cozy-libs/commit/5d15a297a485e98ff6c0e3afe7ab466d9bf4fe99))

## [36.2.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@36.2.0...cozy-sharing@36.2.1) (2026-06-30)

**Note:** Version bump only for package cozy-sharing

# [36.2.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@36.1.0...cozy-sharing@36.2.0) (2026-06-30)

### Features

- Rename shared drive to team drive ([b997bf6](https://github.com/cozy/cozy-libs/commit/b997bf64b60ca3d0203899e331f9e96878967c2b))

# [36.1.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@36.0.1...cozy-sharing@36.1.0) (2026-06-30)

### Features

- **cozy-sharing:** ShareAutosuggest can now be autofocus false ([fabac23](https://github.com/cozy/cozy-libs/commit/fabac23c23cdd041d4bd70f0adaa99a974caf33d))

## [36.0.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@36.0.0...cozy-sharing@36.0.1) (2026-06-29)

### Bug Fixes

- **sharing:** Guard shared-path helpers against undefined path ([0365f75](https://github.com/cozy/cozy-libs/commit/0365f755ce4b4125250eb883658912ec05b77253))

# [36.0.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@35.0.0...cozy-sharing@36.0.0) (2026-06-25)

### Features

- Update packages ([e6aa159](https://github.com/cozy/cozy-libs/commit/e6aa159bbffc752791caccc2cc7005a2ced62e33))

### BREAKING CHANGES

- You must have `"cozy-client": ">=60.28.0"`

# [35.0.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@34.1.2...cozy-sharing@35.0.0) (2026-06-25)

### Features

- Ugrade twake-icons in libs and remove test mock ([46178bc](https://github.com/cozy/cozy-libs/commit/46178bcfff73fb8486b6a5209a14e306b497371b))

### BREAKING CHANGES

- You must have `@linagora/twake-icons >=2.6.6`

## [34.1.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@34.1.1...cozy-sharing@34.1.2) (2026-06-25)

### Bug Fixes

- **sharing:** Call self revoke for federated recipients ([25e62c2](https://github.com/cozy/cozy-libs/commit/25e62c2416e4b91bdab1e06fbbd77b00574a0b11))

## [34.1.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@34.1.0...cozy-sharing@34.1.1) (2026-06-25)

### Bug Fixes

- **federated:** Show correct recipients for files inside shared folder ([b656e73](https://github.com/cozy/cozy-libs/commit/b656e73240a30303c8063494ee052a197736d07c))

# [34.1.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@34.0.2...cozy-sharing@34.1.0) (2026-06-25)

### Features

- Show text and not menu if forced readonly for groups ([24d6df8](https://github.com/cozy/cozy-libs/commit/24d6df8c6d7ad0da2f63719d264001dbf67624cc))

## [34.0.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@34.0.1...cozy-sharing@34.0.2) (2026-06-24)

**Note:** Version bump only for package cozy-sharing

## [34.0.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@34.0.0...cozy-sharing@34.0.1) (2026-06-24)

**Note:** Version bump only for package cozy-sharing

# [34.0.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@33.6.1...cozy-sharing@34.0.0) (2026-06-24)

### Features

- **cozy-sharing:** Add twake-icons ([7f2432a](https://github.com/cozy/cozy-libs/commit/7f2432a601ca02a72f0b792726c6c70919c6036a))

### BREAKING CHANGES

- **cozy-sharing:** You must add `@linagora/twake-icons >= 2.6.2`

## [33.6.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@33.6.0...cozy-sharing@33.6.1) (2026-06-22)

### Bug Fixes

- Forget owner-only shared drive sharings ([795eff2](https://github.com/cozy/cozy-libs/commit/795eff246218780d6315ae49d4b55dbe732c450b))

# [33.6.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@33.5.1...cozy-sharing@33.6.0) (2026-06-17)

### Features

- Add prop to enable a readonly list in WhoHasAccess ([9643520](https://github.com/cozy/cozy-libs/commit/9643520bfbd9d1da425176efec5e361bf5ef1498))
- Display read only modal (details modal) for B2B shared drive ([9960588](https://github.com/cozy/cozy-libs/commit/9960588289d67555f0a3cf3e0b24fd7c8fe222fc))
- Enable readonly display of link recipient ([c5146b0](https://github.com/cozy/cozy-libs/commit/c5146b094b17c7956419dd50b47b113b929daa29))
- Remove unwanted details from sharing details modal ([b067718](https://github.com/cozy/cozy-libs/commit/b0677189eeebe258177187ea98ce2f48b6af8777))
- Show "Owner" if owner or type otherwise when no menu in member ([b4ef094](https://github.com/cozy/cozy-libs/commit/b4ef0942ecba54a21f4ed0ed16ccc480a1e1525d))
- Show type instead of status when no menu in member ([ba87489](https://github.com/cozy/cozy-libs/commit/ba874890418899aeecdba41b792724dbae0ce7c9))

## [33.5.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@33.5.0...cozy-sharing@33.5.1) (2026-06-17)

### Bug Fixes

- **cozy-sharing:** Avoid rendering email twice in recipient row ([800f091](https://github.com/cozy/cozy-libs/commit/800f0915853f167b47087b77ef1a4620a4615fa3))
- **cozy-sharing:** Prioritize email over instance URL ([4814ab3](https://github.com/cozy/cozy-libs/commit/4814ab34ec13cd8f53641dd333107f2648fb8e76))

# [33.5.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@33.4.3...cozy-sharing@33.5.0) (2026-06-17)

### Features

- Add isOrgSharedDrive and canLeave helpers ([f93d4bb](https://github.com/cozy/cozy-libs/commit/f93d4bb37cd748a7e18db3a3ac67e1b84e819440))

## [33.4.3](https://github.com/cozy/cozy-libs/compare/cozy-sharing@33.4.2...cozy-sharing@33.4.3) (2026-06-16)

### Bug Fixes

- **cozy-sharing:** Remove revoked sharing after last recipient ([e0f486c](https://github.com/cozy/cozy-libs/commit/e0f486cd9b7805e8214c5586f0d7b2c7aed50491))

## [33.4.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@33.4.1...cozy-sharing@33.4.2) (2026-06-16)

### Bug Fixes

- **cozy-sharing:** Preserve sharing updates on rollback ([7c6db1a](https://github.com/cozy/cozy-libs/commit/7c6db1ad63f3997f01bdfee7140f9dad36dde2c2))
- **sharing:** Update member permissions optimistically ([5c1ac86](https://github.com/cozy/cozy-libs/commit/5c1ac8631e4598ac6d2bc08761d2064c9b396f66))

## [33.4.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@33.4.0...cozy-sharing@33.4.1) (2026-06-15)

### Bug Fixes

- **cozy-sharing:** Keep the owner avatar visible in the share modal ([f63ae1d](https://github.com/cozy/cozy-libs/commit/f63ae1de24de5ca7746b0c6da579f52fa5593806))

# [33.4.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@33.3.4...cozy-sharing@33.4.0) (2026-06-15)

### Bug Fixes

- **cozy-sharing:** Prevent duplicate shared drive links ([0d93ae5](https://github.com/cozy/cozy-libs/commit/0d93ae50cba1d6fe9f6f070bba87b874119fffb7))
- **cozy-sharing:** Prevent repeated shared drive link fetches ([fa8833e](https://github.com/cozy/cozy-libs/commit/fa8833e058a5432eef6743923b38ed42916ea3e3))

### Features

- **cozy-sharing:** Show shared drive links ([3736586](https://github.com/cozy/cozy-libs/commit/37365866117c630f730b108c69e56d0526fa5736))

## [33.3.4](https://github.com/cozy/cozy-libs/compare/cozy-sharing@33.3.3...cozy-sharing@33.3.4) (2026-06-11)

### Bug Fixes

- Remove strange custom color on share by me button ([712a261](https://github.com/cozy/cozy-libs/commit/712a2610eb572e00c9934745a978fd562154140a))

## [33.3.3](https://github.com/cozy/cozy-libs/compare/cozy-sharing@33.3.2...cozy-sharing@33.3.3) (2026-06-11)

### Bug Fixes

- **cozy-sharing:** Scroll members list in federated share dialogs ([a3b8a64](https://github.com/cozy/cozy-libs/commit/a3b8a6460efa0b6228cdbf825eca7b950300b2f9))

## [33.3.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@33.3.1...cozy-sharing@33.3.2) (2026-06-11)

### Bug Fixes

- **cozy-sharing:** Use readonly endpoint in updateSharingMemberType ([f4914b6](https://github.com/cozy/cozy-libs/commit/f4914b61daaf5c20b17c4b9f1ddda511860a56ac))

## [33.3.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@33.3.0...cozy-sharing@33.3.1) (2026-06-10)

### Bug Fixes

- **cozy-sharing:** Expire share links at the end of the selected day ([db81ed9](https://github.com/cozy/cozy-libs/commit/db81ed936a15850f278404511c1b6faec0fc7a54))

# [33.3.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@33.2.2...cozy-sharing@33.3.0) (2026-06-10)

### Features

- **cozy-sharing:** Expose recipients from sharing ([4751522](https://github.com/cozy/cozy-libs/commit/47515222a60ec54b0537b6ca6b5cfab3e6613638))

## [33.2.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@33.2.1...cozy-sharing@33.2.2) (2026-06-10)

### Bug Fixes

- **cozy-sharing:** Allow sharing shared drive folder root by email ([5110b4f](https://github.com/cozy/cozy-libs/commit/5110b4fb306bb664f2c6b62f209ef4af1e25c293))
- **cozy-sharing:** Fix lint issue in master ([5acd30a](https://github.com/cozy/cozy-libs/commit/5acd30a31412552be6b6223e43df2b320ea07098))

## [33.2.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@33.2.0...cozy-sharing@33.2.1) (2026-06-09)

### Bug Fixes

- **cozy-sharing:** Refresh link state in share modal ([dfb6dd3](https://github.com/cozy/cozy-libs/commit/dfb6dd39e81b13a7da37ab8f5b4480fb645df01e))

# [33.2.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@33.1.2...cozy-sharing@33.2.0) (2026-06-09)

### Features

- **cozy-sharing:** Show progress icon on done button during share ([885a715](https://github.com/cozy/cozy-libs/commit/885a71568a96354e3d962296a205efb05881a5d1))

## [33.1.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@33.1.1...cozy-sharing@33.1.2) (2026-06-08)

### Bug Fixes

- **cozy-sharing:** Avoid regex parsing in input matchers ([ecab525](https://github.com/cozy/cozy-libs/commit/ecab525b7559710d693787fb50c6c5fe8abd55ac))
- **cozy-sharing:** Make matching diacritic-insensitive ([e421a5a](https://github.com/cozy/cozy-libs/commit/e421a5ac5f97f64ef27340a3b87f9f15b3efebd9))

## [33.1.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@33.1.0...cozy-sharing@33.1.1) (2026-06-04)

### Bug Fixes

- **cozy-sharing:** Memoize ShareByEmail section in SharedDriveForm ([2ea5eb2](https://github.com/cozy/cozy-libs/commit/2ea5eb2a8d37eec582212b07b8617c36fd107930))

# [33.1.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@33.0.2...cozy-sharing@33.1.0) (2026-06-04)

### Features

- Remove email sharing in recipient side ([f6a3f19](https://github.com/cozy/cozy-libs/commit/f6a3f19bd32f9c1d1d22284a59349a60e2ca147e))

## [33.0.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@33.0.1...cozy-sharing@33.0.2) (2026-06-02)

### Bug Fixes

- Avoid suggesting an already added or a pending recipient ([a9f7b19](https://github.com/cozy/cozy-libs/commit/a9f7b1934ef9d666b9515fe1cf28538a466bf1ff))

## [33.0.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@33.0.0...cozy-sharing@33.0.1) (2026-06-02)

### Bug Fixes

- Disable new contact creation for shared drives forms ([08abf8a](https://github.com/cozy/cozy-libs/commit/08abf8a21a8d37db190866d68a73744b8bcbf0aa))

# [33.0.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@32.3.2...cozy-sharing@33.0.0) (2026-06-02)

### Bug Fixes

- Avoid adding an already added recipients in EditSharedDriveModal ([d24e01c](https://github.com/cozy/cozy-libs/commit/d24e01c999a2c09fe87e59a0c7a26c3555c96557))
- Hide owner in EditSharedDriveModal ([9c2b060](https://github.com/cozy/cozy-libs/commit/9c2b060fc3f55c44cf35831298879d3fe0a7a403))

### Features

- Add spinner to create shared drive form ([4112e7c](https://github.com/cozy/cozy-libs/commit/4112e7c7f592115ed2689ded3f45d876ee12f9dc))
- Add spinner to edit shared drive form ([f135ff5](https://github.com/cozy/cozy-libs/commit/f135ff5bae8e9fbe6b510a3114af363159ced7af))

### BREAKING CHANGES

- You need cozy-ui >= 139.0.2

## [32.3.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@32.3.1...cozy-sharing@32.3.2) (2026-05-26)

### Bug Fixes

- Show readonly modal when shared drive is read only ([e935b38](https://github.com/cozy/cozy-libs/commit/e935b38aa443d68b7d17dc8c82e8a9e1e23e2460))

## [32.3.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@32.3.0...cozy-sharing@32.3.1) (2026-05-22)

### Bug Fixes

- **cozy-sharing:** Filter out owner from the list of suggested users ([cb312ee](https://github.com/cozy/cozy-libs/commit/cb312ee6e412d021aff4a44830229404478ba316))

# [32.3.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@32.2.0...cozy-sharing@32.3.0) (2026-05-21)

### Features

- **sharing:** Update sharing dialog close actions ([0624f97](https://github.com/cozy/cozy-libs/commit/0624f972fa681f199724a0bc10cfffe1f31c9657))

# [32.2.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@32.1.2...cozy-sharing@32.2.0) (2026-05-21)

### Features

- **cozy-sharing:** Add autoFocus to the share recipient input ([0919284](https://github.com/cozy/cozy-libs/commit/09192847eb6659692b5950094095eb07e5be30ad))

## [32.1.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@32.1.1...cozy-sharing@32.1.2) (2026-05-19)

**Note:** Version bump only for package cozy-sharing

## [32.1.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@32.1.0...cozy-sharing@32.1.1) (2026-05-18)

**Note:** Version bump only for package cozy-sharing

# [32.1.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@32.0.0...cozy-sharing@32.1.0) (2026-05-18)

### Features

- Add EditSharedDriveModal ([042651b](https://github.com/cozy/cozy-libs/commit/042651b7debad197f57315f2b4c8c6d7a94a8230))
- Add SharedDriveHeader and use it in ShareDriveForm ([d47d62f](https://github.com/cozy/cozy-libs/commit/d47d62fcaf38c5673d76e1701f31f52ff198ed53))
- Uniformize "Add users" wording ([82b45f7](https://github.com/cozy/cozy-libs/commit/82b45f7d6f1ce0a6929beb02362e86034b4bd2b1))

# [32.0.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@31.2.0...cozy-sharing@32.0.0) (2026-05-18)

### Features

- Remove unused propTypes.js ([299669c](https://github.com/cozy/cozy-libs/commit/299669c168b55bb8fe242b3879288bd79317a0c3))
- Removed unused SharedStatus ([e7a3b2b](https://github.com/cozy/cozy-libs/commit/e7a3b2b1cfd708a55691cbb54139cbe4458f1332))
- Update cozy-device-helper ([0ffd6d3](https://github.com/cozy/cozy-libs/commit/0ffd6d330f7760df623237d575175e159525361a))

### BREAKING CHANGES

- You need "cozy-device-helper": ">=4.0.0" for "cozy-sharing"

# [31.2.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@31.1.0...cozy-sharing@31.2.0) (2026-05-12)

### Bug Fixes

- Avoid blinking recipient in share modals ([8e71bc8](https://github.com/cozy/cozy-libs/commit/8e71bc8e6a924340100247523f75d2c18912739a))

### Features

- Add usePendingRecipients hook ([7f8a96e](https://github.com/cozy/cozy-libs/commit/7f8a96eb35044fb6d001bf7460a84ceda34fa130))
- Delete special shared folder recipient management ([6691c99](https://github.com/cozy/cozy-libs/commit/6691c99f698b1db6b537f5ac0a0ab69303986501))
- Implement usePendingRecipients for FederatedFolder modal ([3564cb9](https://github.com/cozy/cozy-libs/commit/3564cb9aba9647fc63870d433cd80cf119e749ae))
- Implement usePendingRecipients for SharedDriveForm ([129a033](https://github.com/cozy/cozy-libs/commit/129a03369a6be34ec829b74d838245e66edab4de))
- Implement usePendingRecipients for ShareDialogCozyToCozy modal ([2d5d4c2](https://github.com/cozy/cozy-libs/commit/2d5d4c2c1419e50c9f24f8cbca0cb547d1d6bb0d))
- Update CozyToCozy dialog to new UI and wording ([e1ec36b](https://github.com/cozy/cozy-libs/commit/e1ec36b363d88e940b42f54b281485a236775263))
- Update ShareTypeSelect UI ([515aab4](https://github.com/cozy/cozy-libs/commit/515aab437afa502dcacd1debb932794017519845))

# [31.1.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@31.0.2...cozy-sharing@31.1.0) (2026-05-07)

### Bug Fixes

- Autoclose sharing link permission menu ([82f6b62](https://github.com/cozy/cozy-libs/commit/82f6b62c78232805150e8c927955bb7eeb108ad4))
- Fix hover issue in link recipient text ([dce027c](https://github.com/cozy/cozy-libs/commit/dce027c16eecf8f3309da73a1dd01d537a2cef47))

### Features

- Revoke member or group with button instead of action ([3fa0c4d](https://github.com/cozy/cozy-libs/commit/3fa0c4d3035d57fa65e231fbbddc5b06955b3ecb))
- Update permission menu UI ([bc0c0ad](https://github.com/cozy/cozy-libs/commit/bc0c0ade86d86e82299397c09cdc5f4c19c1c4ac))
- Update SharedDriveForm UI ([b3ab3ff](https://github.com/cozy/cozy-libs/commit/b3ab3ffd3881ccae74c1e3486706e7c108ed151b))
- Update SharedDriveForm wording ([c46750b](https://github.com/cozy/cozy-libs/commit/c46750be56cbc0c99b2c3f46b069d361cadddb82))

## [31.0.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@31.0.1...cozy-sharing@31.0.2) (2026-05-07)

### Bug Fixes

- **cozy-sharing:** Escape user input in suggestion matchers ([d1bce0d](https://github.com/cozy/cozy-libs/commit/d1bce0d4426a04960e8e44d93b301c2f673e584e))

## [31.0.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@31.0.0...cozy-sharing@31.0.1) (2026-05-07)

**Note:** Version bump only for package cozy-sharing

# [31.0.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@30.3.1...cozy-sharing@31.0.0) (2026-05-05)

### Features

- **cozy-sharing:** Split SharedDriveModal ([82b9166](https://github.com/cozy/cozy-libs/commit/82b91662eadf1eb7380aa19484c6dac8c2757b2c))
- **cozy-sharing:** Update cozy-client ([bb5a3cf](https://github.com/cozy/cozy-libs/commit/bb5a3cf5c3ddb231f62d250508f744410dbfe477))
- **cozy-sharing:** Use new API to create shared drive ([4296b92](https://github.com/cozy/cozy-libs/commit/4296b92821643c3daa102192b550080b8d34b27f))

### BREAKING CHANGES

- **cozy-sharing:** You need to update cozy-client to >=60.24.0

## [30.3.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@30.3.0...cozy-sharing@30.3.1) (2026-04-24)

### Bug Fixes

- **cozy-sharing:** Flatten contact name object in formatRecipients ([c804f59](https://github.com/cozy/cozy-libs/commit/c804f59d87d40cc8a6bfc5e96e88d88a13cbaadb))

# [30.3.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@30.2.2...cozy-sharing@30.3.0) (2026-04-23)

### Features

- **cozy-sharing:** Auto-scroll highlighted suggestion into view ([8a367f7](https://github.com/cozy/cozy-libs/commit/8a367f73e36c9cce98cd492845faaf04ec4d1771))

## [30.2.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@30.2.1...cozy-sharing@30.2.2) (2026-04-22)

**Note:** Version bump only for package cozy-sharing

## [30.2.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@30.2.0...cozy-sharing@30.2.1) (2026-04-20)

### Bug Fixes

- **cozy-sharing:** Preserve user gesture for Safari clipboard writes ([c3e9069](https://github.com/cozy/cozy-libs/commit/c3e9069e250880b9d6640c8ae7529b987af497dc))

# [30.2.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@30.1.1...cozy-sharing@30.2.0) (2026-04-20)

### Features

- **cozy-sharing:** Add props to tune the link sharing flow ([0bfc1b9](https://github.com/cozy/cozy-libs/commit/0bfc1b9d58c3c8ce709c0ab7057e028f012d6924))

## [30.1.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@30.1.0...cozy-sharing@30.1.1) (2026-04-07)

**Note:** Version bump only for package cozy-sharing

# [30.1.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@30.0.3...cozy-sharing@30.1.0) (2026-04-02)

### Features

- Hide read write modification in link edition modal ([cc29e55](https://github.com/cozy/cozy-libs/commit/cc29e55f9950c2ed6afae751ff8c87592c44f2c6))
- Update link sharing french translation ([05bb544](https://github.com/cozy/cozy-libs/commit/05bb544dab03c900030738a9cf589bb4c2868575))
- Update link sharing look ([f6e66d0](https://github.com/cozy/cozy-libs/commit/f6e66d0ae4d426b8be19ca4dafb2a39c3e1f2df0))

## [30.0.3](https://github.com/cozy/cozy-libs/compare/cozy-sharing@30.0.2...cozy-sharing@30.0.3) (2026-04-02)

**Note:** Version bump only for package cozy-sharing

## [30.0.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@30.0.1...cozy-sharing@30.0.2) (2026-04-02)

**Note:** Version bump only for package cozy-sharing

## [30.0.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@30.0.0...cozy-sharing@30.0.1) (2026-03-25)

### Bug Fixes

- Small locales adjustments ([c743965](https://github.com/cozy/cozy-libs/commit/c7439654ddc291e452168f6635e82cf28c388d7c))

# [30.0.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@29.0.0...cozy-sharing@30.0.0) (2026-03-24)

### Features

- Upgrade cozy-ui and cozy-ui-plus in cozy-search and cozy-sharing ([f5fd252](https://github.com/cozy/cozy-libs/commit/f5fd2520150e276c8b55feeb1b994ba33d0a114b))

### BREAKING CHANGES

- You must have `cozy-ui >= 138.1.0 and cozy-ui-plus >= 6.0.0`

# [29.0.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@28.11.3...cozy-sharing@29.0.0) (2026-03-24)

### Features

- **cozy-ui-plus:** Upgrade cozy-ui ([b01d192](https://github.com/cozy/cozy-libs/commit/b01d1926f00a81ff2eb2c0b03378ea06fefd5fcc))

### BREAKING CHANGES

- **cozy-ui-plus:** You must have `cozy-ui >= 138.1.0`

## [28.11.3](https://github.com/cozy/cozy-libs/compare/cozy-sharing@28.11.2...cozy-sharing@28.11.3) (2026-03-23)

### Bug Fixes

- **cozy-sharing:** Accumulate recipients in federated folder sharing ([a626ee4](https://github.com/cozy/cozy-libs/commit/a626ee4793486d1dcdb5e419a59f39caee6f09f7))
- **cozy-sharing:** Normalize recipient id in dedup helper ([6bd9292](https://github.com/cozy/cozy-libs/commit/6bd9292ef50f01307f6bfb335812dfc4ecce5c25))
- Remove warning on cozy-flags missing dependency ([25f9864](https://github.com/cozy/cozy-libs/commit/25f98641a5f9c1f22fa759abe7382d422d4567ef))

## [28.11.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@28.11.1...cozy-sharing@28.11.2) (2026-03-18)

### Bug Fixes

- **cozy-sharing:** Force text primary color on autosuggest text ([0a20cda](https://github.com/cozy/cozy-libs/commit/0a20cda336d1aa5c3b25ffcd9423ecf6c2cddd9c))

## [28.11.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@28.11.0...cozy-sharing@28.11.1) (2026-03-17)

**Note:** Version bump only for package cozy-sharing

# [28.11.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@28.10.0...cozy-sharing@28.11.0) (2026-03-17)

### Features

- Upgrade Jest to 28 ([b92c56c](https://github.com/cozy/cozy-libs/commit/b92c56ce2fdd65b3dd8e9c5170dc5eb86cc369a7))

# [28.10.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@28.9.2...cozy-sharing@28.10.0) (2026-03-17)

### Features

- Allow to revoke shared drive file sharing link ([7cff1da](https://github.com/cozy/cozy-libs/commit/7cff1da36a8b048a25efd302a5e3e0efb114e327))

## [28.9.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@28.9.1...cozy-sharing@28.9.2) (2026-03-16)

**Note:** Version bump only for package cozy-sharing

## [28.9.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@28.9.0...cozy-sharing@28.9.1) (2026-03-16)

**Note:** Version bump only for package cozy-sharing

# [28.9.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@28.8.0...cozy-sharing@28.9.0) (2026-03-12)

### Features

- Disable Twake Creation from public sharing link ([e8e6fcf](https://github.com/cozy/cozy-libs/commit/e8e6fcfc5e659796f06378818044debb09c7c4e2))

# [28.8.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@28.7.0...cozy-sharing@28.8.0) (2026-03-12)

### Features

- **cozy-sharing:** Use FederatedFolderModal on existing sharings ([541de13](https://github.com/cozy/cozy-libs/commit/541de1310631170b5567694ff1366bc997fb3ea3))

# [28.7.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@28.6.0...cozy-sharing@28.7.0) (2026-03-12)

### Features

- Allow to change link editing rights directly from the share modal ([57c3e61](https://github.com/cozy/cozy-libs/commit/57c3e6144649d3102c37961b4953219bdfe553a3))
- Display the Share restriction modal on click on the sharing link ([a875c36](https://github.com/cozy/cozy-libs/commit/a875c36e7b6ea592b25cbc8386a305b1c1dac516))

# [28.6.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@28.5.0...cozy-sharing@28.6.0) (2026-03-11)

### Features

- Add ability to change member permission type in sharing ([76d0dce](https://github.com/cozy/cozy-libs/commit/76d0dce150d8ea7ac7cb12c6e00b340756b6512a))
- Hide link text in link recipient ([209857f](https://github.com/cozy/cozy-libs/commit/209857fcf01b71e584e49ef8ab3da4a897d408ed))
- Remove link prop from LinkRecipient component ([7bbf831](https://github.com/cozy/cozy-libs/commit/7bbf831594d7c33357ade79665f4308fd35e2b8e))

# [28.5.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@28.4.4...cozy-sharing@28.5.0) (2026-03-10)

### Bug Fixes

- Make sharingDesc prop optional with default empty string ([538eaa6](https://github.com/cozy/cozy-libs/commit/538eaa61988405be4225a6147fad17805b218e30))

### Features

- Allow to share a shared drive file by link ([a78e796](https://github.com/cozy/cozy-libs/commit/a78e7963af05b6815856246a722542acee2d900f))

## [28.4.4](https://github.com/cozy/cozy-libs/compare/cozy-sharing@28.4.3...cozy-sharing@28.4.4) (2026-03-09)

**Note:** Version bump only for package cozy-sharing

## [28.4.3](https://github.com/cozy/cozy-libs/compare/cozy-sharing@28.4.2...cozy-sharing@28.4.3) (2026-03-09)

**Note:** Version bump only for package cozy-sharing

## [28.4.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@28.4.1...cozy-sharing@28.4.2) (2026-03-05)

**Note:** Version bump only for package cozy-sharing

## [28.4.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@28.4.0...cozy-sharing@28.4.1) (2026-02-25)

**Note:** Version bump only for package cozy-sharing

# [28.4.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@28.3.5...cozy-sharing@28.4.0) (2026-02-24)

### Features

- **cozy-sharing:** Implement federated folder sharing modal ([94d52b1](https://github.com/cozy/cozy-libs/commit/94d52b1801f4ddc3253e26a8eb5cfdccfbb5388d))

## [28.3.5](https://github.com/cozy/cozy-libs/compare/cozy-sharing@28.3.4...cozy-sharing@28.3.5) (2026-02-23)

**Note:** Version bump only for package cozy-sharing

## [28.3.4](https://github.com/cozy/cozy-libs/compare/cozy-sharing@28.3.3...cozy-sharing@28.3.4) (2026-02-19)

**Note:** Version bump only for package cozy-sharing

## [28.3.3](https://github.com/cozy/cozy-libs/compare/cozy-sharing@28.3.2...cozy-sharing@28.3.3) (2026-02-03)

**Note:** Version bump only for package cozy-sharing

## [28.3.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@28.3.1...cozy-sharing@28.3.2) (2026-02-02)

**Note:** Version bump only for package cozy-sharing

## [28.3.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@28.3.0...cozy-sharing@28.3.1) (2026-01-29)

**Note:** Version bump only for package cozy-sharing

# [28.3.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@28.2.1...cozy-sharing@28.3.0) (2026-01-26)

### Features

- Generate and copy folder link in one click ([7b806da](https://github.com/cozy/cozy-libs/commit/7b806dae2564c45d1a469150832ebed3ac47235a))

## [28.2.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@28.2.0...cozy-sharing@28.2.1) (2026-01-15)

**Note:** Version bump only for package cozy-sharing

# [28.2.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@28.1.4...cozy-sharing@28.2.0) (2026-01-14)

### Features

- Add antivirus alert when a file not been scanned yet ([9146347](https://github.com/cozy/cozy-libs/commit/91463475a1852b53442711aa8aa2efd848992f5e))

## [28.1.4](https://github.com/cozy/cozy-libs/compare/cozy-sharing@28.1.3...cozy-sharing@28.1.4) (2026-01-14)

**Note:** Version bump only for package cozy-sharing

## [28.1.3](https://github.com/cozy/cozy-libs/compare/cozy-sharing@28.1.2...cozy-sharing@28.1.3) (2026-01-14)

**Note:** Version bump only for package cozy-sharing

## [28.1.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@28.1.1...cozy-sharing@28.1.2) (2025-12-15)

### Bug Fixes

- Don't show error when user aborts share ([77a6b8d](https://github.com/cozy/cozy-libs/commit/77a6b8d7dc96c32ea00f933bdc176d2a129f6b60))

## [28.1.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@28.1.0...cozy-sharing@28.1.1) (2025-12-12)

### Bug Fixes

- Do not disable save button when name is unchanged ([4fcff36](https://github.com/cozy/cozy-libs/commit/4fcff366987fea025a9cf2df447e265221406487))

# [28.1.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@28.0.3...cozy-sharing@28.1.0) (2025-12-11)

### Features

- Change add button color ([d6bad5e](https://github.com/cozy/cozy-libs/commit/d6bad5edc25a3a3a123350e602b87315e521f3af))

## [28.0.3](https://github.com/cozy/cozy-libs/compare/cozy-sharing@28.0.2...cozy-sharing@28.0.3) (2025-12-10)

**Note:** Version bump only for package cozy-sharing

## [28.0.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@28.0.1...cozy-sharing@28.0.2) (2025-12-08)

### Bug Fixes

- Use sharing provider to rename shared drive ([6208d72](https://github.com/cozy/cozy-libs/commit/6208d72bf6ebb7330dff82e90fb207754b135671))

## [28.0.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@28.0.0...cozy-sharing@28.0.1) (2025-12-05)

### Bug Fixes

- **cozy-sharing:** Add twake-i18n to jest config to fix unit tests ([781e991](https://github.com/cozy/cozy-libs/commit/781e9919ff6f6326c041c893949edd9a5e5a4e91))

# [28.0.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@27.2.0...cozy-sharing@28.0.0) (2025-12-04)

### Features

- Add twake-i18n in packages ([f8689a9](https://github.com/cozy/cozy-libs/commit/f8689a9a58dc6384ccf494a19fd1afb595da39f0))

### BREAKING CHANGES

- You must have `twake-i18n >= 0.3.0` and `cozy-ui >= 135.0.0`

# [27.2.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@27.1.4...cozy-sharing@27.2.0) (2025-12-04)

### Bug Fixes

- **cozy-sharing:** Lint command ([3d6474a](https://github.com/cozy/cozy-libs/commit/3d6474a857f51ee604e049a85c277482ab7d1756))

### Features

- **cozy-sharing:** Add rename feature to shared drive ([a0eb9ae](https://github.com/cozy/cozy-libs/commit/a0eb9ae336fe45888e05b078625ea9d14525cd48))

## [27.1.4](https://github.com/cozy/cozy-libs/compare/cozy-sharing@27.1.3...cozy-sharing@27.1.4) (2025-12-04)

**Note:** Version bump only for package cozy-sharing

## [27.1.3](https://github.com/cozy/cozy-libs/compare/cozy-sharing@27.1.2...cozy-sharing@27.1.3) (2025-12-04)

**Note:** Version bump only for package cozy-sharing

## [27.1.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@27.1.1...cozy-sharing@27.1.2) (2025-12-04)

**Note:** Version bump only for package cozy-sharing

## [27.1.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@27.1.0...cozy-sharing@27.1.1) (2025-11-27)

### Bug Fixes

- **cozy-sharing:** Fix shared drive write access display for recipients ([3f2eaa2](https://github.com/cozy/cozy-libs/commit/3f2eaa25c3a2023f92040c98e972cdfa6e277133))

# [27.1.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@27.0.6...cozy-sharing@27.1.0) (2025-11-25)

### Features

- Enhance sharing logic to retain shared drives without recipients ([ab91186](https://github.com/cozy/cozy-libs/commit/ab911869e5f49aafaf5ca16b3323bd9826072b35))

## [27.0.6](https://github.com/cozy/cozy-libs/compare/cozy-sharing@27.0.5...cozy-sharing@27.0.6) (2025-11-14)

### Bug Fixes

- Update create cozy link ([bb8fad8](https://github.com/cozy/cozy-libs/commit/bb8fad8c9af3e247e364d82103e4a12ee688e1fa))

## [27.0.5](https://github.com/cozy/cozy-libs/compare/cozy-sharing@27.0.4...cozy-sharing@27.0.5) (2025-11-13)

**Note:** Version bump only for package cozy-sharing

## [27.0.4](https://github.com/cozy/cozy-libs/compare/cozy-sharing@27.0.3...cozy-sharing@27.0.4) (2025-11-13)

**Note:** Version bump only for package cozy-sharing

## [27.0.3](https://github.com/cozy/cozy-libs/compare/cozy-sharing@27.0.2...cozy-sharing@27.0.3) (2025-11-05)

**Note:** Version bump only for package cozy-sharing

## [27.0.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@27.0.1...cozy-sharing@27.0.2) (2025-11-05)

**Note:** Version bump only for package cozy-sharing

## [27.0.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@27.0.0...cozy-sharing@27.0.1) (2025-11-05)

**Note:** Version bump only for package cozy-sharing

# [27.0.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@26.8.1...cozy-sharing@27.0.0) (2025-10-30)

### Features

- Forgot to create BC when adding `cozy-ui-plus` in some packages ([3a14a14](https://github.com/cozy/cozy-libs/commit/3a14a14122618ad1ec3a1ba5d6b217a9c827c925))

### BREAKING CHANGES

- You must have `cozy-ui-plus >= 1.2.0`

## [26.8.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@26.8.0...cozy-sharing@26.8.1) (2025-10-30)

**Note:** Version bump only for package cozy-sharing

# [26.8.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@26.7.2...cozy-sharing@26.8.0) (2025-10-30)

### Features

- Add `cozy-ui-plus` to replace `cozy-ui` components c90db9 ([789c60f](https://github.com/cozy/cozy-libs/commit/789c60f260cc090b31aa0bf13770d18f0813f670))

## [26.7.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@26.7.1...cozy-sharing@26.7.2) (2025-10-30)

**Note:** Version bump only for package cozy-sharing

## [26.7.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@26.7.0...cozy-sharing@26.7.1) (2025-10-29)

**Note:** Version bump only for package cozy-sharing

# [26.7.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@26.6.2...cozy-sharing@26.7.0) (2025-10-28)

### Features

- Change signup link in public banner :sparkles: ([52c7dc0](https://github.com/cozy/cozy-libs/commit/52c7dc000b9455164a2d977de8aa64c6dd7cc41c))

## [26.6.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@26.6.1...cozy-sharing@26.6.2) (2025-10-20)

### Bug Fixes

- Bind fetchAllSharings before state init in SharingProvider 🐛 ([df12219](https://github.com/cozy/cozy-libs/commit/df12219852b473867e37788e74b442c792060cc8))

## [26.6.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@26.6.0...cozy-sharing@26.6.1) (2025-10-15)

### Bug Fixes

- Change the way to check write access of shared drive :bug: ([e75c3ba](https://github.com/cozy/cozy-libs/commit/e75c3ba6ba044639b4ab13021067e15649ecc864))

# [26.6.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@26.5.2...cozy-sharing@26.6.0) (2025-10-09)

### Features

- Toggle sharing deadline by flag :sparkles: ([69436d1](https://github.com/cozy/cozy-libs/commit/69436d1eab1f76c22c5bb5e2fed56eac31ba558e))

## [26.5.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@26.5.1...cozy-sharing@26.5.2) (2025-10-07)

### Bug Fixes

- Check correct sharing rule in shared drive :bug: ([6dc7dad](https://github.com/cozy/cozy-libs/commit/6dc7dadf1192912563c656050606c18379a7bdcc))

## [26.5.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@26.5.0...cozy-sharing@26.5.1) (2025-10-06)

### Bug Fixes

- Handle missing owner in SharingDetailsModal :bug: ([6ce20bf](https://github.com/cozy/cozy-libs/commit/6ce20bf77390f0773ffaf831b060fd89fcf8bd9b))

# [26.5.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@26.4.0...cozy-sharing@26.5.0) (2025-10-06)

### Features

- Add onRevokeSuccess callback :sparkles: ([3845ace](https://github.com/cozy/cozy-libs/commit/3845aced0e3cf365ffbc183bb5c5cf894b04e667))

# [26.4.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@26.3.0...cozy-sharing@26.4.0) (2025-09-25)

### Features

- Upgrade peerDep for flags and sharing ([4bb85b9](https://github.com/cozy/cozy-libs/commit/4bb85b94fafb5937beb9e1515a71f60fe7cbca2f))

# [26.3.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@26.2.1...cozy-sharing@26.3.0) (2025-09-24)

### Features

- **cozy-sharing:** Add ru and vi locales ([01e74e3](https://github.com/cozy/cozy-libs/commit/01e74e376ccb2156e5f565ad6e41156e6ef079f4))

## [26.2.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@26.2.0...cozy-sharing@26.2.1) (2025-09-23)

### Bug Fixes

- **sharing:** Sharing suggestions now pops over the dialog container ([c7338a7](https://github.com/cozy/cozy-libs/commit/c7338a7cab5bd7c32a6c74801be9a4664b0ee465))

# [26.2.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@26.1.1...cozy-sharing@26.2.0) (2025-09-18)

### Features

- **sharing:** Add isSharedDrive selector ([50212d4](https://github.com/cozy/cozy-libs/commit/50212d4f88976633bb6d26830e759887ed593cc1))
- **sharing:** Add shared drive edit modal ([112ba42](https://github.com/cozy/cozy-libs/commit/112ba429876edc9a57884b55352126a6e29786e4))
- **sharing:** Allow shared drive modal to hide some inputs ([7a312d1](https://github.com/cozy/cozy-libs/commit/7a312d14743d1c1bfd70d15618615e75ce875274))
- **sharing:** Display good wording when removing access in a ([d78eb48](https://github.com/cozy/cozy-libs/commit/d78eb481918bb97ee771b7e65b130854994317c4))
- **sharing:** Properly display readonly for shared drives recipients ([cb18bd5](https://github.com/cozy/cozy-libs/commit/cb18bd506e1352875781f2585ca3d33a6aaae098))
- **sharing:** Save shared drive title in description during creation ([52a82ad](https://github.com/cozy/cozy-libs/commit/52a82ad7e7eadfa4306fc5836f497a5ec91074f5))

## [26.1.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@26.1.0...cozy-sharing@26.1.1) (2025-09-15)

### Bug Fixes

- Remove black background in add recipient input :bug: ([07643c2](https://github.com/cozy/cozy-libs/commit/07643c27d4dcf8828c8dc4b2c4a75c8fcc431032))

# [26.1.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@26.0.1...cozy-sharing@26.1.0) (2025-09-09)

### Features

- Dedup classnames package ([6ac12d3](https://github.com/cozy/cozy-libs/commit/6ac12d3be9ec9ec1b8ceb90b2b6826ef650d48f9))
- Dedup lodash package ([93ebfd0](https://github.com/cozy/cozy-libs/commit/93ebfd010456639ec94552fc5bb7e6790811cf56))

## [26.0.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@26.0.0...cozy-sharing@26.0.1) (2025-09-05)

**Note:** Version bump only for package cozy-sharing

# [26.0.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@25.7.2...cozy-sharing@26.0.0) (2025-09-04)

### Features

- **cozy-sharing:** Update packages ([41c4a07](https://github.com/cozy/cozy-libs/commit/41c4a073a5fc6f9aefe3078ac21a62ff2d2a1f0d))

### BREAKING CHANGES

- **cozy-sharing:** cozy-sharing requires `cozy-client` >= 60.5.0,
  `cozy-ui` >= 128.3.5

## [25.7.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@25.7.1...cozy-sharing@25.7.2) (2025-08-19)

### Bug Fixes

- Resolve creating shared drive issue :bug: ([d6574ac](https://github.com/cozy/cozy-libs/commit/d6574ac7c75b4da8da1e67554df175d7031eb5b2))

## [25.7.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@25.7.0...cozy-sharing@25.7.1) (2025-07-30)

### Bug Fixes

- Correct link in clipboard when sharing an album ([b56a93c](https://github.com/cozy/cozy-libs/commit/b56a93c43d15a186aa1c26e382d30491b148f255))

# [25.7.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@25.6.0...cozy-sharing@25.7.0) (2025-07-16)

### Features

- Improve sharings retrieval performances ([87c99e0](https://github.com/cozy/cozy-libs/commit/87c99e07a427de1557120a8c3d03de573487a92d))
- Upgrade cozy-client for param ([b612543](https://github.com/cozy/cozy-libs/commit/b6125435b03f56d27090b8c32274bf0da560d8d4))

# [25.6.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@25.5.0...cozy-sharing@25.6.0) (2025-06-18)

### Features

- Remove shared drive description in modal ([c5d430d](https://github.com/cozy/cozy-libs/commit/c5d430dbf2c9ce777dfba2e9afa8d88d3540347b))
- Remove shared drive illustration in modal ([e7bd6cd](https://github.com/cozy/cozy-libs/commit/e7bd6cdf48b70dd40d12995f36f0b68d21bc04e7))
- Update shared drive modal style and wording ([75231f0](https://github.com/cozy/cozy-libs/commit/75231f0689053cc6653082f534148f01ae147567))

# [25.5.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@25.4.0...cozy-sharing@25.5.0) (2025-06-18)

### Features

- Replace Cozy by Twake in locales ([5633122](https://github.com/cozy/cozy-libs/commit/5633122f343e9d14f1120c039cea6a16e7d020ef))

# [25.4.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@25.3.1...cozy-sharing@25.4.0) (2025-05-14)

### Features

- Replace `isTwakeTheme` by truthy condition ([3a54804](https://github.com/cozy/cozy-libs/commit/3a54804decee80ed2a39b8d9910bd879df1e9473))

## [25.3.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@25.3.0...cozy-sharing@25.3.1) (2025-05-07)

### Bug Fixes

- Do not rely on attributes ([a77602c](https://github.com/cozy/cozy-libs/commit/a77602cfbbce6b08296578b12863c631251f99a4))

# [25.3.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@25.2.0...cozy-sharing@25.3.0) (2025-04-28)

### Features

- Allow to hide cozy to cozy sharing with a flag ([3836c83](https://github.com/cozy/cozy-libs/commit/3836c837713f3122b8657b4cff8a9274c7d949ed))
- Enable again avatar display from cozy-stack ([9d716ab](https://github.com/cozy/cozy-libs/commit/9d716ab8eb64e0254386e1c572317a9f49fe21db))

# [25.2.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@25.1.1...cozy-sharing@25.2.0) (2025-04-22)

### Features

- Update help link ([6302ed2](https://github.com/cozy/cozy-libs/commit/6302ed27ef865ed8a6e3c8854931285764abcbc1))
- Update Twake wording in sharing banner ([ff4cb07](https://github.com/cozy/cozy-libs/commit/ff4cb07ddb52893c65af46d3d18c9b73b4de4ec7))

## [25.1.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@25.1.0...cozy-sharing@25.1.1) (2025-04-02)

### Bug Fixes

- **Sharing:** Don't rely anymore on parent to show file recipients ([2e9702e](https://github.com/cozy/cozy-libs/commit/2e9702e3cd2e3863b06cef8e1c497882ba34eff3))

# [25.1.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@25.0.0...cozy-sharing@25.1.0) (2025-03-25)

### Bug Fixes

- Missing translation ([a5d0464](https://github.com/cozy/cozy-libs/commit/a5d0464e09a1be6027b94d1d2ab9a965422f236d))

### Features

- Dynamic title in BoxEditingRights ([909cdc4](https://github.com/cozy/cozy-libs/commit/909cdc417015c66e2e2d52ee5fb665f739b74dbf))

# [25.0.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@24.0.0...cozy-sharing@25.0.0) (2025-03-17)

### Features

- **Sharing:** Replace legacy Avatars by modern Avatars ([480a092](https://github.com/cozy/cozy-libs/commit/480a0927521f818635022a74edf8a0b199b896a9))
- **Sharing:** Upgrade cozy-ui ([732cde5](https://github.com/cozy/cozy-libs/commit/732cde5537c3c1142352c806c3af9b6e7b5d9031))

### BREAKING CHANGES

- **Sharing:** You must have `cozy-ui >= 121.1.1`

# [24.0.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@23.2.0...cozy-sharing@24.0.0) (2025-03-12)

### Features

- **Sharing:** Adjust switch position ([4c72e95](https://github.com/cozy/cozy-libs/commit/4c72e95916a5dc3f3ce24e71196ac50d4c232610))
- **Sharing:** Upgrade cozy-ui ([9bf395a](https://github.com/cozy/cozy-libs/commit/9bf395a1db38f213a30dc9346578f592a33f7228))

### BREAKING CHANGES

- **Sharing:** You must have `cozy-ui >= 119.2.0`

# [23.2.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@23.1.0...cozy-sharing@23.2.0) (2025-03-12)

### Features

- Replace sprite icons by svgr ([a7f2d16](https://github.com/cozy/cozy-libs/commit/a7f2d16cd1f3471c9aefe18b0403483f74fc26a5))

# [23.1.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@23.0.0...cozy-sharing@23.1.0) (2025-03-11)

### Features

- Add @babel/cli in devDep for some packages ([89e3a41](https://github.com/cozy/cozy-libs/commit/89e3a4156ba5867c9c20642d14e63b14bf992217))

# [23.0.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@22.0.0...cozy-sharing@23.0.0) (2025-03-11)

### Features

- **Sharing:** Remove image avatar from stack ([904efbc](https://github.com/cozy/cozy-libs/commit/904efbca5855fef7d3cd23ffcbefd64810cdec26))
- **Sharing:** Upgrade cozy-ui 116.0.0 to 119.0.1 ([393ce80](https://github.com/cozy/cozy-libs/commit/393ce806fe726355b165c7130653bb33b2c371cc))

### BREAKING CHANGES

- **Sharing:** You must have `cozy-ui >= 119.0.1`

# [22.0.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@21.3.0...cozy-sharing@22.0.0) (2025-02-26)

### Features

- Upgrade cozy-client ([ccc4ece](https://github.com/cozy/cozy-libs/commit/ccc4ece2ae51fc6d0f4d207dc7023db0cf4942c1))

### BREAKING CHANGES

- You must have `cozy-client >=57.0.0`

# [21.3.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@21.2.2...cozy-sharing@21.3.0) (2025-02-26)

### Features

- Add a basic new shared drive modal ([a554807](https://github.com/cozy/cozy-libs/commit/a55480749600410871b74e3284f23f5d57d71605))
- Allow to create a shared drive in the share method ([c5efffe](https://github.com/cozy/cozy-libs/commit/c5efffee257519a4e83d74a4c263395239d5fd02))
- Allow to customize autosuggest submit label ([6b619df](https://github.com/cozy/cozy-libs/commit/6b619dffc96d020e3bc031a73f3c622afdd77343))
- Allow to disable notifications on contact selection ([a62e48d](https://github.com/cozy/cozy-libs/commit/a62e48db450620bb42e9d5e568fdc861ee6a0650))
- Display notification and close modal on shared drive creation ([10bff21](https://github.com/cozy/cozy-libs/commit/10bff21516fa3159ce04e15c332044fe462636cc))
- Manage changing permissions in NewSharedDriveModal ([9aba037](https://github.com/cozy/cozy-libs/commit/9aba0371d9d3a993523a5d6968eac7c4d9d1ec3f))

## [21.2.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@21.2.1...cozy-sharing@21.2.2) (2025-02-04)

### Bug Fixes

- **Sharing:** Show all share recipients in the “who has access” modal ([8669e6b](https://github.com/cozy/cozy-libs/commit/8669e6b8d8650bbd6645a9be94db403121059e70))
- **Sharing:** Show correct sharing status by user ([55f5a43](https://github.com/cozy/cozy-libs/commit/55f5a43ca5426da991ab76c7f96faa6ccae00a11))

### Reverts

- Revert "fix(Sharing): Show correct sharing status by user" ([547a458](https://github.com/cozy/cozy-libs/commit/547a458b1dc4cb64724345c753eff153f7830a8a))

## [21.2.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@21.2.0...cozy-sharing@21.2.1) (2025-01-28)

**Note:** Version bump only for package cozy-sharing

# [21.2.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@21.1.0...cozy-sharing@21.2.0) (2025-01-23)

### Features

- Remove unused forwardFile ([dbc6aa8](https://github.com/cozy/cozy-libs/commit/dbc6aa8b5e642cdc0b7b626ff9ec91713ffdc7c1))

# [21.1.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@21.0.0...cozy-sharing@21.1.0) (2025-01-23)

### Bug Fixes

- **sharing:** Fix SharingBannerCozyToCozy propTypes ([1c28e60](https://github.com/cozy/cozy-libs/commit/1c28e60acc2352f75433b67d23ddb2d25b276183))

### Features

- **sharing:** Rename prop of createCozySharingLink action ([cbfb7c9](https://github.com/cozy/cozy-libs/commit/cbfb7c9f179f7396841257f5ad09be7f61ad725d))

# [21.0.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@20.0.0...cozy-sharing@21.0.0) (2025-01-23)

### Features

- **sharing:** Add new links to `useSharingInfos` ([e9e51f7](https://github.com/cozy/cozy-libs/commit/e9e51f773698ea72af5aca218c65b597c4f918c7))
- **sharing:** Replace `openSharingLink` with 3 new actions ([9150b33](https://github.com/cozy/cozy-libs/commit/9150b33f7ef3cd55b986dffedd768f00408674dd))
- **sharing:** Update PublicBanner with new addSharingLink ([3be70fe](https://github.com/cozy/cozy-libs/commit/3be70fef1780806584cba1f07daaf0ebcd9596c7))

### BREAKING CHANGES

- **sharing:** We now need 3 separate actions to Cozy to Cozy sharing.
  Replace the `openSharingLink` action with the desired
  action with its link option

Example:

```
import {
  addToCozySharingLink,
  syncToCozySharingLink,
  useSharingInfos
} from 'cozy-sharing'

const { addSharingLink, syncSharingLink } = useSharingInfos()

const actions = makeActions(
  [
    addToCozySharingLink,
    syncToCozySharingLink
  ],
  {
    addSharingLink,
    syncSharingLink
  }
)
```

# [20.0.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@19.0.0...cozy-sharing@20.0.0) (2025-01-22)

### Bug Fixes

- **sharing:** Dispatch correct value ([4f2d17c](https://github.com/cozy/cozy-libs/commit/4f2d17cec7ce51fae97c825e3bb605c204dff330))

### Features

- **sharing:** Auto focus password input ([614da3c](https://github.com/cozy/cozy-libs/commit/614da3cceae6f207ced87ae0bc81886224c83a24))
- **sharing:** Change ShareRestrictionModal validity ([00fb730](https://github.com/cozy/cozy-libs/commit/00fb730160e7f80ea57f6ebf7f47afadff9c0945))
- **sharing:** Improve BoxPassword ([7e39d7f](https://github.com/cozy/cozy-libs/commit/7e39d7fe16c021c9902a905f7dbdba92b2787eaf))
- **sharing:** Improve ShareDialogOnlyByLink UX ([4287e74](https://github.com/cozy/cozy-libs/commit/4287e74dc32aa7541e861939c4405a20426640e6))
- **sharing:** Rework logic of ShareRestrictionModal ([e33df9f](https://github.com/cozy/cozy-libs/commit/e33df9f5bb737dab6db738b435d2d0492698c8e9))
- **sharing:** Upgrade cozy-client to 53.0.0 ([fd6294f](https://github.com/cozy/cozy-libs/commit/fd6294f0870499a928795a73f099f3885e090a0a))

### BREAKING CHANGES

- **sharing:** You must have `cozy-client >= 53.0.0`

# [19.0.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@18.0.0...cozy-sharing@19.0.0) (2025-01-08)

### Bug Fixes

- **sharing:** Update propTypes ([0474d9c](https://github.com/cozy/cozy-libs/commit/0474d9c46344b1f7abf65fc6e419a25aef33d2ed))

### Features

- **sharing:** Add 3 actions to use the new action menu ([1af8fa7](https://github.com/cozy/cozy-libs/commit/1af8fa7dbffad63d117149d14e09399e9d71a8a6))
- **sharing:** Add missing devDeps ([5221b40](https://github.com/cozy/cozy-libs/commit/5221b40397935538e95dcec82c939fb22196c991))
- **sharing:** Add needed packages ([36a2b67](https://github.com/cozy/cozy-libs/commit/36a2b6771275a35b3ab484b22a18b6d9c7b61496))
- **sharing:** Add ShareRestrictionModal component ([df5ed28](https://github.com/cozy/cozy-libs/commit/df5ed28c7c7f5dbb339bf26d563e8ffd825a686f))
- **sharing:** Add the 3 boxes of the new link-sharing modal ([a297d20](https://github.com/cozy/cozy-libs/commit/a297d20c46966c82447491a6fefe2d96509c45a9))
- **sharing:** Move revoke action to a secondary button ([83d3738](https://github.com/cozy/cozy-libs/commit/83d3738220e2c02ed749a08a47f92ca08ce9feb7))
- **sharing:** Remove EditLinkPermissionDialog ([1b8bd56](https://github.com/cozy/cozy-libs/commit/1b8bd560f4e72b885817f1f17a83156b6c1a7d58))
- **sharing:** Remove useless props ([cc3f816](https://github.com/cozy/cozy-libs/commit/cc3f816b6d35deb619488495bb767e1d76b557de))
- **sharing:** Replace old sharing link menu with the new modal ([de1a1c2](https://github.com/cozy/cozy-libs/commit/de1a1c27a5747c0b8bf091ed1856994f65cdcdb2))
- **sharing:** Upgrade packages ([9a1312d](https://github.com/cozy/cozy-libs/commit/9a1312d43cba1dcd521e8d6502865ac2071535cf))
- **sharing:** Use ShareRestrictionModal when creating share link ([248c3b4](https://github.com/cozy/cozy-libs/commit/248c3b4904649e17e935afdef1bd2a0b87082dc7))

### BREAKING CHANGES

- **sharing:** You muse have `cozy-client >= 52.1.0` and `cozy-ui >= 116.0.0`

# [18.0.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@17.0.0...cozy-sharing@18.0.0) (2024-12-23)

### Features

- **cozy-sharing:** Remove Enzyme tests ([0c678a1](https://github.com/cozy/cozy-libs/commit/0c678a1a096966db9baf5311b99964fc458ce8dc))
- **cozy-sharing:** Replace jsdom-sixteen package ([b75bc51](https://github.com/cozy/cozy-libs/commit/b75bc51a8d2cbfa0300e5c9fc5f0d839dea24ef2))
- **cozy-sharing:** Upgrade cozy-ui to 115.0.2 ([f25a351](https://github.com/cozy/cozy-libs/commit/f25a351df58ed0517f35ec4fef7c9044ceac6d56))

### BREAKING CHANGES

- **cozy-sharing:** You must have `cozy-ui >= 115.0.2` & `cozy-client >= 51.6.1`

# [17.0.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@16.17.0...cozy-sharing@17.0.0) (2024-12-18)

### Features

- Add NativeFileSharingProvider and shareNative action ([71ba4e1](https://github.com/cozy/cozy-libs/commit/71ba4e120a5518534867cd1f1541502652f9b979))

### BREAKING CHANGES

- you now need cozy-intent >=2.29.1
  and cozy-device-helper >= 3.7.1 with cozy-sharing

# [16.17.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@16.16.0...cozy-sharing@16.17.0) (2024-12-12)

### Features

- **cozy-sharing:** Add isShortLabel prop to OpenSharing's buttons ([1085567](https://github.com/cozy/cozy-libs/commit/108556765800f6972a6b4c801fa09fd7c5d08c65))

# [16.16.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@16.15.1...cozy-sharing@16.16.0) (2024-12-12)

### Features

- **cozy-sharing:** Add conditionnal prop to openSharingLink action ([ec2a8be](https://github.com/cozy/cozy-libs/commit/ec2a8be595215745e85ae0cc1e9b7493e2c5b8a4))

## [16.15.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@16.15.0...cozy-sharing@16.15.1) (2024-12-11)

### Bug Fixes

- **cozy-sharing:** Do not display loader in public context ([71ff258](https://github.com/cozy/cozy-libs/commit/71ff25879d4d98dbde49035a6f1be5eb687b1500))

# [16.15.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@16.14.0...cozy-sharing@16.15.0) (2024-12-10)

### Features

- **cozy-sharing:** Upgrade cozy-ui to 113.9.0 ([a6943b0](https://github.com/cozy/cozy-libs/commit/a6943b096173cad242f16d10e95236ec81ea14b3))

# [16.14.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@16.13.0...cozy-sharing@16.14.0) (2024-12-10)

### Features

- Remove notes.sharing-cozy-to-cozy flag ([f6fa190](https://github.com/cozy/cozy-libs/commit/f6fa1907ea97c0214c2f0cd3e196e7a1177a03ca))

# [16.13.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@16.12.0...cozy-sharing@16.13.0) (2024-12-06)

### Features

- Use Sharing locales instead apps ([55265c9](https://github.com/cozy/cozy-libs/commit/55265c9366e8ee98664503a6a62500e4ec986606))

# [16.12.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@16.11.0...cozy-sharing@16.12.0) (2024-12-06)

### Features

- Add openSharingLink action ([de97967](https://github.com/cozy/cozy-libs/commit/de979676b43ab73e412683895437f108740ab5e2))
- Add OpenSharingLinkButton & OpenSharingLinkFabButton components ([ffc603c](https://github.com/cozy/cozy-libs/commit/ffc603c798954b5ebffb4a860c82f231765bda8d))
- Upgrade cozy-ui to 113.5.0 ([9bbd797](https://github.com/cozy/cozy-libs/commit/9bbd797056e085f00d1d867641abb12695fbf52b))

# [16.11.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@16.10.0...cozy-sharing@16.11.0) (2024-12-05)

### Features

- **Sharing:** Expose new component to show owner recipient ([bcc6302](https://github.com/cozy/cozy-libs/commit/bcc6302abf0190259e86a9d327aa0d46e39b693b))

# [16.10.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@16.9.0...cozy-sharing@16.10.0) (2024-12-05)

### Features

- **Sharing:** Add isPublic prop to SharingProvider ([d08862d](https://github.com/cozy/cozy-libs/commit/d08862d65fd4caaabfd29f116ade0607528345a9))

# [16.9.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@16.8.0...cozy-sharing@16.9.0) (2024-12-04)

### Features

- **Sharing:** Change style of PublicBanner wording ([ddc8ce3](https://github.com/cozy/cozy-libs/commit/ddc8ce3cfcb1e3cfbdf17f5a7b8d9c8da997b5b0))

# [16.8.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@16.7.0...cozy-sharing@16.8.0) (2024-12-02)

### Features

- **Sharing:** Expose too new component to get recipients ([a5836f7](https://github.com/cozy/cozy-libs/commit/a5836f7ea3634de44689b4e6c34eeac9b5fcb731))

# [16.7.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@16.6.1...cozy-sharing@16.7.0) (2024-11-26)

### Features

- Update text to CozyToCozy public banner ([3bd6ea6](https://github.com/cozy/cozy-libs/commit/3bd6ea61e712a763726c5c379e79bba549012a9c))

## 16.6.1 (2024-11-06)

### Bug Fixes

- Rename cozy-dataproxy to cozy-dataproxy-lib ([635d421](https://github.com/cozy/cozy-libs/commit/635d421045fc0374ca88cd68ec4941c95c40a0dd))

# 16.6.0 (2024-11-06)

### Features

- Upgrade cozy-client and cozy-pouch-link ([67f5241](https://github.com/cozy/cozy-libs/commit/67f5241754e0472a991dad3e5fafd0b1c5edb9c6)), closes [cozy/cozy-client#1553](https://github.com/cozy/cozy-client/issues/1553) [cozy/cozy-client#1556](https://github.com/cozy/cozy-client/issues/1556)

# 16.5.0 (2024-11-06)

### Features

- **cozy-devtools:** Remove logs and use hook to get `client` ([df87cf5](https://github.com/cozy/cozy-libs/commit/df87cf500edacae42c55c4bbf710fa2e55ea8ba3))

# 16.4.0 (2024-11-06)

### Features

- **cozy-devtools:** Add first version to test providers ([5689640](https://github.com/cozy/cozy-libs/commit/568964008bb657dfaf8038ac2d9fa3dca8d3eb1c))

## 16.3.1 (2024-11-05)

**Note:** Version bump only for package cozy-sharing

# 16.3.0 (2024-10-30)

### Features

- Update deps for cozy-viewer ([b2e103a](https://github.com/cozy/cozy-libs/commit/b2e103a1280182881ae1133860c0a09650271920))

# 16.2.0 (2024-10-30)

### Features

- Download file on mobile viewer on press ([3c38062](https://github.com/cozy/cozy-libs/commit/3c38062e2c83d5b8f7d0065323c18d45b5ce9564))

# 16.1.0 (2024-10-25)

### Features

- **Viewer:** Replace Encrypted provider by cozy-ui one ([aa81d02](https://github.com/cozy/cozy-libs/commit/aa81d02f0a70de8044f704cbd895b1d54c9f38b8))

## 16.0.3 (2024-10-23)

**Note:** Version bump only for package cozy-sharing

## 16.0.2 (2024-10-16)

**Note:** Version bump only for package cozy-sharing

## [16.0.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@16.0.0...cozy-sharing@16.0.1) (2024-10-15)

**Note:** Version bump only for package cozy-sharing

# [16.0.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@15.0.4...cozy-sharing@16.0.0) (2024-09-23)

### Features

- **sharing:** Upgrade packages ([c2acd41](https://github.com/cozy/cozy-libs/commit/c2acd41fbac71ab80071201a23c4c8797c10346e))

### BREAKING CHANGES

- **sharing:** you must have `cozy-ui >= 111.12.0 and cozy-client >= 48.25.0`

## [15.0.4](https://github.com/cozy/cozy-libs/compare/cozy-sharing@15.0.3...cozy-sharing@15.0.4) (2024-09-09)

**Note:** Version bump only for package cozy-sharing

## [15.0.3](https://github.com/cozy/cozy-libs/compare/cozy-sharing@15.0.2...cozy-sharing@15.0.3) (2024-08-28)

### Bug Fixes

- **AvatarList:** Add spacing at the end ([b30c888](https://github.com/cozy/cozy-libs/commit/b30c88804aafcab636995a770f46bee8d47d6470))

## [15.0.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@15.0.1...cozy-sharing@15.0.2) (2024-07-11)

**Note:** Version bump only for package cozy-sharing

## [15.0.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@15.0.0...cozy-sharing@15.0.1) (2024-06-12)

**Note:** Version bump only for package cozy-sharing

# [15.0.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@14.1.0...cozy-sharing@15.0.0) (2024-06-06)

### Features

- **sharing:** Upgrade packages ([5bedfcc](https://github.com/cozy/cozy-libs/commit/5bedfcce4814f50e5f23b451a407c8170c77b1c2))

### BREAKING CHANGES

- **sharing:** you must have `cozy-client >= 47.6.0` and `cozy-ui => 108.0.0`

# [14.1.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@14.0.0...cozy-sharing@14.1.0) (2024-06-05)

### Features

- Adjust color of recipient avatar border ([55cf911](https://github.com/cozy/cozy-libs/commit/55cf911400aa7a9e269ef1e395dd1b3e80c9edf8))

# [14.0.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@13.3.1...cozy-sharing@14.0.0) (2024-05-28)

### Features

- Replace deprecated buttons by actual ones ([6be1c73](https://github.com/cozy/cozy-libs/commit/6be1c734cc4fcb13ffc2dd1137edec064c0c842e))
- Replace direct import of palette by colors or variables colors ([4dc9eb7](https://github.com/cozy/cozy-libs/commit/4dc9eb7d56b875acb156eeef037b252237c2cfa5))
- **sharing:** Replace var colors by semantic var colors ([79c2e70](https://github.com/cozy/cozy-libs/commit/79c2e70430f64973e38d40ea215a23be2ca3a2a0))
- **sharing:** Upgrade cozy-ui 105.3.1 to 106.8.0 ([b731089](https://github.com/cozy/cozy-libs/commit/b731089dc71325bb80d9cb2687583516596f2b8a))

### BREAKING CHANGES

- **sharing:** you must have `cozy-ui >= 106.8.0`

## [13.3.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@13.3.0...cozy-sharing@13.3.1) (2024-05-27)

### Bug Fixes

- **sharing:** Improve size inside recipient list ([747605a](https://github.com/cozy/cozy-libs/commit/747605a944e740bdea32b07d0199df17abc75fb0))

# [13.3.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@13.2.0...cozy-sharing@13.3.0) (2024-05-02)

### Features

- **share:** Manage the case of a contact that is already in ([7c979af](https://github.com/cozy/cozy-libs/commit/7c979af7efebd906e45f1e83b43414bf2cb5b984))

# [13.2.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@13.1.2...cozy-sharing@13.2.0) (2024-04-18)

### Bug Fixes

- Only show add email suggestion when we can't send an email ([9212597](https://github.com/cozy/cozy-libs/commit/92125976900b939e985330682f9375ce22f2ab42))

### Features

- Allow to add empty group ([a16f535](https://github.com/cozy/cozy-libs/commit/a16f535008a4dbe9426ee026acdbd413280585dd))

## [13.1.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@13.1.1...cozy-sharing@13.1.2) (2024-04-17)

### Bug Fixes

- **GroupRecipientPermissions:** Missing document props ([f35471e](https://github.com/cozy/cozy-libs/commit/f35471e61928969b22aa07766823aac944d19aee))

## [13.1.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@13.1.0...cozy-sharing@13.1.1) (2024-04-15)

**Note:** Version bump only for package cozy-sharing

# [13.1.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@13.0.0...cozy-sharing@13.1.0) (2024-04-09)

### Bug Fixes

- Resetting sharing rights after a share ([5f3ebaa](https://github.com/cozy/cozy-libs/commit/5f3ebaa4b220655c97f07fa6918f2be830568fb5))

### Features

- Alert if group shared with members already in it with other rights ([786b1a0](https://github.com/cozy/cozy-libs/commit/786b1a08d9f30db3126e6d1b77c14f25b0f129a5))
- Hide groups when they are already shared ([f64ee06](https://github.com/cozy/cozy-libs/commit/f64ee06637c0f74b776cde72bdea9ae693c26638))

# [13.0.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@12.3.0...cozy-sharing@13.0.0) (2024-04-08)

### Bug Fixes

- **GroupRecipientDetail:** Improve member display ([2bb65cf](https://github.com/cozy/cozy-libs/commit/2bb65cf5218781845a5587433952437b3c764b97))
- Improve secondary text of GroupRecipient ([d747f9c](https://github.com/cozy/cozy-libs/commit/d747f9c6ad30701c16b9f888d4aee7729a5fc28b))
- Remove translation error when there is no type like for owner ([830d5fa](https://github.com/cozy/cozy-libs/commit/830d5faaaea118189f574d6cec859ba361ee4cd5))
- **ShareAutosuggest:** Align correctly loading state ([9d93952](https://github.com/cozy/cozy-libs/commit/9d93952b1740c6974da0ced62bd81d1990311b40))
- Show all the members from a group even unreachable ones ([e62ec59](https://github.com/cozy/cozy-libs/commit/e62ec5980bcb037a2af28cb64d522abdc9fa0408))
- Show group avatar into share input ([632658a](https://github.com/cozy/cozy-libs/commit/632658af64a8b8f1bcd4ba72d9b0e563d9a8dfdd))
- Show permissions when the current user is inside members ([d28d4b4](https://github.com/cozy/cozy-libs/commit/d28d4b46938aafddb39884511e7859d800e953b8))

### Features

- Improve the message of success to integrate the notion of groups ([f0945b7](https://github.com/cozy/cozy-libs/commit/f0945b7e054a14d35e5d689f9db65c53df0286c6))
- **ShareRecipientsInput:** Simplify loading state ([e2ec136](https://github.com/cozy/cozy-libs/commit/e2ec136363df578bec338fde9336ac09ed573bb1))
- Update cozy-ui from 103.8.2 to 105.3.1 ([e1b21f8](https://github.com/cozy/cozy-libs/commit/e1b21f887fb55e5ddab7348f3f5fd41631318cdf))

### BREAKING CHANGES

- you must have `cozy-ui >= 105.3.1`

# [12.3.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@12.2.0...cozy-sharing@12.3.0) (2024-03-25)

### Features

- Add GroupAvatar into AvatarList ([1c66999](https://github.com/cozy/cozy-libs/commit/1c669995b08d84a3aa8d6dd950fa4abf22566395))

# [12.2.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@12.1.0...cozy-sharing@12.2.0) (2024-03-22)

### Features

- Allow to add group with only more than one member ([177dc4a](https://github.com/cozy/cozy-libs/commit/177dc4a4fbceefed1ce52f2a5275c67e46b6430f))

# [12.1.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@12.0.0...cozy-sharing@12.1.0) (2024-03-22)

### Features

- Adapt modal design to allow gutters into ListItem ([39dc590](https://github.com/cozy/cozy-libs/commit/39dc5905ee19e07967227e76d376ff04c6145c1e))
- Show detail of recipient groups ([7d731db](https://github.com/cozy/cozy-libs/commit/7d731db9d313ba763652612352ce393f475bfe5f))

# [12.0.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@11.1.0...cozy-sharing@12.0.0) (2024-03-21)

### Features

- Making it possible to revoke a group ([cc3e998](https://github.com/cozy/cozy-libs/commit/cc3e998d94450d0698373f217a4eea06d1a81ede))
- Update cozy-client from 45.14.0 to 46.1.0 ([958c55c](https://github.com/cozy/cozy-libs/commit/958c55c5d55a540d0c5b341b6780cb16b1617ff9))

### BREAKING CHANGES

- you must have `cozy-client >=46.1.0`

# [11.1.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@11.0.1...cozy-sharing@11.1.0) (2024-03-21)

### Features

- Add groups to recipients ([4be590d](https://github.com/cozy/cozy-libs/commit/4be590d8280fe9198fb56d32d2ff55665864e746))
- Add groups to recipients if flag ([4ac2199](https://github.com/cozy/cozy-libs/commit/4ac21990174d1312ee8d5b452e524db6c53429a9))
- Extract logic from onRecipientPick to an helper ([2d08da1](https://github.com/cozy/cozy-libs/commit/2d08da1fb5a767819d8d89bd3e59f8d9927cceea))
- **RecipientList:** Show recipient groups ([60d155c](https://github.com/cozy/cozy-libs/commit/60d155c53702782863a777c649e786deeb64a314))

## [11.0.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@11.0.0...cozy-sharing@11.0.1) (2024-03-12)

### Bug Fixes

- **sharing:** Handle memory leak in self removal ([f9a9384](https://github.com/cozy/cozy-libs/commit/f9a9384fabb8892e35be0a270452ee501bd6b1a6))

# [11.0.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@10.4.1...cozy-sharing@11.0.0) (2024-03-11)

### Bug Fixes

- Add missing args into stories ([3658ead](https://github.com/cozy/cozy-libs/commit/3658ead89344c20f59d4c8693522c73d40c20761))

### Code Refactoring

- Rename RecipientsAvatars into AvatarList ([abef583](https://github.com/cozy/cozy-libs/commit/abef5830bf774855e39e8cf0149e26b49f53a367))

### Features

- Add stories to recipient components ([b32f881](https://github.com/cozy/cozy-libs/commit/b32f881e031d61676097f94a2015227e99e1fb67))
- **sharing:** Add storybook ([fa7a028](https://github.com/cozy/cozy-libs/commit/fa7a0286ee18421ead00a061d9a1aa8f6d755978))

### BREAKING CHANGES

- If you were importing RecipientsAvatars directly you should now use `import { AvatarList as RecipientsAvatars } from 'cozy-sharing/dist/components/Avatar/AvatarList'`

## [10.4.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@10.4.0...cozy-sharing@10.4.1) (2024-03-01)

### Bug Fixes

- Remove scenario where sharingModal lose state ([43e583a](https://github.com/cozy/cozy-libs/commit/43e583a64855898c009972c52d66efc408c3d1d4))

# [10.4.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@10.3.0...cozy-sharing@10.4.0) (2024-02-29)

### Features

- **sharing:** Upgrade cozy-ui and cozy-client ([f09507c](https://github.com/cozy/cozy-libs/commit/f09507c6cdd89ec9907f60cd50310a498bcd984f))

# 10.3.0 (2024-02-29)

### Features

- **mespapiers:** Add information step for custom name to fidelity card ([5f6fce7](https://github.com/cozy/cozy-libs/commit/5f6fce72e5374388bac369c9332ed47c303e945b))

# 10.2.0 (2024-02-01)

### Bug Fixes

- Use navigator.clipboard instead of copy-text-to-clipboard ([6727c26](https://github.com/cozy/cozy-libs/commit/6727c26eaa796735d51300756ff617f999cc56dd))

### Features

- Remove copy-text-to-clipboard package ([53e46c8](https://github.com/cozy/cozy-libs/commit/53e46c8dedf33cca5f3a13be6d9d230bfaffa335))

## [10.1.4](https://github.com/cozy/cozy-libs/compare/cozy-sharing@10.1.3...cozy-sharing@10.1.4) (2024-01-05)

**Note:** Version bump only for package cozy-sharing

## [10.1.3](https://github.com/cozy/cozy-libs/compare/cozy-sharing@10.1.2...cozy-sharing@10.1.3) (2024-01-05)

**Note:** Version bump only for package cozy-sharing

## [10.1.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@10.1.1...cozy-sharing@10.1.2) (2024-01-05)

**Note:** Version bump only for package cozy-sharing

## [10.1.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@10.1.0...cozy-sharing@10.1.1) (2023-12-21)

**Note:** Version bump only for package cozy-sharing

# 10.1.0 (2023-12-20)

### Features

- **mespapiers:** Replace spinner by skeletons on papers list ([2303501](https://github.com/cozy/cozy-libs/commit/230350100d4836fa3d9a50777f86252fef81e358))

## [10.0.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@10.0.0...cozy-sharing@10.0.1) (2023-10-31)

**Note:** Version bump only for package cozy-sharing

# [10.0.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@9.0.2...cozy-sharing@10.0.0) (2023-09-29)

### Features

- **cozy-sharing:** Update cozy-client from 37.0.0 to 40.5.0 ([7369f1d](https://github.com/cozy/cozy-libs/commit/7369f1d4f7a9e09088e35ab10c37728f425e0db9))
- **cozy-sharing:** Update cozy-ui from 88.2.1 to 93.1.1 ([94ba194](https://github.com/cozy/cozy-libs/commit/94ba194d2e4e79c3282a0ba2a496a6e9193d41b4))

### BREAKING CHANGES

- **cozy-sharing:** You need cozy-ui >= 93.1.1
- **cozy-sharing:** You need cozy-client >= 40.5.0

## [9.0.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@9.0.1...cozy-sharing@9.0.2) (2023-09-11)

### Bug Fixes

- BuildSharingLink works also for perm from mes papiers ([64980a8](https://github.com/cozy/cozy-libs/commit/64980a81c769168c927fd0348a320db60a48d1bb))

## [9.0.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@9.0.0...cozy-sharing@9.0.1) (2023-09-06)

### Bug Fixes

- Index only existing document after a realtime update ([f678ef7](https://github.com/cozy/cozy-libs/commit/f678ef71f658583b7c10bf0db853b550e24f15d9))

# 9.0.0 (2023-08-23)

### Features

- **harvest:** Update cozy-client from `38.6.0` to `40.2.0` ([8931b15](https://github.com/cozy/cozy-libs/commit/8931b15ba7b097bf829601d6042d5e522b7f2fd6))

### BREAKING CHANGES

- **harvest:** you must have `cozy-client >= 40.2.0`

# [8.3.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@8.2.0...cozy-sharing@8.3.0) (2023-07-28)

### Features

- Limit recipients by document ([f94eaa0](https://github.com/cozy/cozy-libs/commit/f94eaa010e284606dac3fb4f5c599f61e42ccf33))

# [8.2.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@8.1.0...cozy-sharing@8.2.0) (2023-07-26)

### Features

- Add useSharingContext ([cfe9346](https://github.com/cozy/cozy-libs/commit/cfe93462ce8730973f83d0cf3ef5a69233d67fd6))

# [8.1.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@8.0.1...cozy-sharing@8.1.0) (2023-07-25)

### Features

- Add a helper to get shared parent path ([1264371](https://github.com/cozy/cozy-libs/commit/1264371b6d29641e55d843c335c4b8d34a03c2d8))

## [8.0.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@8.0.0...cozy-sharing@8.0.1) (2023-07-18)

### Bug Fixes

- **sharing:** Use `.fetchQueryAndGetFromState` instead `.query` ([95d8f2d](https://github.com/cozy/cozy-libs/commit/95d8f2d43ccdd20a26f1f27d1060cace5f3f60a8)), closes [cozy/cozy-client#931](https://github.com/cozy/cozy-client/issues/931)

# 8.0.0 (2023-07-05)

### Features

- Display reconnection webview for powens konnectors ([a924d3e](https://github.com/cozy/cozy-libs/commit/a924d3e13524f211bc8ae45435a012b8e2125ed8))
- Update cozy-ui to 88 with codemods ([7ba4172](https://github.com/cozy/cozy-libs/commit/7ba41729ff1b67830fb131655434da61e40949a5))

### BREAKING CHANGES

- - you need to update cozy-ui to >=88.2.1

## [7.1.3](https://github.com/cozy/cozy-libs/compare/cozy-sharing@7.1.2...cozy-sharing@7.1.3) (2023-04-13)

**Note:** Version bump only for package cozy-sharing

## [7.1.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@7.1.1...cozy-sharing@7.1.2) (2023-04-05)

**Note:** Version bump only for package cozy-sharing

## [7.1.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@7.1.0...cozy-sharing@7.1.1) (2023-03-31)

**Note:** Version bump only for package cozy-sharing

# [7.1.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@7.0.3...cozy-sharing@7.1.0) (2023-03-29)

### Bug Fixes

- Use io.cozy.settings.instance full id to fix cache issues ([d27e6ac](https://github.com/cozy/cozy-libs/commit/d27e6ac022e2d40ea8fc25be563d74ab48a93e33))

### Features

- Update cozy-client to get SettingsCollection update and cozy-ui ([a8ac6cd](https://github.com/cozy/cozy-libs/commit/a8ac6cdf359a86ad6b0f17d76af97d9210129425))

## [7.0.3](https://github.com/cozy/cozy-libs/compare/cozy-sharing@7.0.2...cozy-sharing@7.0.3) (2023-03-21)

**Note:** Version bump only for package cozy-sharing

## [7.0.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@7.0.1...cozy-sharing@7.0.2) (2023-03-21)

**Note:** Version bump only for package cozy-sharing

## [7.0.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@7.0.0...cozy-sharing@7.0.1) (2023-03-17)

**Note:** Version bump only for package cozy-sharing

# [7.0.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@6.0.6...cozy-sharing@7.0.0) (2023-03-16)

### Features

- Return also readOnly status from getSharedDocument ([c68ba61](https://github.com/cozy/cozy-libs/commit/c68ba61b69dfd2b152e47252005f294fee818110))

### BREAKING CHANGES

- The function now returns the id encapsulated in an object. You can extract the id like this `const { id } = getSharedDocument(client)`

## 6.0.6 (2023-03-16)

**Note:** Version bump only for package cozy-sharing

## [6.0.5](https://github.com/cozy/cozy-libs/compare/cozy-sharing@6.0.4...cozy-sharing@6.0.5) (2023-03-07)

### Bug Fixes

- Display always instance address as secondary text for owner ([f6c89cf](https://github.com/cozy/cozy-libs/commit/f6c89cf54d723d695f0afe0a9fe9ab44f236376e))
- Display correctly owner recipient when receiving sharing ([49a1c5a](https://github.com/cozy/cozy-libs/commit/49a1c5ac6aa029be3217fef93ce3f7bce6e21019))

## [6.0.4](https://github.com/cozy/cozy-libs/compare/cozy-sharing@6.0.3...cozy-sharing@6.0.4) (2023-03-01)

### Bug Fixes

- Colors for shared withMe ([17795d5](https://github.com/cozy/cozy-libs/commit/17795d586dea2b1202e9215d8a9ab745fee37f55))

## [6.0.3](https://github.com/cozy/cozy-libs/compare/cozy-sharing@6.0.2...cozy-sharing@6.0.3) (2023-02-08)

**Note:** Version bump only for package cozy-sharing

## [6.0.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@6.0.1...cozy-sharing@6.0.2) (2023-02-06)

### Bug Fixes

- **SharingBanner:** Add custom previewPath ([4221243](https://github.com/cozy/cozy-libs/commit/42212432995d5e91511c85f31aef30a2dcf009aa))

## [6.0.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@6.0.0...cozy-sharing@6.0.1) (2023-02-02)

### Bug Fixes

- Recipient import path not updated in last update ([56b9cfd](https://github.com/cozy/cozy-libs/commit/56b9cfdab402813527982d0ddf857f1e963850b1))

# 6.0.0 (2023-01-31)

### Bug Fixes

- ActionMenu could not be closed after closing and reopening modal ([f9c638f](https://github.com/cozy/cozy-libs/commit/f9c638f11eec4c618985e70a6764c6c22c3ed0b0))
- Allow content to go full size in share by email select box ([6dc210e](https://github.com/cozy/cozy-libs/commit/6dc210edecefe7dbddc79c6b64a1b8b03797fdc0))
- Copy to clipboard when link is created ([517ce10](https://github.com/cozy/cozy-libs/commit/517ce10e76beee9067132a2323260c38fb3aec3e))
- Don't call PermissionCol.findApps ([08073da](https://github.com/cozy/cozy-libs/commit/08073da3271c906fd45e74928efe7e742ed7dc35)), closes [cozy/cozy-client#1293](https://github.com/cozy/cozy-client/issues/1293)
- Highlight again current suggestion in grey ([122491a](https://github.com/cozy/cozy-libs/commit/122491a75b8104e78a75587ec91579d1f2bbe6b1))
- Realtime order issue caused invalid recipient status ([8ec1f4b](https://github.com/cozy/cozy-libs/commit/8ec1f4b68298530241cd3119402a60c1f29cf6f5))
- Remove duplicate use of t causing translation warnings ([8aef46d](https://github.com/cozy/cozy-libs/commit/8aef46d3421d8506e2ee63d9952c0f2d7371e022))
- Remove pick on input blur when a suggestion is highlighted ([5f5cc21](https://github.com/cozy/cozy-libs/commit/5f5cc21eb7b4da6e116d18dd60c128a4d2525ed2))
- Update wording to see file/folder ([b815daa](https://github.com/cozy/cozy-libs/commit/b815daa7964437f4129d512867e5c3dc26022397))
- Use strategy: fixed in popper options to show overflow ([73b159a](https://github.com/cozy/cozy-libs/commit/73b159aa91fd4feb84b2377d10001774c30ad7df))

### Code Refactoring

- Move Recipient related components in a Recipient folder ([518bff1](https://github.com/cozy/cozy-libs/commit/518bff1748f9e8466203ec5f3152ac653253b439))

### Features

- Accept options argument in shareByLink function ([93d75d8](https://github.com/cozy/cozy-libs/commit/93d75d8cb80a630dd1160899015916fff9fc1828))
- Add "Who has access?" title in Dialog ([33cb6b3](https://github.com/cozy/cozy-libs/commit/33cb6b320220e239cc030c98729d984deae62ab8))
- Add and export DOCUMENT_TYPE constant ([959881a](https://github.com/cozy/cozy-libs/commit/959881a654d7605267914dde14d038877bfd412f))
- Add SynchronousJobQueue ([b654c40](https://github.com/cozy/cozy-libs/commit/b654c40c9f81a7931476bab82fe54033a24fbaf0))
- Add usePrevious hook ([32e4a26](https://github.com/cozy/cozy-libs/commit/32e4a2624fb8865c42209164f7fba66470ac19b2))
- Align horizontally share by email buttons on mobile ([bd212b6](https://github.com/cozy/cozy-libs/commit/bd212b61ab9ee40f97bd3386f93b1629727640e9))
- **ContactSuggestion:** Use ListItemText from cozy-ui ([2680feb](https://github.com/cozy/cozy-libs/commit/2680febce956d0b1cfdfbfa92bf7e7bc17208d87))
- Create sharing link after choosing permission in modal ([554b912](https://github.com/cozy/cozy-libs/commit/554b9120ee4396259c6d22107b2eaa1ee3a2b36c))
- Display only one button to copy link in desktop ([8ef090b](https://github.com/cozy/cozy-libs/commit/8ef090b91ab13f747b2190212006254686756d13))
- Display owner recipient everytime in WhoHasAccess list ([f680913](https://github.com/cozy/cozy-libs/commit/f6809138eff78d6c5a617840914387fea7d59b8e))
- Display share by email buttons only when recipients not empty ([139b6ad](https://github.com/cozy/cozy-libs/commit/139b6ad8fc0735565e7c5897bc8be1ff4c723c6b))
- Display sharing link in WhoHasAccess ([8eaa8ee](https://github.com/cozy/cozy-libs/commit/8eaa8ee5b313195e6334b920d0f349d381cb4827))
- Fade in recipient when link created or recipient added ([d6d84b0](https://github.com/cozy/cozy-libs/commit/d6d84b0c4c5b10243cb08760e6c6e5bf1bec17f1))
- Hide ShareByEmail controls when input not focused or empty ([7feb150](https://github.com/cozy/cozy-libs/commit/7feb1502ca755b7cea5df252f3333d327f8f1d2f))
- Improve spacing between Who has access title and components ([14d4619](https://github.com/cozy/cozy-libs/commit/14d46196435f1b96401317f903a8e74a27467372))
- Link icon in a circle in WhoHasAccess ([513efff](https://github.com/cozy/cozy-libs/commit/513efff434676dd3350797f80b56ad70bbcd5568))
- Modify share by link creation and edit ([56b2bb4](https://github.com/cozy/cozy-libs/commit/56b2bb465a42db4c4bda076d01375988d01db245))
- Prevent apps with only read only link to create read write link ([94094dd](https://github.com/cozy/cozy-libs/commit/94094ddc6afabf99dbc2ad231d23e430a1698756))
- Propose in autosuggest unknown email ([85ad899](https://github.com/cozy/cozy-libs/commit/85ad899cc4ce0d5611cc526a238878ba0f24c87c))
- Remove ShareByEmail label and update placeholder ([772dc5c](https://github.com/cozy/cozy-libs/commit/772dc5c2e04b090ce0fcf0f275aa1eba0c216eb4))
- **ShareAutosuggest:** Add Chip and keyboard delete mechanism ([b6edd71](https://github.com/cozy/cozy-libs/commit/b6edd713b925be2b3ea430c34bfe1012ae8b6751))
- Update and lowercase text in RecipientPermissions ([073c600](https://github.com/cozy/cozy-libs/commit/073c600affe7f6e5fcceefb69b4e34eb79f2fc17))
- Update cozy-client and cozy-ui ([6ae3b04](https://github.com/cozy/cozy-libs/commit/6ae3b04925ae64fa30f3ec8b6e716453d0a630fe))
- Update react-autosuggest package ([92abd2c](https://github.com/cozy/cozy-libs/commit/92abd2c87d809b71e7e229d5abde1d0aa4b629a0))
- Update wording when modifying file or folder ([e9e12aa](https://github.com/cozy/cozy-libs/commit/e9e12aaa4593bf11fada3cf83931d86e8abe0987))
- Use List instead of CompositeRow for WhoHasAccess ([d9f7cc6](https://github.com/cozy/cozy-libs/commit/d9f7cc6610255b9b4ce202428c4777320dfba7a7))
- Use navigator.share in mobile to share link ([9da57c6](https://github.com/cozy/cozy-libs/commit/9da57c65e91c43df1b5f2a4c1546c5461eaf057a))

### BREAKING CHANGES

- If you imported component directly from
  'cozy-sharing/dist/components/... '
  especially from ' 'cozy-sharing/dist/components/Recipient',
  you will need to update your import.

Drive example (the only one I found) :
`import { RecipientsAvatars } from 'cozy-sharing/dist/components/Recipient'`
=>
`import RecipientsAvatars from 'cozy-sharing/dist/components/Recipient/RecipientsAvatars'`

# 5.0.0 (2023-01-09)

### Bug Fixes

- Color for badge with me ([bd7def0](https://github.com/cozy/cozy-libs/commit/bd7def03e0db9d8771a1e96965684d8785f6c91b))

### Features

- **harvest:** Update router packages ([3f08dd2](https://github.com/cozy/cozy-libs/commit/3f08dd2a99fb516c45ff938ca528dece63d10ca3))

### BREAKING CHANGES

- **harvest:** `react-router-dom` is `>=4` as peer dependencies.

# [4.9.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@4.8.2...cozy-sharing@4.9.0) (2022-12-20)

### Features

- Remove getHomeLinkHref ([57bf707](https://github.com/cozy/cozy-libs/commit/57bf707de15c2db76964c115e50481f1204c1ca1))
- Remove tracker calls for cozy-sharing ([46728c2](https://github.com/cozy/cozy-libs/commit/46728c259e4bd1a93913d5d30fb3a78b23a2aab4))

## [4.8.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@4.8.1...cozy-sharing@4.8.2) (2022-12-20)

### Bug Fixes

- Reactive share modal for all apps ([7ff734b](https://github.com/cozy/cozy-libs/commit/7ff734b7506fc74aa3740de6bec7b1f89b21f505))

## [4.8.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@4.8.0...cozy-sharing@4.8.1) (2022-12-09)

**Note:** Version bump only for package cozy-sharing

# 4.8.0 (2022-12-06)

### Features

- Update eslint-config-cozy-app ([a0a55db](https://github.com/cozy/cozy-libs/commit/a0a55dbd95477bc99d9a927c65cffc08c824e80b))

# [4.7.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@4.6.1...cozy-sharing@4.7.0) (2022-11-15)

### Bug Fixes

- **SharingProvider:** Wait until all request finish to rise allLoaded ([05b14c4](https://github.com/cozy/cozy-libs/commit/05b14c4af3b572c919f944a3b2b5ef5ec7b51257))

### Features

- Add ShareButtonWithRecipients ([b1f99b3](https://github.com/cozy/cozy-libs/commit/b1f99b3f3ea6ed00b3c11e87042434239c83d94d))

## [4.6.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@4.6.0...cozy-sharing@4.6.1) (2022-11-14)

**Note:** Version bump only for package cozy-sharing

# [4.6.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@4.5.10...cozy-sharing@4.6.0) (2022-11-10)

### Features

- Reactivate sharing cozy to cozy for notes ([d54138e](https://github.com/cozy/cozy-libs/commit/d54138e29ed2d966f8b1da4b4b4caae2b17a3264))

## 4.5.10 (2022-11-09)

### Bug Fixes

- Paginated permission were not normalized ([eac18f4](https://github.com/cozy/cozy-libs/commit/eac18f4cc90bf4b06d91b7e59343bb4efcf81dcd))

## [4.5.9](https://github.com/cozy/cozy-libs/compare/cozy-sharing@4.5.8...cozy-sharing@4.5.9) (2022-10-03)

**Note:** Version bump only for package cozy-sharing

## 4.5.8 (2022-10-03)

**Note:** Version bump only for package cozy-sharing

## [4.5.7](https://github.com/cozy/cozy-libs/compare/cozy-sharing@4.5.6...cozy-sharing@4.5.7) (2022-09-12)

**Note:** Version bump only for package cozy-sharing

## [4.5.6](https://github.com/cozy/cozy-libs/compare/cozy-sharing@4.5.5...cozy-sharing@4.5.6) (2022-09-06)

**Note:** Version bump only for package cozy-sharing

## [4.5.5](https://github.com/cozy/cozy-libs/compare/cozy-sharing@4.5.4...cozy-sharing@4.5.5) (2022-08-29)

**Note:** Version bump only for package cozy-sharing

## 4.5.4 (2022-08-29)

### Bug Fixes

- Remove a reconnection step ([05d2cb6](https://github.com/cozy/cozy-libs/commit/05d2cb674d9ce69164cf0a099059520cbf4f1722))

## [4.5.3](https://github.com/cozy/cozy-libs/compare/cozy-sharing@4.5.2...cozy-sharing@4.5.3) (2022-08-01)

**Note:** Version bump only for package cozy-sharing

## 4.5.2 (2022-07-26)

### Bug Fixes

- Style of paperItem component ([0ac8469](https://github.com/cozy/cozy-libs/commit/0ac8469e4389477c472d6de0db64d3825389438b))

## [4.5.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@4.5.0...cozy-sharing@4.5.1) (2022-07-13)

### Bug Fixes

- Handle old react-routers in ShareModal ([b6fe5cb](https://github.com/cozy/cozy-libs/commit/b6fe5cb40492a7a3e71b7e6652a2f95f4c63b39d))
- Revert ShareByEmail for Notes ([e5daeb9](https://github.com/cozy/cozy-libs/commit/e5daeb96455ed35cf6ca38b87f7c2d812c03a83e))

# [4.5.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@4.4.1...cozy-sharing@4.5.0) (2022-07-13)

### Features

- Allow sharemodal to use Location ([032f963](https://github.com/cozy/cozy-libs/commit/032f963c7296dcd296c5ef21a8814407ef9cf2cf))

## [4.4.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@4.4.0...cozy-sharing@4.4.1) (2022-07-11)

**Note:** Version bump only for package cozy-sharing

# 4.4.0 (2022-07-05)

### Bug Fixes

- Lint issue ([8523d7a](https://github.com/cozy/cozy-libs/commit/8523d7accbe7ee83b6a2fe7abf4cc629fcd76e61))

### Features

- All oauth methods to handle reconection case ([b1a6033](https://github.com/cozy/cozy-libs/commit/b1a6033b393b1732d985807328ea83e1c87e5373))
- **sharing:** Add `react-router` to devDeps & peerDeps ([baf1359](https://github.com/cozy/cozy-libs/commit/baf1359c72c1644bc01fab8873267178c00bd9fa))

## 4.3.1 (2022-06-24)

**Note:** Version bump only for package cozy-sharing

# 4.3.0 (2022-06-03)

### Features

- **harvest:** HandleOAuthResponse can deal with cozy-data from DOM ([7c6ac1a](https://github.com/cozy/cozy-libs/commit/7c6ac1a8de7dd2b136530d0aafdb1e3f9e28fa56))

## [4.2.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@4.2.1...cozy-sharing@4.2.2) (2022-05-13)

**Note:** Version bump only for package cozy-sharing

## [4.2.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@4.2.0...cozy-sharing@4.2.1) (2022-05-10)

**Note:** Version bump only for package cozy-sharing

# 4.2.0 (2022-05-09)

### Bug Fixes

- bump react-dom from 16.12.0 to 16.13.0 ([2a5b850](https://github.com/cozy/cozy-libs/commit/2a5b8509555f061b136a4b5f2e38b36eb75ea0be))

### Features

- Add papers filter on Home ([fd839dc](https://github.com/cozy/cozy-libs/commit/fd839dc6d2538799d8dafc1905d423410c251df6))

## [4.1.7](https://github.com/cozy/cozy-libs/compare/cozy-sharing@4.1.6...cozy-sharing@4.1.7) (2022-04-28)

**Note:** Version bump only for package cozy-sharing

## 4.1.6 (2022-04-25)

**Note:** Version bump only for package cozy-sharing

## [4.1.5](https://github.com/cozy/cozy-libs/compare/cozy-sharing@4.1.4...cozy-sharing@4.1.5) (2022-03-10)

**Note:** Version bump only for package cozy-sharing

## [4.1.4](https://github.com/cozy/cozy-libs/compare/cozy-sharing@4.1.3...cozy-sharing@4.1.4) (2022-03-01)

### Bug Fixes

- **sharing:** Upgrade cozy-ui to remove justifyContent warning ([eb6318f](https://github.com/cozy/cozy-libs/commit/eb6318f0d0cd2e39e47b80b35e30efb766d6e553))

## [4.1.3](https://github.com/cozy/cozy-libs/compare/cozy-sharing@4.1.2...cozy-sharing@4.1.3) (2022-02-21)

### Bug Fixes

- **sharing:** Escape public name in public cozy2cozy view ([b5af978](https://github.com/cozy/cozy-libs/commit/b5af978e6f349819b8f76e097f328a87a6c18912))

## [4.1.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@4.1.1...cozy-sharing@4.1.2) (2022-02-18)

### Bug Fixes

- **deps:** pin dependencies ([e53d065](https://github.com/cozy/cozy-libs/commit/e53d065090224ea340b2c25c3afd14f223f4d119))

## [4.1.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@4.1.0...cozy-sharing@4.1.1) (2022-02-15)

### Bug Fixes

- **deps:** update dependency babel-plugin-inline-react-svg to v1.1.2 ([2c66da8](https://github.com/cozy/cozy-libs/commit/2c66da822e24b0d30714d7fa4cd79c26696adcc6))
- **deps:** update dependency enzyme-to-json to v3.6.2 ([4b90ff6](https://github.com/cozy/cozy-libs/commit/4b90ff66bcf692886eb197727eed1d7dd7a41cb1))

# [4.1.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@4.0.5...cozy-sharing@4.1.0) (2022-02-14)

### Features

- **sharing:** Upgrade cozy-ui to benefit of new component ([db7490b](https://github.com/cozy/cozy-libs/commit/db7490ba5f1585e2a925f5c054aa611c93617bdc))

## [4.0.5](https://github.com/cozy/cozy-libs/compare/cozy-sharing@4.0.4...cozy-sharing@4.0.5) (2022-02-04)

**Note:** Version bump only for package cozy-sharing

## [4.0.4](https://github.com/cozy/cozy-libs/compare/cozy-sharing@4.0.3...cozy-sharing@4.0.4) (2022-02-03)

### Bug Fixes

- **deps:** update dependency jest to v26.6.3 ([f442fff](https://github.com/cozy/cozy-libs/commit/f442fff5f594f04f910046d971950023fcbdd958))

## [4.0.3](https://github.com/cozy/cozy-libs/compare/cozy-sharing@4.0.2...cozy-sharing@4.0.3) (2022-02-01)

### Bug Fixes

- **deps:** update babel monorepo ([dcc215a](https://github.com/cozy/cozy-libs/commit/dcc215a0478db2cb3175b09d759bce8153ad4000))

## [4.0.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@4.0.1...cozy-sharing@4.0.2) (2022-01-28)

**Note:** Version bump only for package cozy-sharing

## [4.0.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@4.0.0...cozy-sharing@4.0.1) (2022-01-07)

**Note:** Version bump only for package cozy-sharing

# [4.0.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@3.12.10...cozy-sharing@4.0.0) (2022-01-07)

### Features

- **eslint:** Propose Eslint plugin promise ([1fded18](https://github.com/cozy/cozy-libs/commit/1fded18))

### BREAKING CHANGES

- **eslint:** Most errors are not auto fixable,
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

## [3.12.10](https://github.com/cozy/cozy-libs/compare/cozy-sharing@3.12.9...cozy-sharing@3.12.10) (2022-01-06)

**Note:** Version bump only for package cozy-sharing

## [3.12.9](https://github.com/cozy/cozy-libs/compare/cozy-sharing@3.12.8...cozy-sharing@3.12.9) (2021-12-31)

### Bug Fixes

- **sharing:** ShareButton should not pass I18n props to Cozy-UI Button ([587cd2e](https://github.com/cozy/cozy-libs/commit/587cd2e))

## [3.12.8](https://github.com/cozy/cozy-libs/compare/cozy-sharing@3.12.7...cozy-sharing@3.12.8) (2021-12-28)

**Note:** Version bump only for package cozy-sharing

## [3.12.7](https://github.com/cozy/cozy-libs/compare/cozy-sharing@3.12.6...cozy-sharing@3.12.7) (2021-12-24)

### Bug Fixes

- **sharing:** typo in fr language when sending email ([59e0266](https://github.com/cozy/cozy-libs/commit/59e0266))

## [3.12.6](https://github.com/cozy/cozy-libs/compare/cozy-sharing@3.12.5...cozy-sharing@3.12.6) (2021-12-20)

**Note:** Version bump only for package cozy-sharing

## [3.12.5](https://github.com/cozy/cozy-libs/compare/cozy-sharing@3.12.4...cozy-sharing@3.12.5) (2021-12-02)

**Note:** Version bump only for package cozy-sharing

## [3.12.4](https://github.com/cozy/cozy-libs/compare/cozy-sharing@3.12.3...cozy-sharing@3.12.4) (2021-11-09)

**Note:** Version bump only for package cozy-sharing

## [3.12.3](https://github.com/cozy/cozy-libs/compare/cozy-sharing@3.12.2...cozy-sharing@3.12.3) (2021-10-22)

**Note:** Version bump only for package cozy-sharing

## [3.12.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@3.12.1...cozy-sharing@3.12.2) (2021-10-07)

### Bug Fixes

- Translate ShareByEmail success message ([da418c6](https://github.com/cozy/cozy-libs/commit/da418c6))

## [3.12.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@3.12.0...cozy-sharing@3.12.1) (2021-10-04)

### Bug Fixes

- Display Recipient's initials if no avatarPath or status is provided ([4b3c167](https://github.com/cozy/cozy-libs/commit/4b3c167))

# [3.12.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@3.11.0...cozy-sharing@3.12.0) (2021-09-28)

### Bug Fixes

- Set `recipientsToBeConfirmed` default to `[]` on `WhoHasAccess` ([694c5c8](https://github.com/cozy/cozy-libs/commit/694c5c8))

### Features

- Add confirm trusted recipients dialog ([dfe1695](https://github.com/cozy/cozy-libs/commit/dfe1695))
- Add onShared callback to SharingProvider ([f5e5f8f](https://github.com/cozy/cozy-libs/commit/f5e5f8f))

# [3.11.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@3.10.0...cozy-sharing@3.11.0) (2021-09-28)

### Bug Fixes

- Correctly handle async events in `ShareDialogCozyToCozy` tests ([5e088cd](https://github.com/cozy/cozy-libs/commit/5e088cd))

### Features

- Add a back button to sharing dialog when confirming a contact ([574f68b](https://github.com/cozy/cozy-libs/commit/574f68b))
- Bump cozy-ui to `54.0.0` ([41f22ec](https://github.com/cozy/cozy-libs/commit/41f22ec))
- Improve two steps confirmation use experience ([2c4da7b](https://github.com/cozy/cozy-libs/commit/2c4da7b))

# [3.10.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@3.9.0...cozy-sharing@3.10.0) (2021-09-20)

### Features

- Expose useSharingInfos hook as public API ([671520b](https://github.com/cozy/cozy-libs/commit/671520b))

# [3.9.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@3.8.0...cozy-sharing@3.9.0) (2021-09-16)

### Features

- Harmonize `DropdownButton` typography ([8f28073](https://github.com/cozy/cozy-libs/commit/8f28073))

# [3.8.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@3.7.0...cozy-sharing@3.8.0) (2021-09-13)

### Features

- Reword contact confirmation dialog ([942b0cd](https://github.com/cozy/cozy-libs/commit/942b0cd))

# [3.7.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@3.6.0...cozy-sharing@3.7.0) (2021-09-06)

### Bug Fixes

- Add translater function to email sharing success ([1d207c3](https://github.com/cozy/cozy-libs/commit/1d207c3))

### Features

- Add a displayer check ([50ea467](https://github.com/cozy/cozy-libs/commit/50ea467))
- Add all needed files for Sharing Banner ([dc288bf](https://github.com/cozy/cozy-libs/commit/dc288bf))
- Add Sharing Banner ([27ad82d](https://github.com/cozy/cozy-libs/commit/27ad82d))
- Bump cozy-ui to match cozy-notes version ([34e3cc5](https://github.com/cozy/cozy-libs/commit/34e3cc5))
- Fix SharingBanner test ([df2a9c6](https://github.com/cozy/cozy-libs/commit/df2a9c6))
- Remove drive from homeHref ([97010d3](https://github.com/cozy/cozy-libs/commit/97010d3))
- Reorganize directories ([3e005e4](https://github.com/cozy/cozy-libs/commit/3e005e4))

# [3.6.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@3.5.0...cozy-sharing@3.6.0) (2021-09-03)

### Features

- Add prop-types for `Recipient` ([f5db3d0](https://github.com/cozy/cozy-libs/commit/f5db3d0))
- Allow email sharing in Notes ([4f6b49b](https://github.com/cozy/cozy-libs/commit/4f6b49b))
- Implement `CozyPassFingerprintDialogContent` ([bcdcd7a](https://github.com/cozy/cozy-libs/commit/bcdcd7a))
- Implement `reject` scenario for twoStepsConfirmation ([022543a](https://github.com/cozy/cozy-libs/commit/022543a))
- Implement confirmation actions on `Recipient` ([d4d905a](https://github.com/cozy/cozy-libs/commit/d4d905a))
- Implement twoStepsConfirmation in `ShareModal` ([ce96bcf](https://github.com/cozy/cozy-libs/commit/ce96bcf))
- Implement twoStepsConfirmation in `WhoHasAccess` ([8435795](https://github.com/cozy/cozy-libs/commit/8435795))
- Improve prop-type for `recipientsToBeConfirmed` in `WhoHasAccess` ([8388860](https://github.com/cozy/cozy-libs/commit/8388860))
- Remove prop `hasTwhoStepsConfirmation` ([8b1d655](https://github.com/cozy/cozy-libs/commit/8b1d655))
- Set first `status` to `sharing` if no confirmation method provided ([382a6f6](https://github.com/cozy/cozy-libs/commit/382a6f6))
- Use `useSafeState` hook in `ShareDialogCozyToCozy` ([855eef9](https://github.com/cozy/cozy-libs/commit/855eef9))

# [3.5.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@3.4.2...cozy-sharing@3.5.0) (2021-08-10)

### Bug Fixes

- FetchFilesPaths only for documents that have a path ([a1d7e13](https://github.com/cozy/cozy-libs/commit/a1d7e13))
- Skip path querying for `non-file` documents in createSharingInStore ([c7635e4](https://github.com/cozy/cozy-libs/commit/c7635e4))

### Features

- Add translations for Organizations document type ([5916041](https://github.com/cozy/cozy-libs/commit/5916041))
- Bump cozy-client to `23.19.0` and cozy-ui to `51.5.0` ([949f228](https://github.com/cozy/cozy-libs/commit/949f228))
- Disable `previewPath` for organizations ([5696109](https://github.com/cozy/cozy-libs/commit/5696109))
- Disable shareByLink for organizations ([caae1d8](https://github.com/cozy/cozy-libs/commit/caae1d8))
- Expose `previewPath` as a prop of `SharingContext` ([064458c](https://github.com/cozy/cozy-libs/commit/064458c))

## [3.4.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@3.4.1...cozy-sharing@3.4.2) (2021-06-17)

### Bug Fixes

- Add props in state ([6795d00](https://github.com/cozy/cozy-libs/commit/6795d00))
- **deps:** Update devDeps cozy-client 16.8.0 to 23.9.1 ([0388464](https://github.com/cozy/cozy-libs/commit/0388464))

## [3.4.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@3.4.0...cozy-sharing@3.4.1) (2021-06-12)

**Note:** Version bump only for package cozy-sharing

# [3.4.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@3.3.7...cozy-sharing@3.4.0) (2021-06-02)

### Features

- Expose useFetchDocumentPath method ([ff18898](https://github.com/cozy/cozy-libs/commit/ff18898))

## [3.3.7](https://github.com/cozy/cozy-libs/compare/cozy-sharing@3.3.6...cozy-sharing@3.3.7) (2021-05-06)

**Note:** Version bump only for package cozy-sharing

## [3.3.6](https://github.com/cozy/cozy-libs/compare/cozy-sharing@3.3.5...cozy-sharing@3.3.6) (2021-05-06)

**Note:** Version bump only for package cozy-sharing

## [3.3.5](https://github.com/cozy/cozy-libs/compare/cozy-sharing@3.3.4...cozy-sharing@3.3.5) (2021-04-29)

**Note:** Version bump only for package cozy-sharing

## [3.3.4](https://github.com/cozy/cozy-libs/compare/cozy-sharing@3.3.3...cozy-sharing@3.3.4) (2021-04-28)

**Note:** Version bump only for package cozy-sharing

## [3.3.3](https://github.com/cozy/cozy-libs/compare/cozy-sharing@3.3.2...cozy-sharing@3.3.3) (2021-04-08)

### Bug Fixes

- ShareByLink z-index on iOS ([447a17b](https://github.com/cozy/cozy-libs/commit/447a17b))

## [3.3.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@3.3.1...cozy-sharing@3.3.2) (2021-03-25)

**Note:** Version bump only for package cozy-sharing

## [3.3.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@3.3.0...cozy-sharing@3.3.1) (2021-03-22)

**Note:** Version bump only for package cozy-sharing

# [3.3.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@3.2.0...cozy-sharing@3.3.0) (2021-03-17)

### Bug Fixes

- Changing of pomegranate to error ([24c72f4](https://github.com/cozy/cozy-libs/commit/24c72f4))
- Error path import ([7f0071f](https://github.com/cozy/cozy-libs/commit/7f0071f))

### Features

- Migrating to Typography component ([25a8ef7](https://github.com/cozy/cozy-libs/commit/25a8ef7))

# [3.2.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@3.1.0...cozy-sharing@3.2.0) (2021-03-16)

### Features

- ShareAutosuggest can now handle with contact givenName ([75b4192](https://github.com/cozy/cozy-libs/commit/75b4192))

# [3.1.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@3.0.0...cozy-sharing@3.1.0) (2021-03-04)

### Features

- Add shortLabel prop to ShareButton ([7d83069](https://github.com/cozy/cozy-libs/commit/7d83069))

# [3.0.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@2.12.2...cozy-sharing@3.0.0) (2021-03-04)

### Features

- Update to muiv4 for cozy-sharing ([9d5c589](https://github.com/cozy/cozy-libs/commit/9d5c589))

### BREAKING CHANGES

- The application needs to use MUI v4 to works properly with this version of cozy-sharing

## [2.12.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@2.12.1...cozy-sharing@2.12.2) (2021-03-02)

**Note:** Version bump only for package cozy-sharing

## [2.12.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@2.12.0...cozy-sharing@2.12.1) (2021-02-24)

**Note:** Version bump only for package cozy-sharing

# [2.12.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@2.11.7...cozy-sharing@2.12.0) (2021-02-18)

### Bug Fixes

- Divider import in SharingDetailsModal ([f349b54](https://github.com/cozy/cozy-libs/commit/f349b54))

### Features

- Upgrade cozy-ui to 44.10.1 ([de02e39](https://github.com/cozy/cozy-libs/commit/de02e39))

## [2.11.7](https://github.com/cozy/cozy-libs/compare/cozy-sharing@2.11.6...cozy-sharing@2.11.7) (2021-02-17)

### Bug Fixes

- Sharing type for recipients in sharing modal ([f1ebea9](https://github.com/cozy/cozy-libs/commit/f1ebea9))

## [2.11.6](https://github.com/cozy/cozy-libs/compare/cozy-sharing@2.11.5...cozy-sharing@2.11.6) (2021-02-12)

**Note:** Version bump only for package cozy-sharing

## [2.11.5](https://github.com/cozy/cozy-libs/compare/cozy-sharing@2.11.4...cozy-sharing@2.11.5) (2021-02-12)

**Note:** Version bump only for package cozy-sharing

## [2.11.4](https://github.com/cozy/cozy-libs/compare/cozy-sharing@2.11.3...cozy-sharing@2.11.4) (2021-02-04)

### Bug Fixes

- Don't crash if there is no value inside a permission ([bf35110](https://github.com/cozy/cozy-libs/commit/bf35110))

## [2.11.3](https://github.com/cozy/cozy-libs/compare/cozy-sharing@2.11.2...cozy-sharing@2.11.3) (2021-01-29)

**Note:** Version bump only for package cozy-sharing

## [2.11.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@2.11.1...cozy-sharing@2.11.2) (2021-01-28)

**Note:** Version bump only for package cozy-sharing

## [2.11.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@2.11.0...cozy-sharing@2.11.1) (2021-01-18)

**Note:** Version bump only for package cozy-sharing

# [2.11.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@2.10.0...cozy-sharing@2.11.0) (2020-12-07)

### Features

- Increase pagination size ([f03a36c](https://github.com/cozy/cozy-libs/commit/f03a36c))
- Upgrade cozy-client to have access to partialIndex API ([532df4a](https://github.com/cozy/cozy-libs/commit/532df4a))
- Use partial index to speed up contact search ([0eaa281](https://github.com/cozy/cozy-libs/commit/0eaa281))

# [2.10.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@2.9.0...cozy-sharing@2.10.0) (2020-11-30)

### Features

- Use svgr icon for cozy-sharings ([6bcc95a](https://github.com/cozy/cozy-libs/commit/6bcc95a))

# [2.9.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@2.8.2...cozy-sharing@2.9.0) (2020-11-23)

### Bug Fixes

- Move babel dep to devDep ([d524f28](https://github.com/cozy/cozy-libs/commit/d524f28))

### Features

- Update @babel/core and babel-jest ([352ddc3](https://github.com/cozy/cozy-libs/commit/352ddc3))
- Update jest ([3b2c32a](https://github.com/cozy/cozy-libs/commit/3b2c32a))
- Use >= for peer dependencies ([6ec2826](https://github.com/cozy/cozy-libs/commit/6ec2826))

## [2.8.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@2.8.1...cozy-sharing@2.8.2) (2020-11-20)

### Bug Fixes

- Don't display "Me" in the SharingRecipients. ([f291aeb](https://github.com/cozy/cozy-libs/commit/f291aeb))
- Fix issue with AvatarX proptype ([d3b7062](https://github.com/cozy/cozy-libs/commit/d3b7062))
- Reloading issue on Avatar from the stack ([0627982](https://github.com/cozy/cozy-libs/commit/0627982))
- Remove warning by using popperOptions ([17986ab](https://github.com/cozy/cozy-libs/commit/17986ab))
- Use models.contact from cozy-client instead of cozy-doctypes ([affac41](https://github.com/cozy/cozy-libs/commit/affac41))

## [2.8.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@2.8.0...cozy-sharing@2.8.1) (2020-11-19)

### Bug Fixes

- Tooltip on sharingAvatars show only the row recipients ([b2b71ff](https://github.com/cozy/cozy-libs/commit/b2b71ff))

# [2.8.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@2.7.1...cozy-sharing@2.8.0) (2020-11-19)

### Bug Fixes

- Remove status that doesn't exist ([bd4cc2e](https://github.com/cozy/cozy-libs/commit/bd4cc2e))

### Features

- SendingEmail is not an error ([18bfe76](https://github.com/cozy/cozy-libs/commit/18bfe76))

## [2.7.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@2.7.0...cozy-sharing@2.7.1) (2020-11-19)

### Bug Fixes

- SharingAvatar link is not separated + avatar size ([5bf669b](https://github.com/cozy/cozy-libs/commit/5bf669b))

# [2.7.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@2.6.1...cozy-sharing@2.7.0) (2020-11-17)

### Features

- Update cozy-ui for cozy-sharing ([914a57f](https://github.com/cozy/cozy-libs/commit/914a57f))

## [2.6.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@2.6.0...cozy-sharing@2.6.1) (2020-11-16)

### Bug Fixes

- No margin on first recipient when no AvatarPlusX ([5f14ad7](https://github.com/cozy/cozy-libs/commit/5f14ad7))

# [2.6.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@2.5.2...cozy-sharing@2.6.0) (2020-11-10)

### Bug Fixes

- Size of sharing avatar to smaller ([725cdf7](https://github.com/cozy/cozy-libs/commit/725cdf7))
- Style of Recipient icons ([859c409](https://github.com/cozy/cozy-libs/commit/859c409))

### Features

- AvatarPlusX can now use className ([d5fc1b3](https://github.com/cozy/cozy-libs/commit/d5fc1b3))
- Update cozy-ui to 40.6.0 ([6b9f348](https://github.com/cozy/cozy-libs/commit/6b9f348))

## [2.5.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@2.5.1...cozy-sharing@2.5.2) (2020-11-05)

**Note:** Version bump only for package cozy-sharing

## [2.5.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@2.5.0...cozy-sharing@2.5.1) (2020-11-05)

### Bug Fixes

- Better proptypes ([cdc9af5](https://github.com/cozy/cozy-libs/commit/cdc9af5))
- Don't use the same key for different usage. ([6186711](https://github.com/cozy/cozy-libs/commit/6186711))
- Need disableEnforceFocus to be able to coyp/past the link ([a034b5f](https://github.com/cozy/cozy-libs/commit/a034b5f))
- Note has its title in attributes.name ([1224476](https://github.com/cozy/cozy-libs/commit/1224476))
- Split Dialog in two ([ac16bac](https://github.com/cozy/cozy-libs/commit/ac16bac))
- Use open and not opened ([3d23325](https://github.com/cozy/cozy-libs/commit/3d23325))
- Use popper fixed if needed ([b5210e3](https://github.com/cozy/cozy-libs/commit/b5210e3))

# [2.5.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@2.4.0...cozy-sharing@2.5.0) (2020-11-04)

### Features

- Update cozy-ui to 40.3.0 ([0a104fa](https://github.com/cozy/cozy-libs/commit/0a104fa))

# [2.4.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@2.3.1...cozy-sharing@2.4.0) (2020-11-04)

### Features

- RecipientAvatar are greyed if pending ([f8a7a53](https://github.com/cozy/cozy-libs/commit/f8a7a53))
- RecipientsAvatars doesn't show owner avatar if it's 'me' ([3adbba6](https://github.com/cozy/cozy-libs/commit/3adbba6))
- SharedStatus shows avatars instead of text ([0f7bf9b](https://github.com/cozy/cozy-libs/commit/0f7bf9b))

## [2.3.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@2.3.0...cozy-sharing@2.3.1) (2020-11-03)

**Note:** Version bump only for package cozy-sharing

# [2.3.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@2.2.0...cozy-sharing@2.3.0) (2020-10-29)

### Features

- Add size to title ([5f14685](https://github.com/cozy/cozy-libs/commit/5f14685))
- Display the document name in the Sharing Modale ([a7832ac](https://github.com/cozy/cozy-libs/commit/a7832ac))

# [2.2.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@2.1.0...cozy-sharing@2.2.0) (2020-10-26)

### Bug Fixes

- Add open_sharing attribute to share() ([8dd6f8d](https://github.com/cozy/cozy-libs/commit/8dd6f8d))
- GetPrimaryCozy is not exactly the same between doctypes and models ([f7e6a09](https://github.com/cozy/cozy-libs/commit/f7e6a09))
- If sharingType is read only don't display read / write option ([69f8be5](https://github.com/cozy/cozy-libs/commit/69f8be5))

### Features

- Pass the sharing Object down to the tree ([6b5e26b](https://github.com/cozy/cozy-libs/commit/6b5e26b))
- Upgrade Cozy-Client ([aac9610](https://github.com/cozy/cozy-libs/commit/aac9610))
- Upgrade cozy-client to get SharingAPI ([40b6e14](https://github.com/cozy/cozy-libs/commit/40b6e14))

# [2.1.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@2.0.0...cozy-sharing@2.1.0) (2020-10-19)

### Features

- Use @cozy/minilog instead of minilog ([621abad](https://github.com/cozy/cozy-libs/commit/621abad))

# [2.0.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.16.2...cozy-sharing@2.0.0) (2020-10-19)

### Bug Fixes

- SelectBox is displayed 'fixed' ([2445e83](https://github.com/cozy/cozy-libs/commit/2445e83))

### Features

- Upgrade Cozy-UI ([ca1cb0d](https://github.com/cozy/cozy-libs/commit/ca1cb0d))

### BREAKING CHANGES

- You have to upgrade at least
  to UI 36.2.0 to have access to non
  ExperimentalDialog

## [1.16.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.16.1...cozy-sharing@1.16.2) (2020-10-01)

### Bug Fixes

- Lint issue ([aa10617](https://github.com/cozy/cozy-libs/commit/aa10617))

## [1.16.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.16.0...cozy-sharing@1.16.1) (2020-09-15)

**Note:** Version bump only for package cozy-sharing

# [1.16.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.15.2...cozy-sharing@1.16.0) (2020-09-10)

### Features

- Support sharings with shortcuts ([1c24ed0](https://github.com/cozy/cozy-libs/commit/1c24ed0))
- Use avatar from server ([2c56ac8](https://github.com/cozy/cozy-libs/commit/2c56ac8))

## [1.15.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.15.1...cozy-sharing@1.15.2) (2020-09-04)

**Note:** Version bump only for package cozy-sharing

## [1.15.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.15.0...cozy-sharing@1.15.1) (2020-09-02)

### Bug Fixes

- Ability to copy links ([69791e7](https://github.com/cozy/cozy-libs/commit/69791e7))
- Don't show clipboard error if automatic copy fails ([c21c690](https://github.com/cozy/cozy-libs/commit/c21c690))

# [1.15.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.14.0...cozy-sharing@1.15.0) (2020-08-28)

### Bug Fixes

- Adjust aligment issues ([efdf056](https://github.com/cozy/cozy-libs/commit/efdf056))
- Make keys more relevant ([2e77114](https://github.com/cozy/cozy-libs/commit/2e77114))

### Features

- Add MUI dependency ([15037a8](https://github.com/cozy/cozy-libs/commit/15037a8))
- Change share modal layout ([ad74703](https://github.com/cozy/cozy-libs/commit/ad74703))
- Dedicate dropdown menu to permissions ([337bb2c](https://github.com/cozy/cozy-libs/commit/337bb2c))
- Different display for error statuses ([c476b3c](https://github.com/cozy/cozy-libs/commit/c476b3c))
- Remove who has access title ([96fa93b](https://github.com/cozy/cozy-libs/commit/96fa93b))
- Sharing status is now always displayed ([b02cef3](https://github.com/cozy/cozy-libs/commit/b02cef3))
- Show pending status when we dont support the real status ([498640e](https://github.com/cozy/cozy-libs/commit/498640e))

# [1.14.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.13.8...cozy-sharing@1.14.0) (2020-08-21)

### Bug Fixes

- Remove warning in tests concerning Button label ([88ba928](https://github.com/cozy/cozy-libs/commit/88ba928))
- Use global minilog if available and remove logging by default ([91e3959](https://github.com/cozy/cozy-libs/commit/91e3959))

### Features

- Add isRequired on ShareModal `link` prop ([b3cd14e](https://github.com/cozy/cozy-libs/commit/b3cd14e))
- Update cozy-ui across all libs ([73549b0](https://github.com/cozy/cozy-libs/commit/73549b0))

## [1.13.8](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.13.7...cozy-sharing@1.13.8) (2020-08-20)

### Bug Fixes

- Use label instead of text to remove Proptypes warning ([10616e2](https://github.com/cozy/cozy-libs/commit/10616e2))

## [1.13.7](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.13.6...cozy-sharing@1.13.7) (2020-08-20)

**Note:** Version bump only for package cozy-sharing

## [1.13.6](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.13.5...cozy-sharing@1.13.6) (2020-08-20)

**Note:** Version bump only for package cozy-sharing

## [1.13.5](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.13.4...cozy-sharing@1.13.5) (2020-08-05)

**Note:** Version bump only for package cozy-sharing

## [1.13.4](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.13.3...cozy-sharing@1.13.4) (2020-08-05)

### Bug Fixes

- Shared Element when the document has no path ([#1054](https://github.com/cozy/cozy-libs/issues/1054)) ([6ebd223](https://github.com/cozy/cozy-libs/commit/6ebd223))

## [1.13.3](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.13.2...cozy-sharing@1.13.3) (2020-08-03)

**Note:** Version bump only for package cozy-sharing

## [1.13.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.13.1...cozy-sharing@1.13.2) (2020-07-27)

**Note:** Version bump only for package cozy-sharing

## [1.13.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.13.0...cozy-sharing@1.13.1) (2020-07-21)

### Bug Fixes

- Use same Cozy-UI and CozyClient version everywhere ([6216e62](https://github.com/cozy/cozy-libs/commit/6216e62))

# [1.13.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.12.0...cozy-sharing@1.13.0) (2020-07-20)

### Features

- Update cozy-client ([14ca0b9](https://github.com/cozy/cozy-libs/commit/14ca0b9))
- Update cozy-ui ([a8710f9](https://github.com/cozy/cozy-libs/commit/a8710f9))

# [1.12.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.11.7...cozy-sharing@1.12.0) (2020-07-16)

### Features

- Update lodash accross all packages ([6a20128](https://github.com/cozy/cozy-libs/commit/6a20128))

## [1.11.7](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.11.6...cozy-sharing@1.11.7) (2020-07-08)

### Bug Fixes

- Defer loading data until cozy-client is ready ([5b2a2c0](https://github.com/cozy/cozy-libs/commit/5b2a2c0))

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

- No special case for sharing notes ([425b227](https://github.com/cozy/cozy-libs/commit/425b227))

# [1.11.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.10.1...cozy-sharing@1.11.0) (2020-04-27)

### Bug Fixes

- Export all components with locales ([5dd92cb](https://github.com/cozy/cozy-libs/commit/5dd92cb))
- Missing translation ([dddaf29](https://github.com/cozy/cozy-libs/commit/dddaf29))
- Removed extra space in string ([651f804](https://github.com/cozy/cozy-libs/commit/651f804))
- Upgrade ui and client ([c0b9b77](https://github.com/cozy/cozy-libs/commit/c0b9b77))

### Features

- Allow to update a link sharing in state ([d8970f3](https://github.com/cozy/cozy-libs/commit/d8970f3))
- Handle permission errors ([b7979f5](https://github.com/cozy/cozy-libs/commit/b7979f5))
- Removed share by link description ([abc9309](https://github.com/cozy/cozy-libs/commit/abc9309))
- Support writable link-sharing ([e099c7e](https://github.com/cozy/cozy-libs/commit/e099c7e))

## [1.10.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.10.0...cozy-sharing@1.10.1) (2020-03-26)

**Note:** Version bump only for package cozy-sharing

# [1.10.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.9.1...cozy-sharing@1.10.0) (2020-03-25)

### Features

- Expose hasWriteAccess function in context ([571fdc4](https://github.com/cozy/cozy-libs/commit/571fdc4))
- Expose SharingContext for usage in hooks ([04b0b5b](https://github.com/cozy/cozy-libs/commit/04b0b5b))

## [1.9.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.9.0...cozy-sharing@1.9.1) (2020-03-25)

### Bug Fixes

- Use \_id instead of id ([de27d3b](https://github.com/cozy/cozy-libs/commit/de27d3b))

# [1.9.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.8.12...cozy-sharing@1.9.0) (2020-03-23)

### Bug Fixes

- Better regex to handle more complexe emails ([c2d6959](https://github.com/cozy/cozy-libs/commit/c2d6959))

### Features

- Handle copy paste string with emails + refacto ([f7042dd](https://github.com/cozy/cozy-libs/commit/f7042dd))

## [1.8.12](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.8.11...cozy-sharing@1.8.12) (2020-03-13)

### Bug Fixes

- Call revokeSelf if not the owner of the sharing ([f7afc60](https://github.com/cozy/cozy-libs/commit/f7afc60))

## [1.8.11](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.8.10...cozy-sharing@1.8.11) (2020-03-05)

### Bug Fixes

- Don't import from index ([9ab678c](https://github.com/cozy/cozy-libs/commit/9ab678c))

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

- Add RefreshableSharings to expose a way to refresh sharings ([6afd92f](https://github.com/cozy/cozy-libs/commit/6afd92f))

# [1.7.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.6.2...cozy-sharing@1.7.0) (2020-01-27)

### Bug Fixes

- Better alignment for the display status ([a4b9c3b](https://github.com/cozy/cozy-libs/commit/a4b9c3b))
- Since we have a bug in the Stack, don't manipulate trashed files ([9e04ffc](https://github.com/cozy/cozy-libs/commit/9e04ffc))

### Features

- Add a onFileDelete method to refresh the Provider ([98e921e](https://github.com/cozy/cozy-libs/commit/98e921e))
- Add a tooltip on the LinkIcon and set the right color ([8a6d998](https://github.com/cozy/cozy-libs/commit/8a6d998))

## [1.6.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.6.1...cozy-sharing@1.6.2) (2020-01-21)

**Note:** Version bump only for package cozy-sharing

## [1.6.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.6.0...cozy-sharing@1.6.1) (2020-01-20)

### Bug Fixes

- Use minilog cozy fork ([6f815ed](https://github.com/cozy/cozy-libs/commit/6f815ed))

# [1.6.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.5.5...cozy-sharing@1.6.0) (2020-01-17)

### Bug Fixes

- Fix issue with svg loader ([753a066](https://github.com/cozy/cozy-libs/commit/753a066))
- Uniq key name ([bbc1a0b](https://github.com/cozy/cozy-libs/commit/bbc1a0b))

### Features

- Add a prop to tell if the request has been done at least one. ([a8c66d2](https://github.com/cozy/cozy-libs/commit/a8c66d2))

## [1.5.5](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.5.4...cozy-sharing@1.5.5) (2020-01-17)

### Bug Fixes

- Check active attribute to know if a sharing is still active or not ([b9d5902](https://github.com/cozy/cozy-libs/commit/b9d5902))
- Since shared-by-link is paginated, we need to load other perms ([61fe18f](https://github.com/cozy/cozy-libs/commit/61fe18f))

## [1.5.4](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.5.3...cozy-sharing@1.5.4) (2020-01-10)

**Note:** Version bump only for package cozy-sharing

## [1.5.3](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.5.2...cozy-sharing@1.5.3) (2020-01-03)

**Note:** Version bump only for package cozy-sharing

## [1.5.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.5.1...cozy-sharing@1.5.2) (2020-01-03)

### Bug Fixes

- Sharing has sideeffect on css files ([cc6eff9](https://github.com/cozy/cozy-libs/commit/cc6eff9))

## [1.5.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.5.0...cozy-sharing@1.5.1) (2020-01-02)

**Note:** Version bump only for package cozy-sharing

# [1.5.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.4.0...cozy-sharing@1.5.0) (2019-12-23)

### Features

- Export withLocales from cozy-sharing ([c727aa3](https://github.com/cozy/cozy-libs/commit/c727aa3))

# [1.4.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.3.2...cozy-sharing@1.4.0) (2019-12-18)

### Bug Fixes

- **cozy-sharing:** Patch is necessary for cozy-notes ([46c6ffc](https://github.com/cozy/cozy-libs/commit/46c6ffc))

### Features

- **cozy-sharing:** Updates cozy-client peer dep ([d872c6f](https://github.com/cozy/cozy-libs/commit/d872c6f))

## [1.3.2](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.3.1...cozy-sharing@1.3.2) (2019-12-18)

### Bug Fixes

- Translation key for notes ([baa8942](https://github.com/cozy/cozy-libs/commit/baa8942))

## [1.3.1](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.3.0...cozy-sharing@1.3.1) (2019-12-18)

**Note:** Version bump only for package cozy-sharing

# [1.3.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.2.0...cozy-sharing@1.3.0) (2019-12-18)

### Bug Fixes

- **cozy-sharing:** URL for notes public link ([b065d43](https://github.com/cozy/cozy-libs/commit/b065d43))

### Features

- **cozy-sharing:** Allows notes to be edited through a public link ([300e88d](https://github.com/cozy/cozy-libs/commit/300e88d))

# [1.2.0](https://github.com/cozy/cozy-libs/compare/cozy-sharing@1.1.0...cozy-sharing@1.2.0) (2019-12-18)

### Features

- URL polyfill is useless ([c574e76](https://github.com/cozy/cozy-libs/commit/c574e76))

# 1.1.0 (2019-12-16)

### Features

- Rebase cozy-sharing in cozy-libs ([#873](https://github.com/cozy/cozy-libs/issues/873)) ([1aa8a50](https://github.com/cozy/cozy-libs/commit/1aa8a50))
