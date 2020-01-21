const Document = require('./Document')
const pickBy = require('lodash/pickBy')
const get = require('lodash/get')

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
   * @param {Object} [options={}]
   * @param {string} [options.identifierProperty=login] - The name of the identifier property to use for this account
   *
   * @returns {Object}
   */
  static fromCipher(cipher, options = {}) {
    const opts = {
      identifierProperty: 'login',
      ...options
    }

    const customFields = (get(cipher, 'fields') || []).reduce(
      (fields, field) => {
        fields[field.name] = field.value

        return fields
      },
      {}
    )

    const account = {
      auth: pickBy(
        {
          [opts.identifierProperty]: get(cipher, 'login.username', ''),
          password: get(cipher, 'login.password', ''),
          ...customFields
        },
        value => Boolean(value)
      )
    }

    if (cipher) {
      account.relationships = {
        vaultCipher: {
          _id: cipher.id,
          _type: 'com.bitwarden.ciphers',
          _protocol: 'bitwarden'
        }
      }
    }

    return account
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
