const Document = require('./Document')
const pickBy = require('lodash/pickBy')

const ACCOUNTS_DOCTYPE = 'io.cozy.accounts'

// Order matters
const probableLoginFieldNames = [
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

  /**
   * Create an account document from a vault cipher
   *
   * @param {Object} cipher
   *
   * @returns {Object}
   */
  static fromCipher(cipher) {
    if (!cipher) {
      throw new Error('Cipher is required')
    }

    const customFields = (cipher.fields || []).reduce((fields, field) => {
      fields[field.name] = field.value

      return fields
    }, {})

    return {
      auth: pickBy(
        {
          login: cipher.login.username,
          password: cipher.login.password,
          ...customFields
        },
        value => Boolean(value)
      ),
      relationships: {
        vaultCipher: {
          _id: cipher.id,
          _type: 'com.bitwarden.ciphers',
          _protocol: 'bitwarden'
        }
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

Account.probableLoginFieldNames = probableLoginFieldNames

module.exports = Account
