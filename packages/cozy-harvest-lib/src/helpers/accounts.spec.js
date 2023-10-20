import {
  build,
  getLabel,
  mergeAuth,
  updateTwoFaCode,
  resetState,
  getVaultCipherId,
  setSessionResetIfNecessary,
  checkMaxAccounts
} from 'helpers/accounts'

import flag from 'cozy-flags'

jest.mock('cozy-flags')

const fixtures = {
  konnector: {
    slug: 'konnectest',
    fields: {
      username: {
        type: 'text'
      },
      passphrase: {
        type: 'password'
      }
    }
  },
  data: {
    username: 'foo',
    passphrase: 'bar'
  },
  account: {
    _id: '9dc83bc5b7dc44e19faa4d4c06d40524',
    account_type: 'konnectest',
    auth: {
      username: 'foo',
      passphrase: 'buz',
      nested: {
        probability: 'low'
      }
    }
  }
}

describe('Accounts Helper', () => {
  describe('getLabel', () => {
    it('should return identifier value', () => {
      expect(getLabel({ ...fixtures.account, identifier: 'username' })).toBe(
        'foo'
      )
    })

    it('should return id', () => {
      expect(getLabel(fixtures.account)).toBe(
        '9dc83bc5b7dc44e19faa4d4c06d40524'
      )
    })
  })

  describe('build', () => {
    it('should prepare account data with a reset state', () => {
      expect(build(fixtures.konnector, fixtures.data)).toEqual({
        account_type: 'konnectest',
        auth: {
          username: 'foo',
          passphrase: 'bar'
        },
        identifier: 'username',
        state: null
      })
    })
  })

  describe('updateTwoFaCode', () => {
    it('should set the 2FA code and reset the state', () => {
      expect(
        updateTwoFaCode(
          {
            ...fixtures.account,
            state: 'TWOFA_NEEDED'
          },
          'atwofacode'
        )
      ).toEqual({
        ...fixtures.account,
        state: null,
        twoFACode: 'atwofacode'
      })
    })
  })

  describe('resetState', () => {
    it('should reset the state', () => {
      expect(
        resetState({
          ...fixtures.account,
          state: 'TWOFA_NEEDED'
        })
      ).toEqual({
        ...fixtures.account,
        state: null
      })
    })
  })

  describe('setSessionResetIfNecessary', () => {
    it('should set session reset when password is changed', () => {
      expect(
        setSessionResetIfNecessary(
          {
            ...fixtures.account,
            state: 'TWOFA_NEEDED'
          },
          { password: 'newpassword' }
        )
      ).toEqual({
        ...fixtures.account,
        state: 'RESET_SESSION'
      })
    })
    it('should not fail when no changed field', () => {
      expect(
        setSessionResetIfNecessary({
          ...fixtures.account,
          state: 'TWOFA_NEEDED'
        })
      ).toEqual({
        ...fixtures.account,
        state: 'TWOFA_NEEDED'
      })
    })
  })

  describe('mergeAuth', () => {
    it('should hydrate account', () => {
      expect(mergeAuth(fixtures.account, fixtures.data)).toEqual({
        _id: '9dc83bc5b7dc44e19faa4d4c06d40524',
        account_type: 'konnectest',
        auth: {
          username: 'foo',
          passphrase: 'bar',
          nested: {
            probability: 'low'
          }
        }
      })
    })
  })

  describe('getVaultCipherId', () => {
    it('should return the cipher id', () => {
      expect(
        getVaultCipherId({
          relationships: {
            vaultCipher: {
              data: {
                _id: 'cipher-id'
              }
            }
          }
        })
      ).toEqual('cipher-id')
    })

    it('should return the cipher id (old format)', () => {
      expect(
        getVaultCipherId({
          relationships: {
            vaultCipher: {
              data: [
                {
                  _id: 'cipher-id'
                }
              ]
            }
          }
        })
      ).toEqual('cipher-id')
    })
  })

  describe('checkMaxAccounts', () => {
    const client = {
      fetchQueryAndGetFromState: jest.fn()
    }

    beforeEach(() => {
      flag.mockImplementation(flag => {
        switch (flag) {
          case 'harvest.accounts.maxByKonnector.konnector1':
            return 1
          case 'harvest.accounts.maxByKonnector.konnector2':
            return 2
          case 'harvest.accounts.max':
            return 3
          default:
            return null
        }
      })
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it('should return "max_accounts" if there are too many active triggers', async () => {
      const triggers = [
        { message: { konnector: 'konnector1' } },
        { message: { konnector: 'konnector2' } },
        { message: { konnector: 'konnector1' } },
        { message: { konnector: 'konnector2' } },
        { message: { konnector: 'konnector1' } }
      ]
      const maintenance = [
        { slug: 'konnector1', maintenance_activated: false },
        { slug: 'konnector2', maintenance_activated: true }
      ]
      client.fetchQueryAndGetFromState
        .mockResolvedValueOnce({ data: triggers })
        .mockResolvedValueOnce({ data: maintenance })

      const result = await checkMaxAccounts('konnector1', client)

      expect(result).toBe('max_accounts')
    })

    it('should return null if the konnector is in maintenance', async () => {
      const triggers = [
        { message: { konnector: 'konnector1' } },
        { message: { konnector: 'konnector2' } }
      ]
      const maintenance = [
        { slug: 'konnector1', maintenance_activated: true },
        { slug: 'konnector2', maintenance_activated: false }
      ]
      client.fetchQueryAndGetFromState
        .mockResolvedValueOnce({ data: triggers })
        .mockResolvedValueOnce({ data: maintenance })

      const result = await checkMaxAccounts('konnector1', client)

      expect(result).toBeNull()
    })

    it('should return "max_accounts_by_konnector" if there are too many accounts for the konnector', async () => {
      const triggers = [
        { message: { konnector: 'konnector1' } },
        { message: { konnector: 'konnector2' } }
      ]
      const maintenance = [
        { slug: 'konnector1', maintenance_activated: false },
        { slug: 'konnector2', maintenance_activated: false }
      ]
      client.fetchQueryAndGetFromState
        .mockResolvedValueOnce({ data: triggers })
        .mockResolvedValueOnce({ data: maintenance })

      const result = await checkMaxAccounts('konnector1', client)

      expect(result).toBe('max_accounts_by_konnector')
    })

    it('should return null if there are not too many accounts for the konnector', async () => {
      const triggers = [
        { message: { konnector: 'konnector1' } },
        { message: { konnector: 'konnector2' } }
      ]
      const maintenance = [
        { slug: 'konnector1', maintenance_activated: false },
        { slug: 'konnector2', maintenance_activated: false }
      ]
      client.fetchQueryAndGetFromState
        .mockResolvedValueOnce({ data: triggers })
        .mockResolvedValueOnce({ data: maintenance })

      const result = await checkMaxAccounts('konnector2', client)

      expect(result).toBeNull()
    })
  })
})
