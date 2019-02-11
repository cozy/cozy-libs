const groupBy = require('lodash/groupBy')
const Document = require('../Document')
const matching = require('./matching-accounts')

class BankAccount extends Document {
  /**
   * Adds _id of existing accounts to fetched accounts
   */
  static reconciliate(fetchedAccounts, localAccounts) {
    const matchings = matching.matchAccounts(fetchedAccounts, localAccounts)
    return matchings.map(matching => {
      return {
        ...matching.account,
        _id: matching.match ? matching.match._id : undefined
      }
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
}

BankAccount.normalizeAccountNumber = matching.normalizeAccountNumber
BankAccount.doctype = 'io.cozy.bank.accounts'
BankAccount.idAttributes = ['_id']
BankAccount.version = 1
BankAccount.checkedAttributes = null
BankAccount.vendorIdAttr = 'vendorId'

module.exports = BankAccount
