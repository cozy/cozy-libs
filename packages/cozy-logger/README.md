# Cozy logger

Logger used by connectors.

It should only be used for connectors and services.
For webapps, prefer [cozy-minilog](https://github.com/cozy/cozy-libs/tree/master/packages/cozy-minilog) for the following reasons:

- Better readability
- Logs can be catched correctly in Sentry

Depending on NODE_ENV, it will either :

- log with colors in a human friendly way switch (`NODE_ENV` == "developement" || "standalone" || "test")
- log in JSON for logs to be picked up by the [stack][] (`NODE_ENV` == "production")

[stack]: https://github.com/cozy/cozy-stack
