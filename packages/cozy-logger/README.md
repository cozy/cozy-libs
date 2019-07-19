# Cozy logger

Logger used by connectors.

It is starting to be usable by apps but the code is still in NodeJS (with requires).

Depending on NODE_ENV, it will either :

- log with colors in a human friendly way switch (`NODE_ENV` == "developement" || "standalone" || "test")
- log in JSON for logs to be picked up by the [stack] (`NODE_ENV` == "production")

[stack]: https://github.com/cozy/cozy-stack
