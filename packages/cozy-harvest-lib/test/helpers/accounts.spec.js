import { getLabel, mergeAuth, prepareAccountData } from 'helpers/accounts'

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

  describe('prepareAccountData', () => {
    it('should prepare account data', () => {
      expect(prepareAccountData(fixtures.konnector, fixtures.data)).toEqual({
        account_type: 'konnectest',
        auth: {
          username: 'foo',
          passphrase: 'bar'
        },
        identifier: 'username'
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
