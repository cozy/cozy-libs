const Account = require('./Account')
const Application = require('./Application')
const Document = require('./Document')
const BalanceHistory = require('./banking/BalanceHistory')
const BankAccount = require('./banking/BankAccount')
const BankingReconciliator = require('./banking/BankingReconciliator')
const BankTransaction = require('./banking/BankTransaction')
const Permission = require('./Permission')

module.exports = {
  Account,
  Application,
  Document,
  BalanceHistory,
  BankAccount,
  BankingReconciliator,
  BankTransaction,
  registerClient: Document.registerClient,
  Permission
}
