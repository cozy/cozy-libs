CLI tree
========

CLI tree is a small package based on [argparse] to create a tree like CLI in a declarative
way.

## Usage

See the [example]

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

## Command completion

CLI tree uses [tabtab] to add command completion.

Completion setup commands are automatically added and available like this :

```bash
$ node examples/users.js users completion -h
```

To properly handle completion in you program, you will have to add the completionHandler like in
the [example]




[example]: ./examples/users.js
[argparse]: https://github.com/nodeca/argparse
[tabtab]: https://www.npmjs.com/package/tabtab
