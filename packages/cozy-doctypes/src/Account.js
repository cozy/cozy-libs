const Document = require('./Document')

const ACCOUNTS_DOCTYPE = 'io.cozy.accounts'

class Account extends Document {}

Account.schema = {
  doctype: ACCOUNTS_DOCTYPE,
  attributes: {},
  relationships: {
    master: {
      type: 'has-one',
      doctype: ACCOUNTS_DOCTYPE
    }
  }
}

module.exports = Account
