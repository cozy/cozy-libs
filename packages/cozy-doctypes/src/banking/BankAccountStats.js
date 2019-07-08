const Document = require('../Document')

class BankAccountStats extends Document {}

BankAccountStats.doctype = 'io.cozy.bank.accounts.stats'
BankAccountStats.idAttributes = ['_id']
BankAccountStats.version = 1
BankAccountStats.checkedAttributes = null

module.exports = BankAccountStats
