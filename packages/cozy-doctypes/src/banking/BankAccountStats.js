const Document = require('../Document')
const sumBy = require('lodash/sumBy')

class BankAccountStats extends Document {
  static sum(accountsStats) {
    const properties = ['income', 'additionalIncome', 'mortgage', 'loans']
    const summedStats = properties.reduce((sums, property) => {
      sums[property] = sumBy(
        accountsStats,
        accountStats => accountStats[property]
      )

      return sums
    }, {})

    summedStats.currency = 'EUR'

    return summedStats
  }
}

BankAccountStats.doctype = 'io.cozy.bank.accounts.stats'
BankAccountStats.idAttributes = ['_id']
BankAccountStats.version = 1
BankAccountStats.checkedAttributes = null

module.exports = BankAccountStats
