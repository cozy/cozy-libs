This repository is a shared config for [Renovate][].

## Develop

To easily develop renovate configs, it is recommended to

- install globally the `renovate` npm package
- test the changes inside one repo
- backport the changes to the config renovate

```bash
yarn global add renovate
cd cozy-banks # Go to the repo where you want to test the changes
vim renovate.json # Edit the config inside your repo
export RENOVATE_CONFIG_FILE=renovate.json # By default, renovate uses config.js
export GITHUB_TOKEN=XXXXXXXXXXXXXXXXX # Personal Github token to get: https://github.com/settings/tokens
renovate --token $GITHUB_TOKEN cozy/cozy-banks --schedule "at any time" --base-dir /tmp/banks --skip-installs --force-cli --pr-hourly-limit 0
# Everything works well
vim cozy-libs/packages/renovate-config-cozy/package.json # Backport the changes
# Open a pull request with the changes
```

## More information

- [Doc for renovate config](https://renovatebot.com/docs/configuration-options/)

[Renovate]: https://renovatebot.com
