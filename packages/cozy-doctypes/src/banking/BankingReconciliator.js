const fromPairs = require('lodash/fromPairs')
const log = require('cozy-logger').namespace('BankingReconciliator')

class BankingReconciliator {
  constructor(options) {
    this.options = options
  }

  async saveAccounts(fetchedAccounts, options) {
    const { BankAccount } = this.options

    const stackAccounts = await BankAccount.fetchAll()

    // Reconciliate
    const reconciliatedAccounts = BankAccount.reconciliate(
      fetchedAccounts,
      stackAccounts
    )

    log('info', 'Saving accounts...')
    const savedAccounts = await BankAccount.bulkSave(reconciliatedAccounts, {
      handleDuplicates: 'remove'
    })
    if (options.onAccountsSaved) {
      options.onAccountsSaved(savedAccounts)
    }

    return { savedAccounts, reconciliatedAccounts }
  }

  async save(fetchedAccounts, fetchedTransactions, options = {}) {
    const { BankAccount, BankTransaction } = this.options

    const { reconciliatedAccounts, savedAccounts } = await this.saveAccounts(
      fetchedAccounts,
      options
    )

    // Bank accounts saved in Cozy, we can now link transactions to accounts
    // via their cozy id
    const vendorIdToCozyId = fromPairs(
      savedAccounts.map(acc => [acc[BankAccount.vendorIdAttr], acc._id])
    )
    log('info', 'Linking transactions to accounts...')
    log('info', JSON.stringify(vendorIdToCozyId))

    fetchedTransactions.forEach(tr => {
      tr.account = vendorIdToCozyId[tr[BankTransaction.vendorAccountIdAttr]]
      if (tr.account === undefined) {
        log(
          'warn',
          `Transaction without account, vendorAccountIdAttr: ${BankTransaction.vendorAccountIdAttr}`
        )
        log('warn', 'transaction: ' + JSON.stringify(tr))
        throw new Error('Transaction without account.')
      }
    })

    const reconciliatedAccountIds = new Set(
      reconciliatedAccounts.filter(acc => acc._id).map(acc => acc._id)
    )

    // Pass to transaction reconciliation only transactions that belong
    // to one of the reconciliated accounts
    const stackTransactions = (await BankTransaction.fetchAll()).filter(
      transaction => reconciliatedAccountIds.has(transaction.account)
    )

    const transactions = BankTransaction.reconciliate(
      fetchedTransactions,
      stackTransactions,
      options
    )

    log('info', 'Saving transactions...')
    let i = 1
    const logProgress = doc => {
      log('debug', `[bulkSave] ${i++} Saving ${doc.date} ${doc.label}`)
    }
    const savedTransactions = await BankTransaction.bulkSave(transactions, {
      concurrency: 30,
      logProgress,
      handleDuplicates: 'remove'
    })
    return {
      accounts: savedAccounts,
      transactions: savedTransactions
    }
  }
}

module.exports = BankingReconciliator
