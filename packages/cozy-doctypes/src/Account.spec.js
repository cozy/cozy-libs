/* eslint-env jest */
const { cozyClient } = require('./testUtils')
const Account = require('./Account')

beforeAll(() => {
  Account.registerClient(cozyClient)
})
describe('helpers library', () => {
  describe('getAccountName', () => {
    it('should return _id property by default (fallback)', () => {
      const account = { _id: 'mock12345', auth: { token: '1234' } }
      expect(Account.getAccountName(account)).toBe(account._id)
    })
    it('should return _id property by default (fallback) if no auth property', () => {
      const account = { _id: 'mock12345' }
      expect(Account.getAccountName(account)).toBe(account._id)
    })
    it('should return auth.acountName property if it exists, prior to other auth properties', () => {
      const account = { _id: 'mock12345', auth: { accountName: 'myaccount' } }
      expect(Account.getAccountName(account)).toBe(account.auth.accountName)
    })
    it('should return auth.login property if it exists, prior to auth.identifier and auth.email', () => {
      const account = {
        _id: 'mock12345',
        auth: {
          login: 'myaccountlogin',
          identifier: 'myaccountidentifier',
          email: 'myaccount@email.mock'
        }
      }
      expect(Account.getAccountName(account)).toBe(account.auth.login)
    })
    it("should return auth.identifier property if it exists (prior to auth.email) and if auth.login doesn't", () => {
      const account = {
        _id: 'mock12345',
        auth: {
          identifier: 'myaccountidentifier',
          email: 'myaccount@email.mock'
        }
      }
      expect(Account.getAccountName(account)).toBe(account.auth.identifier)
    })
    it('should return auth.email property if it exists and if neither auth.login and neither auth.identifier exist', () => {
      const account = {
        _id: 'mock12345',
        auth: {
          email: 'myaccount@email.mock'
        }
      }
      expect(Account.getAccountName(account)).toBe(account.auth.email)
    })
  })

  describe('fromCipher', () => {
    let cipher

    beforeEach(() => {
      cipher = {
        id: 'cipher-id',
        login: {
          username: 'username',
          password: 'password'
        }
      }
    })
    it('should return an io.cozy.accounts object with auth infos (no custom fields)', () => {
      const account = Account.fromCipher(cipher)

      expect(account).toEqual({
        auth: {
          login: 'username',
          password: 'password'
        },
        relationships: {
          vaultCipher: {
            _id: 'cipher-id',
            _type: 'com.bitwarden.ciphers',
            _protocol: 'bitwarden'
          }
        }
      })
    })

    it('should return an io.cozy.accounts object with auth infos (with custom fields)', () => {
      cipher.fields = [
        { name: 'timeout', value: '2000' },
        { name: 'error', value: 'USER_ACTION_NEEDED' }
      ]

      const account = Account.fromCipher(cipher)

      expect(account).toEqual({
        auth: {
          login: 'username',
          password: 'password',
          timeout: '2000',
          error: 'USER_ACTION_NEEDED'
        },
        relationships: {
          vaultCipher: {
            _id: 'cipher-id',
            _type: 'com.bitwarden.ciphers',
            _protocol: 'bitwarden'
          }
        }
      })
    })

    it('should handle null cipher', () => {
      const account = Account.fromCipher(null)

      expect(account).toEqual({
        auth: {}
      })
    })
  })
})
