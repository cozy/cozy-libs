const Document = require('./Document')

const ACCOUNTS_DOCTYPE = 'io.cozy.accounts'

// Order matters
export const probableLoginFieldNames = [
  'login',
  'identifier',
  'new_identifier',
  'email'
]

class Account extends Document {
  static getAccountName(account) {
    if (!account) return null
    if (account.auth) {
      return (
        account.auth.accountName || this.getAccountLogin(account) || account._id
      )
    } else {
      return account._id
    }
  }

  static getAccountLogin(account) {
    if (account && account.auth) {
      for (const fieldName of probableLoginFieldNames) {
        if (account.auth[fieldName]) return account.auth[fieldName]
      }
    }
  }
}

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
