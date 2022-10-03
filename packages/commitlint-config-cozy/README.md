# Commitlint Config Cozy

> Shareable commitlint config enforcing the cozy commit convention

## Documentations

- Cozy commit documentation on [Cozy Guideline](https://github.com/cozy/cozy-guidelines#commit-messages)
- [Commitlint](http://marionebl.github.io/commitlint/)

## How to add it on your project

- Add the library on your dev dependency (`yarn add commitlint-config-cozy --dev --exact`)
- Add configuration on your `package.json` ([see an example](https://github.com/cozy/cozy-banks/blob/85572b6827cdaa45c1ed44d6922829ba6480b3c9/package.json#L242-L246)):

```json
"commitlint": {
  "extends": [
    "cozy"
  ]
}
```

- Add verification during a commit with husky (> 1.0.0) on your `package.json` ([see an example](https://github.com/cozy/cozy-libs/blob/ea325a4ea2b5bf0067875f625b5ad0a5b320e7e9/package.json#L24-L28)):

```
"husky": {
  "hooks": {
    "commit-msg": "commitlint -e $GIT_PARAMS"
  }
}
```

## Community

### What's Cozy?

<div align="center">
  <a href="https://cozy.io">
    <img src="https://cdn.rawgit.com/cozy/cozy-site/master/src/images/cozy-logo-name-horizontal-blue.svg" alt="cozy" height="48" />
  </a>
 </div>
 </br>

[Cozy][cozy] is a platform that brings all your web services in the same private space.  With it, your webapps and your devices can share data easily, providing you with a new experience. You can install Cozy on your own hardware where no one's tracking you.

### Get in touch

You can reach the Cozy Community by:

- Chatting with us on IRC [#cozycloud on Libera.Chat][libera]
- Posting on our [Forum][forum]
- Posting issues on the [Github repos][github]
- Say Hi! on [Twitter][twitter]

### Maintainers

The maintainer for Commitlint Config Cozy is [kosssi](https://github.com/kosssi) !

## License

`commitlint-config-cozy` is distributed under the MIT license.

[cozy]: https://cozy.io "Cozy Cloud"

[libera]: https://web.libera.chat/#cozycloud

[forum]: https://forum.cozy.io/

[github]: https://github.com/cozy/

[twitter]: https://twitter.com/cozycloud
