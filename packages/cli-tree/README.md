CLI tree
========

CLI tree is a small package based on [argparse] to create a tree like CLI in a declarative
way.

## Usage

See the [example](./examples/users.js).

## Automated help

One of the major advantage of parsers built with argparse is their automated help.

```bash
$ node examples/users.js users list --help
usage: users.js users list [-h] [--deleted]

List users

Optional arguments:
  -h, --help  Show this help message and exit.
  --deleted   Show also deleted users
```

[argparse]: https://github.com/nodeca/argparse
