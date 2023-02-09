## cozy-ci-utils

A series of utility commands for our CI.

### Post a Github comment

`cozy-ci-github "Bot says hi"` will post the message `Bot says hi` to the current PR.

Requires an env var named `GH_TOKEN` which contains a Github token with the necessary permissions. It is recommended to generate this token from the @cozy-bot account.

### Install and configure Transifex

Running `cozy-ci-transifex` will install and configure the Transifex client.

Requires a file named `.transifexrc.tpl` at the root of the project. The usual content for this file is:

```
[https://www.transifex.com]
rest_hostname = https://rest.api.transifex.com
```

Also requires an env var named `TX_TOKEN` which contains the token for your transifex accound in the `.transifexrc.tpl` file.
