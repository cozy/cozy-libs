const Account = require('./Account')
const Application = require('./Application')
const Document = require('./Document')
const BalanceHistory = require('./banking/BalanceHistory')
const BankAccount = require('./banking/BankAccount')
const BankingReconciliator = require('./banking/BankingReconciliator')
const BankTransaction = require('./banking/BankTransaction')
const Contact = require('./contacts/Contact')
const Group = require('./contacts/Group')
const Permission = require('./Permission')

module.exports = {
  Account,
  Application,
  Document,
  BalanceHistory,
  BankAccount,
  BankingReconciliator,
  BankTransaction,
  Contact,
  Group,
  registerClient: Document.registerClient,
  Permission
}
