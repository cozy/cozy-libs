const fromPairs = require('lodash/fromPairs')
const log = require('cozy-logger').namespace('BankingReconciliator')

class BankingReconciliator {
  constructor(options) {
    this.options = options
  }

  async save(fetchedAccounts, fetchedTransactions, options = {}) {
    const { BankAccount, BankTransaction } = this.options

    // Fetch stack accounts corresponding (via reconciliationKey) to the bank
    // accounts fetched by the konnector
    const accountNumbers = new Set(
      fetchedAccounts.map(account => BankAccount.reconciliationKey(account))
    )
    const stackAccounts = (await BankAccount.fetchAll()).filter(acc =>
      accountNumbers.has(BankAccount.reconciliationKey(acc))
    )

    // Reconciliate
    const matchedAccounts = BankAccount.reconciliate(
      fetchedAccounts,
      stackAccounts
    )

    log('info', 'Saving accounts...')
    const savedAccounts = await BankAccount.bulkSave(matchedAccounts)
    if (options.onAccountsSaved) {
      options.onAccountsSaved(savedAccounts)
    }

    // Bank accounts saved in Cozy, we can now link transactions to accounts
    // via their cozy id
    const vendorIdToCozyId = fromPairs(
      savedAccounts.map(acc => [acc[BankAccount.vendorIdAttr], acc._id])
    )
    log('info', vendorIdToCozyId, 'Linking transactions to accounts...')

    fetchedTransactions.forEach(tr => {
      tr.account = vendorIdToCozyId[tr[BankTransaction.vendorAccountIdAttr]]
      if (tr.account === undefined) {
        log(
          'warn',
          `Transaction without account, vendorAccountIdAttr: ${
            BankTransaction.vendorAccountIdAttr
          }`
        )
        log('warn', 'transaction: ' + JSON.stringify(tr))
        throw new Error('Transaction without account.')
      }
    })

    const stackTransactions = await BankTransaction.getMostRecentForAccounts(
      stackAccounts.map(x => x._id)
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
    const savedTransactions = await BankTransaction.bulkSave(
      transactions,
      30,
      logProgress
    )
    return {
      accounts: savedAccounts,
      transactions: savedTransactions
    }
  }
}

module.exports = BankingReconciliator
