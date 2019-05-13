import {
  build,
  getLabel,
  mergeAuth,
  updateTwoFaCode,
  resetState
} from 'helpers/accounts'

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
})
