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

## Config example

See [the example config](./examples/repo-doctor.json).

## Screenshots

![Example run](./screenshots/example1.png)
