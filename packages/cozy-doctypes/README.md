## Doctypes

This repository is meant to bring together methods and functions for doctypes that are shared across several applications.

- [Bank transactions](./src/BankTransaction.js)
- [Bank accounts](./src/BankAccount.js)
- [Balance histories](./src/BalanceHistory.js)

The Document API is useful in NodeJS contexts where you need to have global models, available across files.

⚠️ The Document API does not work well in contexts where you need to change the client in flight. For this, prefer to use
directly the `cozy-client` APIs.
