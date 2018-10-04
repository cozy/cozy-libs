const keyBy = require('lodash/keyBy')
const groupBy = require('lodash/groupBy')
const max = require('lodash/max')
const Document = require('./Document')
const BankAccount = require('./BankAccount')
const log = require('./log')

const getDate = transaction => transaction.date.slice(0, 10)

/**
 * Get the date of the latest transaction in an array
 * @param {array} stackTransactions
 * @returns {string} The date of the latest transaction (YYYY-MM-DD)
 */
const getSplitDate = stackTransactions => {
  return max(stackTransactions.map(transaction => getDate(transaction)))
}

const ensureISOString = date => {
  if (date instanceof Date) {
    return date.toISOString()
  } else {
    return date
  }
}

class Transaction extends Document {
  static getDate(transaction) {
    return transaction
  }

  isAfter(minDate) {
    if (!minDate) {
      return true
    } else {
      const day = ensureISOString(this.date).slice(0, 10)
      if (day !== 'NaN') {
        return day > minDate
      } else {
        log(
          'warn',
          'transaction date could not be parsed. transaction: ' +
            JSON.stringify(this)
        )
        return false
      }
    }
  }

  isBeforeOrSame(maxDate) {
    if (!maxDate) {
      return true
    } else {
      const day = ensureISOString(this.date).slice(0, 10)
      if (day !== 'NaN') {
        return day <= maxDate
      } else {
        log(
          'warn',
          'transaction date could not be parsed. transaction: ' +
            JSON.stringify(this)
        )
        return false
      }
    }
  }

  /**
   * Get the descriptive (and almost uniq) identifier of a transaction
   * @param {object} transaction - The transaction (containing at least amount, originalLabel and date)
   * @returns {object}
   */
  getIdentifier() {
    return `${this.amount}-${this.originalLabel}-${this.date}`
  }

  /**
   * Tell if a transaction exists in a given array of transactions identifiers
   * @param {object} transactionToCheck
   * @param {array} existingIdentifiers - The identifiers of transactions that already exist
   * @returns {boolean} whether the searched transaction was found or not
   */
  alreadyExists(existingIdentifiers) {
    const identifier = Transaction.prototype.getIdentifier.call(this)

    return existingIdentifiers.includes(identifier)
  }

  /**
   * Get transactions that should be present in the stack but are not
   * The transactions are checked using triplet {label, amount, date}
   * @param {array} transactionsToCheck
   * @param {array} stackTransactions
   * @returns {array}
   */
  static getMissedTransactions(transactionsToCheck, stackTransactions) {
    const existingIdentifiers = stackTransactions.map(transaction =>
      Transaction.prototype.getIdentifier.call(transaction)
    )

    const missedTransactions = transactionsToCheck
      .map(
        transaction =>
          !Transaction.prototype.alreadyExists.call(
            transaction,
            existingIdentifiers
          ) && transaction
      )
      .filter(Boolean)

    return missedTransactions
  }

  static reconciliate(remoteTransactions, localTransactions) {
    const findByVendorId = transaction =>
      localTransactions.find(t => t.vendorId === transaction.vendorId)

    const groups = groupBy(
      remoteTransactions,
      transaction =>
        findByVendorId(transaction) ? 'updatedTransactions' : 'newTransactions'
    )

    let newTransactions = groups.newTransactions || []
    const updatedTransactions = groups.updatedTransactions || []

    const splitDate = getSplitDate(localTransactions)

    if (splitDate) {
      const isAfterSplit = x => Transaction.prototype.isAfter.call(x, splitDate)
      const isBeforeSplit = x =>
        Transaction.prototype.isBeforeOrSame.call(x, splitDate)

      const transactionsAfterSplit = newTransactions.filter(isAfterSplit)

      if (transactionsAfterSplit.length > 0) {
        log(
          'info',
          `Saving ${
            transactionsAfterSplit.length
          } transaction after ${splitDate}`
        )
      } else {
        log('info', `No transaction after ${splitDate}`)
      }

      const transactionsBeforeSplit = newTransactions.filter(isBeforeSplit)

      const missedTransactions = Transaction.getMissedTransactions(
        transactionsBeforeSplit,
        localTransactions
      )

      if (missedTransactions.length > 0) {
        log('info', `Saving ${missedTransactions}.length`)
      } else {
        log('info', 'No missed transactions to catch-up')
      }

      newTransactions = [...transactionsAfterSplit, ...missedTransactions]
    } else {
      log('info', "Can't find a split date, saving all new transactions")
    }

    log(
      'info',
      `Transaction reconciliation: new ${newTransactions.length}, updated ${
        updatedTransactions.length
      }, split date ${splitDate} `
    )
    return [].concat(newTransactions).concat(updatedTransactions)
  }

  static async getMostRecentForAccounts(accountIds) {
    try {
      log('debug', 'Transaction.getLast')

      const index = await Document.getIndex(this.doctype, ['date', 'account'])
      const options = {
        selector: {
          date: { $gte: null },
          account: {
            $in: accountIds
          }
        },
        sort: [{ date: 'desc' }]
      }
      const transactions = await Document.query(index, options)
      log('info', 'last transactions length: ' + transactions.length)

      return transactions
    } catch (e) {
      log('error', e)

      return []
    }
  }

  static async deleteOrphans() {
    log('info', 'Deleting up orphan operations')
    const accounts = keyBy(await BankAccount.fetchAll(), '_id')
    const operations = await this.fetchAll()
    const orphanOperations = operations.filter(x => !accounts[x.account])
    log('info', `Total number of operations: ${operations.length}`)
    log('info', `Total number of orphan operations: ${orphanOperations.length}`)
    log('info', `Deleting ${orphanOperations.length} orphan operations...`)
    if (orphanOperations.length > 0) {
      return this.deleteAll(orphanOperations)
    }
  }

  getVendorAccountId() {
    return this[this.constructor.vendorAccountIdAttr]
  }
}
Transaction.doctype = 'io.cozy.bank.operations'
Transaction.version = 1
Transaction.vendorAccountIdAttr = 'vendorAccountId'
Transaction.vendorIdAttr = 'vendorId'
Transaction.idAttributes = ['vendorId']
Transaction.checkedAttributes = [
  'label',
  'originalBankLabel',
  'automaticCategoryId'
]

module.exports = Transaction
