const Account = require('./Account')
const AdministrativeProcedure = require('./administrativeProcedures/AdministrativeProcedure')
const Application = require('./Application')
const Document = require('./Document')
const BalanceHistory = require('./banking/BalanceHistory')
const BankAccount = require('./banking/BankAccount')
const BankingReconciliator = require('./banking/BankingReconciliator')
const BankTransaction = require('./banking/BankTransaction')
const BankAccountStats = require('./banking/BankAccountStats')
const Contact = require('./contacts/Contact')
const Group = require('./contacts/Group')
const Permission = require('./Permission')
const CozyFile = require('./File')

module.exports = {
  Account,
  AdministrativeProcedure,
  Application,
  Document,
  BalanceHistory,
  BankAccount,
  BankingReconciliator,
  BankTransaction,
  BankAccountStats,
  Contact,
  Group,
  registerClient: Document.registerClient,
  Permission,
  CozyFile
}
