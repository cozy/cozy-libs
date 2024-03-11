const Account = require('./Account')
const Application = require('./Application')
const Document = require('./Document')
const CozyFile = require('./File')
const CozyFolder = require('./Folder')
const Permission = require('./Permission')
const AdministrativeProcedure = require('./administrativeProcedures/AdministrativeProcedure')
const BalanceHistory = require('./banking/BalanceHistory')
const BankAccount = require('./banking/BankAccount')
const BankAccountStats = require('./banking/BankAccountStats')
const BankTransaction = require('./banking/BankTransaction')
const BankingReconciliator = require('./banking/BankingReconciliator')
const Contact = require('./contacts/Contact')
const Group = require('./contacts/Group')

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
  CozyFile,
  CozyFolder,
  Group,
  registerClient: Document.registerClient,
  Permission
}
