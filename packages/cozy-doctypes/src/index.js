const Application = require('./Application')
const Document = require('./Document')
const BankAccount = require('./BankAccount')
const BankTransaction = require('./BankTransaction')
const BalanceHistory = require('./BalanceHistory')
const BankingReconciliator = require('./utils/BankingReconciliator')

module.exports = {
  Application,
  Document,
  BankTransaction,
  BankAccount,
  BalanceHistory,
  BankingReconciliator,
  registerClient: Document.registerClient
}
