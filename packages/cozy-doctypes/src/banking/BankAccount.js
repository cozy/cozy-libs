const groupBy = require('lodash/groupBy')
const get = require('lodash/get')
const Document = require('../Document')
const matching = require('./matching-accounts')
const { getSlugFromInstitutionLabel } = require('./slug-account')

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

  static hasIncoherentCreatedByApp(account) {
    const predictedSlug = getSlugFromInstitutionLabel(account.institutionLabel)
    const createdByApp =
      account.cozyMetadata && account.cozyMetadata.createdByApp
    return Boolean(
      predictedSlug && createdByApp && predictedSlug !== createdByApp
    )
  }

  static getUpdatedAt(account) {
    const vendorUpdatedAt = get(account, 'metadata.updatedAt')

    if (vendorUpdatedAt) {
      return vendorUpdatedAt
    }

    const cozyUpdatedAt = get(account, 'cozyMetadata.updatedAt')

    if (cozyUpdatedAt) {
      return cozyUpdatedAt
    }

    return null
  }
}

BankAccount.normalizeAccountNumber = matching.normalizeAccountNumber
BankAccount.doctype = 'io.cozy.bank.accounts'
BankAccount.idAttributes = ['_id']
BankAccount.version = 1
BankAccount.checkedAttributes = null
BankAccount.vendorIdAttr = 'vendorId'

module.exports = BankAccount
