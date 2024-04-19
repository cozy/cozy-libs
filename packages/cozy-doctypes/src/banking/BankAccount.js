const get = require('lodash/get')
const groupBy = require('lodash/groupBy')
const keyBy = require('lodash/keyBy')
const merge = require('lodash/merge')

const log = require('cozy-logger').namespace('BankAccount')

const matching = require('./matching-accounts')
const { getSlugFromInstitutionLabel } = require('./slug-account')
const Document = require('../Document')

const connectionId = account => account?.relationships?.connection?.data?._id

class BankAccount extends Document {
  /**
   * Adds _id of existing accounts to fetched accounts
   */
  static reconciliate(fetchedAccounts, localAccounts) {
    let matchings = matching.matchAccounts(fetchedAccounts, localAccounts)
    matchings = BankAccount.addForcedReplaceMatchings(matchings, localAccounts)
    return matchings.map(matching => {
      log(
        'info',
        matching.match
          ? `${matching.account.label} matched with ${matching.match.label} via ${matching.method}`
          : `${matching.account.label} did not match with an existing account`
      )
      if (matching.forcedReplace) {
        log('info', `${matching.account.label} forced disabled state`)
      }
      const matchingMatchId = matching.match ? matching.match._id : undefined
      const forcedReplaceId = matching.forcedReplace
        ? matching.account._id
        : undefined
      return {
        ...matching.account,
        relationships: merge(
          {},
          matching.match ? matching.match.relationships : null,
          matching.account.relationships
        ),
        _id: forcedReplaceId || matchingMatchId
      }
    })
  }

  /**
   * Finds existing local bank accounts which are disabled and force their association to the new cozy account id
   * which can be found in the other updated bank accounts
   *
   * @param {Array} previousMatchings
   * @param {Array} localAccounts
   * @returns {Array} matchings array with added disabled bank accounts to update with new cozy account id
   */
  static addForcedReplaceMatchings(previousMatchings, localAccounts) {
    const replacedCozyAccountIds =
      BankAccount.findReplacedCozyAccountIdsMatchings(previousMatchings)

    if (!Object.keys(replacedCozyAccountIds).length > 0) {
      return previousMatchings
    }

    const matchings = [...previousMatchings]
    const matchedAccountIds = keyBy(matchings, 'match._id')
    for (const localAccount of localAccounts) {
      if (connectionId(localAccount) == null) {
        // XXX: don't try to update the connectionId of local accounts which
        // don't have any as they're probably not from the same bank.
        // If they are, their connectionId should be updated via a match with a
        // fetched account.
        continue
      }

      const foundInMatchedAccounts = Boolean(
        matchedAccountIds[localAccount._id]
      )
      if (foundInMatchedAccounts) {
        continue
      }

      const newAccountId = replacedCozyAccountIds[connectionId(localAccount)]
      if (newAccountId == null) {
        continue
      }

      matchings.push({
        forcedReplace: true,
        account: {
          ...localAccount,
          metadata: merge({}, localAccount.metadata, {
            disabledAt: localAccount.metadata?.updatedAt
          }),
          relationships: merge({}, localAccount.relationships, {
            connection: {
              data: {
                _id: newAccountId
              }
            }
          })
        }
      })
    }
    return matchings
  }

  /**
   * Find any bank account which cozy account id has been changed
   *
   * @param {Array} matchings
   * @returns {Object} mapping from old cozy account id to new cozy account id
   */
  static findReplacedCozyAccountIdsMatchings(matchings) {
    const result = {}
    for (const matching of matchings) {
      if (
        matching.match &&
        connectionId(matching?.account) !== connectionId(matching?.match)
      ) {
        result[connectionId(matching?.match)] = connectionId(matching?.account)
      }
    }
    return result
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
BankAccount.checkAttributes = null
BankAccount.vendorIdAttr = 'vendorId'

module.exports = BankAccount
