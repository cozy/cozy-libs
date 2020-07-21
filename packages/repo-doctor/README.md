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

```
$ repo-doctor -c config.json
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
