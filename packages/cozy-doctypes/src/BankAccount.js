const keyBy = require('lodash/keyBy')
const groupBy = require('lodash/groupBy')
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

  static findDuplicateAccountsWithNoOperations(accounts, operations) {
    const opsByAccountId = groupBy(operations, op => op.account)

    const duplicateAccountGroups = Object.entries(
      groupBy(accounts, x => x.institutionLabel + ' > ' + x.label)
    )
      .map(([, duplicateGroup]) => duplicateGroup)
      .filter(duplicateGroup => duplicateGroup.length > 1)

    const res = []
    for (const duplicateAccounts of duplicateAccountGroups) {
      for (const account of duplicateAccounts) {
        const accountOperations = opsByAccountId[account._id] || []
        if (accountOperations.length === 0) {
          res.push(account)
        }
      }
    }
    return res
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
