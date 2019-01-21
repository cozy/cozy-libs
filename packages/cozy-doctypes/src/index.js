const Application = require('./Application')
const Document = require('./Document')
const BankAccount = require('./banking/BankAccount')
const BankTransaction = require('./banking/BankTransaction')
const BalanceHistory = require('./banking/BalanceHistory')
const BankingReconciliator = require('./banking/BankingReconciliator')

module.exports = {
  Application,
  Document,
  BankTransaction,
  BankAccount,
  BalanceHistory,
  BankingReconciliator,
  registerClient: Document.registerClient
}
