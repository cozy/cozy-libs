# Repository doctor

> Helps taming multi-repository complexity.

This projects aims at helping developers that manage many different
repositories to express rules and run them on all their repositories
to gather error and warnings. Think "linting" for your repositories.

### Rules

Rules can be implemented and can be controlled through a configuration
file, and can be overrided through the command line.

Example of rules:

- Check the freshness of dependencies
- Forbid the usage of some dependencies

### Reporters

Rules report info / success / warning / error messages that are passed
to a reporter. This lets you those messages either to your console or
to mattermost.

## Usage

- Repo doctor needs a config to work so you need to download a config.
- It will try to detect the current folder repository
- If no repository is detected, it will run repo-doctor on all the repositories
  of the config


```bash
# Download an example config
$ curl -o https://raw.githubusercontent.com/cozy/cozy-libs/master/packages/repo-doctor/examples/repo-doctor.json ~/.config/repo-doctor.json
$ repo-doctor
Detected repository as cozy/cozy-banks
Repository: cozy/cozy-banks
  dep-up-to-date: cozy-ui: 36.3.1, last is 36.5.0
  dep-up-to-date: cozy-client: 14.5.0, last is 14.5.0
  dep-up-to-date: cozy-realtime: 3.9.0, last is 3.10.5
  dep-up-to-date: cozy-harvest-lib: 2.13.4, last is 2.13.4
  dep-up-to-date: cozy-flags: 2.2.5, last is 2.3.4
  dep-up-to-date: cozy-app-publish: 0.22.3, last is 0.25.0
  dep-up-to-date: cozy-scripts: 5.0.1, last is 5.0.1
  dep-up-to-date: cozy-bar: 7.13.3, last is 7.15.2
  locales-in-repo: Locales are stored in the repository
```

```
$ repo-doctor --help
usage: repo-doctor [-h] [--repo REPO] [--dep DEP]
                   [--reporter {console,mattermost}] [--config CONFIG]
                   [--rule RULE]


Optional arguments:
  -h, --help            Show this help message and exit.
  --repo REPO           Run rules only on a repository
  --dep DEP             Run rules only on selected dependencies
  --reporter {console,mattermost}
                        Where to send the output (by default: console)
  --config CONFIG       Path to config
  --rule RULE           Run only selected rule
```

## Config example

See [the example config](./examples/repo-doctor.json).

For the mattermost reporter, you'll need to set up the `MATTERMOST_HOOK` env
variable with the URL of the incoming hook that you've set up in mattermost.


## How to write a rule

A rule is a class with a run method that needs to generate check reports:

```js
class MyRule {
  constructor(config) {
    // Save the config for later
    this.config = config
  }

  async *run(repositoryInfo) {
    const checkSomething = await doCheckSomething(this.config)

    if (checkOK) {
      yield {
        severity: 'success',
        message: 'The check is OK',
        type: 'my-rule'
      }
    } else {
      yield {
        severity: 'warn',
        message: 'The check is not OK, please fix it',
        type: 'my-rule'
      }
    }
  }
}

module.exports = MyRule
```

To configure this rule, edit the config file:

```patch
 {
   "rules": [
+    ["MyRule", { option1: true }]
   ]
 }
```

## Screenshots

<img src='./screenshots/example1.png' width='350px' />
