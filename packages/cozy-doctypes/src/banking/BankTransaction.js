const keyBy = require('lodash/keyBy')
const groupBy = require('lodash/groupBy')
const maxBy = require('lodash/maxBy')
const addDays = require('date-fns/add_days')
const isAfter = require('date-fns/is_after')
const Document = require('../Document')
const log = require('../log')
const BankAccount = require('./BankAccount')
const { matchTransactions } = require('./matching-transactions')

const maxValue = (iterable, fn) => {
  const res = maxBy(iterable, fn)
  return res ? fn(res) : null
}

const getDate = transaction => {
  const date = transaction.realisationDate || transaction.date
  return date.slice(0, 10)
}

/**
 * Get the date of the latest transaction in an array.
 * Transactions in the future are ignored.
 *
 * @param {array} stackTransactions
 * @returns {string} The date of the latest transaction (YYYY-MM-DD)
 */
const getSplitDate = stackTransactions => {
  const now = new Date()
  const notFutureTransactions = stackTransactions.filter(transaction => {
    const date = getDate(transaction)
    return !isAfter(date, now)
  })

  return maxValue(notFutureTransactions, getDate)
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
   * @param {object} transaction - The transaction (containing at least amount, originalBankLabel and date)
   * @returns {object}
   */
  getIdentifier() {
    return `${this.amount}-${this.originalBankLabel}-${this.date}`
  }

  /**
   * Get transactions that should be present in the stack but are not.
   * Transactions that are older that 1 week before the oldest existing
   * transaction are ignored.
   *
   * @param {array} newTransactions
   * @param {array} stackTransactions
   * @returns {array}
   */
  static getMissedTransactions(
    newTransactions,
    stackTransactions,
    options = {}
  ) {
    const oldestDate = maxValue(stackTransactions, getDate)
    const frontierDate = addDays(oldestDate, -7)
    const recentNewTransactions = newTransactions.filter(tr =>
      isAfter(getDate(tr), frontierDate)
    )
    const matchingResults = Array.from(
      matchTransactions(recentNewTransactions, stackTransactions)
    )

    const missedTransactions = matchingResults
      .filter(result => !result.match)
      .map(result => result.transaction)

    const trackEvent = options.trackEvent
    if (typeof trackEvent === 'function') {
      try {
        const nbMissed = missedTransactions.length
        const nbExisting = stackTransactions.length
        trackEvent({
          e_a: 'ReconciliateMissing',
          e_n: 'MissedTransactionPct',
          e_v: parseFloat((nbMissed / nbExisting).toFixed(2), 10)
        })
        trackEvent({
          e_a: 'ReconciliateMissing',
          e_n: 'MissedTransactionAbs',
          e_v: nbMissed
        })
      } catch (e) {
        log('warn', `Could not send MissedTransaction event: ${e.message}`)
      }
    }

    return missedTransactions
  }

  static reconciliate(remoteTransactions, localTransactions, options = {}) {
    const findByVendorId = transaction =>
      localTransactions.find(t => t.vendorId === transaction.vendorId)

    const groups = groupBy(remoteTransactions, transaction =>
      findByVendorId(transaction) ? 'updatedTransactions' : 'newTransactions'
    )

    let newTransactions = groups.newTransactions || []
    const updatedTransactions = groups.updatedTransactions || []

    const splitDate = getSplitDate(localTransactions)

    if (splitDate) {
      if (typeof options.trackEvent === 'function') {
        options.trackEvent({
          e_a: 'ReconciliateSplitDate'
        })
      }

      const isAfterSplit = x => Transaction.prototype.isAfter.call(x, splitDate)
      const isBeforeSplit = x =>
        Transaction.prototype.isBeforeOrSame.call(x, splitDate)

      const transactionsAfterSplit = newTransactions.filter(isAfterSplit)

      if (transactionsAfterSplit.length > 0) {
        log(
          'info',
          `Found ${transactionsAfterSplit.length} transactions after ${splitDate}`
        )
      } else {
        log('info', `No transaction after ${splitDate}`)
      }

      const transactionsBeforeSplit = newTransactions.filter(isBeforeSplit)
      log(
        'info',
        `Found ${transactionsBeforeSplit.length} transactions before ${splitDate}`
      )

      const missedTransactions = Transaction.getMissedTransactions(
        transactionsBeforeSplit,
        localTransactions,
        options
      )

      if (missedTransactions.length > 0) {
        log(
          'info',
          `Found ${missedTransactions.length} missed transactions before ${splitDate}`
        )
      } else {
        log('info', `No missed transactions before ${splitDate}`)
      }

      newTransactions = [...transactionsAfterSplit, ...missedTransactions]
    } else {
      log('info', "Can't find a split date, saving all new transactions")
    }

    log(
      'info',
      `Transaction reconciliation: new ${newTransactions.length}, updated ${updatedTransactions.length}, split date ${splitDate} `
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

  static getCategoryId(transaction, options) {
    const opts = {
      localModelOverride: false,
      localModelUsageThreshold: this.LOCAL_MODEL_USAGE_THRESHOLD,
      globalModelUsageThreshold: this.GLOBAL_MODEL_USAGE_THRESHOLD,
      ...options
    }

    if (transaction.manualCategoryId) {
      return transaction.manualCategoryId
    }

    if (
      opts.localModelOverride &&
      transaction.localCategoryId &&
      transaction.localCategoryProba &&
      transaction.localCategoryProba > opts.localModelUsageThreshold
    ) {
      return transaction.localCategoryId
    }

    if (
      transaction.cozyCategoryId &&
      transaction.cozyCategoryProba &&
      transaction.cozyCategoryProba > opts.globalModelUsageThreshold
    ) {
      return transaction.cozyCategoryId
    }

    // If the cozy categorization models have not been applied, we return null
    // so the transaction is considered as « categorization in progress ».
    // Otherwize we just use the automatic categorization from the vendor
    if (!transaction.localCategoryId && !transaction.cozyCategoryId) {
      return null
    }

    return transaction.automaticCategoryId
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
  'automaticCategoryId',
  'account'
]
Transaction.LOCAL_MODEL_USAGE_THRESHOLD = 0.8
Transaction.GLOBAL_MODEL_USAGE_THRESHOLD = 0.15
Transaction.getSplitDate = getSplitDate

module.exports = Transaction
