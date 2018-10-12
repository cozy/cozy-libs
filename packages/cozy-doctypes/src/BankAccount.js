const keyBy = require('lodash/keyBy')
const Document = require('./Document')
const log = require('cozy-logger').namespace('BankAccount')

class BankAccount extends Document {
  static reconciliate(fetchedAccounts, localAccounts) {
    const byAccountNumber = keyBy(localAccounts, acc =>
      BankAccount.reconciliationKey(acc)
    )
    return fetchedAccounts.map(fetchedAccount => {
      const fetchedAccountKey = this.reconciliationKey(fetchedAccount)
      const matchedSavedAccount = byAccountNumber[fetchedAccountKey]
      return Object.assign({}, fetchedAccount, {
        _id: matchedSavedAccount && matchedSavedAccount._id
      })
    })
  }

  static reconciliationKey(account) {
    if (this.numberAttr) {
      log(
        'warn',
        'numberAttr is deprecated, use reconciliationAttributes instead'
      )
      return this[this.numberAttr]
    } else if (this.reconciliationAttributes) {
      const key = this.reconciliationAttributes
        .map(attr => account[attr])
        .join(' | ')
      return key
    } else {
      throw new Error(
        'Cannot make reconciliationKey without reconciliationAttributes'
      )
    }
  }
}

BankAccount.doctype = 'io.cozy.bank.accounts'
BankAccount.idAttributes = ['_id']
BankAccount.version = 1
BankAccount.checkedAttributes = null
BankAccount.reconciliationAttributes = ['number', 'label']
BankAccount.vendorIdAttr = 'vendorId'

module.exports = BankAccount
