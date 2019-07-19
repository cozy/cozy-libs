const Document = require('../Document')
const sumBy = require('lodash/sumBy')

class BankAccountStats extends Document {
  static checkCurrencies(accountsStats) {
    const currency = accountsStats[0].currency

    for (const accountStats of accountsStats) {
      if (accountStats.currency !== currency) {
        return false
      }
    }

    return true
  }

  static sum(accountsStats) {
    if (accountsStats.length === 0) {
      throw new Error('You must give at least one stats object')
    }

    if (!this.checkCurrencies(accountsStats)) {
      throw new Error('Currency of all stats object must be the same.')
    }

    const properties = [
      'income',
      'additionalIncome',
      'mortgage',
      'loans',
      'fixedCharges'
    ]

    const summedStats = properties.reduce((sums, property) => {
      sums[property] = sumBy(
        accountsStats,
        accountStats => accountStats[property] || 0
      )

      return sums
    }, {})

    summedStats.currency = accountsStats[0].currency

    return summedStats
  }
}

BankAccountStats.doctype = 'io.cozy.bank.accounts.stats'
BankAccountStats.idAttributes = ['_id']
BankAccountStats.version = 1
BankAccountStats.checkedAttributes = null

module.exports = BankAccountStats
