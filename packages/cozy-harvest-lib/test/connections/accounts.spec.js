/* eslint-env jest */

import client from 'cozy-client'

jest.mock('cozy-client', () => ({
  collection: jest.fn().mockReturnValue({
    add: jest.fn()
  }),
  create: jest.fn(),
  get: jest.fn(),
  query: jest.fn(),
  save: jest.fn(),
  where: jest.fn()
}))

const fixtures = {
  accountPermissions: {
    source_id: `io.cozy.konnectors/kaggregated`,
    permissions: {
      aggregatorAccount: {
        type: 'io.cozy.accounts',
        verbs: ['GET', 'PUT'],
        values: ['io.cozy.accounts.kaggregated-aggregator']
      }
    }
  },
  konnector: {
    slug: 'konnectest'
  },
  konnectorWithAggregator: {
    slug: 'kaggregated',
    aggregator: {
      accountId: 'kaggregated-aggregator'
    }
  },
  simpleAccount: {
    account_type: 'test',
    auth: {
      login: 'login',
      password: 'pass'
    }
  },
  parentAccount: {
    _id: 'kaggregated-aggregator'
  }
}

import { accountsMutations } from 'connections/accounts'
const { createAccount, updateAccount } = accountsMutations(client)

describe('Account mutations', () => {
  beforeAll(() => {
    client.create.mockResolvedValue({ data: fixtures.simpleAccount })
    client.save.mockResolvedValue({ data: fixtures.simpleAccount })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  describe('createAccount', () => {
    it('calls Cozy Client and return account', async () => {
      const account = await createAccount(
        fixtures.konnector,
        fixtures.simpleAccount
      )

      expect(client.create).toHaveBeenCalledWith(
        'io.cozy.accounts',
        fixtures.simpleAccount
      )
      expect(account).toEqual(fixtures.simpleAccount)
    })

    const simpleAccountFixtureWithMasterRelation = {
      ...fixtures.simpleAccount,
      relationships: {
        parent: {
          data: {
            _id: 'kaggregated-aggregator',
            _type: 'io.cozy.accounts'
          }
        }
      }
    }

    beforeEach(() => {
      client.get.mockReset()
      client.get.mockResolvedValue({
        data: simpleAccountFixtureWithMasterRelation
      })
    })

    it('throws an error when konnector have no aggregator attribute', async () => {
      const konnector = {}
      expect(createAccount(konnector, fixtures.simpleAccount)).rejects.toEqual(
        new Error('Konnector does not provide aggregator account id')
      )
    })

    it('throws an error when konnector have no aggregator.accountId attribute', async () => {
      const konnector = { aggregator: {} }
      expect(createAccount(konnector, fixtures.simpleAccount)).rejects.toEqual(
        new Error('Konnector does not provide aggregator account id')
      )
    })

    describe('if parent account does not exists', () => {
      beforeEach(() => {
        client.get = jest.fn().mockRejectedValue({ status: 404 })

        client.create.mockReset()
        client.create.mockResolvedValue({
          data: simpleAccountFixtureWithMasterRelation
        })
        client.create.mockResolvedValueOnce({ data: fixtures.parentAccount })
      })

      it('creates parent account', async () => {
        await createAccount(
          fixtures.konnectorWithAggregator,
          fixtures.simpleAccount
        )

        expect(client.create).toHaveBeenCalledWith('io.cozy.accounts', {
          _id: fixtures.konnectorWithAggregator.aggregator.accountId
        })
      })

      it('adds permissions to parent account', async () => {
        await createAccount(
          fixtures.konnectorWithAggregator,
          fixtures.simpleAccount
        )

        expect(client.collection().add).toHaveBeenCalledWith(
          fixtures.konnectorWithAggregator,
          fixtures.accountPermissions.permissions
        )
      })

      it('creates child account', async () => {
        await createAccount(
          fixtures.konnectorWithAggregator,
          fixtures.simpleAccount
        )

        expect(client.create).toHaveBeenCalledWith(
          'io.cozy.accounts',
          simpleAccountFixtureWithMasterRelation
        )
      })

      it('throws error if get fails', async () => {
        client.get.mockReset()
        client.get.mockRejectedValue(new Error('Mocked error'))

        await expect(
          createAccount(
            fixtures.konnectorWithAggregator,
            fixtures.simpleAccount
          )
        ).rejects.toEqual(
          new Error(
            'An error occurred when finding parent account kaggregated-aggregator (Mocked error)'
          )
        )
      })

      it('throws error if permission add fails', async () => {
        client
          .collection()
          .add.mockRejectedValueOnce(new Error('Mocked add Error'))
        await expect(
          createAccount(
            fixtures.konnectorWithAggregator,
            fixtures.simpleAccount
          )
        ).rejects.toEqual(
          new Error(
            'Cannot set permission for account kaggregated-aggregator (Mocked add Error)'
          )
        )
      })

      it('returns child account', async () => {
        const account = await createAccount(
          fixtures.konnectorWithAggregator,
          fixtures.simpleAccount
        )

        expect(account).toEqual(simpleAccountFixtureWithMasterRelation)
      })

      it('throws error if parent account creation fails', async () => {
        client.create.mockReset()
        client.create.mockRejectedValue(new Error('Mocked error'))

        await expect(
          createAccount(
            fixtures.konnectorWithAggregator,
            fixtures.simpleAccount
          )
        ).rejects.toEqual(
          new Error(
            'Cannot create parent account kaggregated-aggregator (Mocked error)'
          )
        )
      })

      it('throws error if child account creation fails', async () => {
        client.create.mockReset()
        client.create.mockResolvedValueOnce({ data: fixtures.parentAccount })
        client.create.mockRejectedValue(new Error('Mocked error'))

        await expect(
          createAccount(
            fixtures.konnectorWithAggregator,
            fixtures.simpleAccount
          )
        ).rejects.toEqual(new Error('Mocked error'))
      })
    })

    describe('if parent account exists', () => {
      beforeEach(() => {
        client.query.mockReset()
        client.query = jest
          .fn()
          .mockResolvedValue({ data: [fixtures.parentAccount] })
        client.create.mockResolvedValue({
          data: simpleAccountFixtureWithMasterRelation
        })
      })

      it('does not create parent account', async () => {
        await createAccount(
          fixtures.konnectorWithAggregator,
          fixtures.simpleAccount
        )

        expect(client.create).not.toHaveBeenCalledWith('io.cozy.accounts', {
          _id: fixtures.konnectorWithAggregator.aggregator.accountId
        })
      })

      it('adds permissions to parent account', async () => {
        await createAccount(
          fixtures.konnectorWithAggregator,
          fixtures.simpleAccount
        )

        expect(client.collection().add).toHaveBeenCalledWith(
          fixtures.konnectorWithAggregator,
          fixtures.accountPermissions.permissions
        )
      })

      it('creates child account', async () => {
        await createAccount(
          fixtures.konnectorWithAggregator,
          fixtures.simpleAccount
        )

        expect(client.create).toHaveBeenCalledWith(
          'io.cozy.accounts',
          simpleAccountFixtureWithMasterRelation
        )
      })

      it('returns child account', async () => {
        const account = await createAccount(
          fixtures.konnectorWithAggregator,
          fixtures.simpleAccount
        )

        expect(account).toEqual(simpleAccountFixtureWithMasterRelation)
      })

      it('throws error if get fails', async () => {
        client.get.mockReset()
        client.get.mockRejectedValue(new Error('Mocked error'))

        await expect(
          createAccount(
            fixtures.konnectorWithAggregator,
            fixtures.simpleAccount
          )
        ).rejects.toEqual(
          new Error(
            'An error occurred when finding parent account kaggregated-aggregator (Mocked error)'
          )
        )
      })

      it('throws error if child account creation fails', async () => {
        client.create.mockReset()
        client.create.mockRejectedValueOnce(new Error('Mocked error'))

        await expect(
          createAccount(
            fixtures.konnectorWithAggregator,
            fixtures.simpleAccount
          )
        ).rejects.toEqual(new Error('Mocked error'))
      })
    })
  })

  describe('updateAccount', () => {
    it('call CozyClient::save and returns account', async () => {
      const account = await updateAccount(fixtures.simpleAccount)
      expect(client.save).toHaveBeenCalledWith(fixtures.simpleAccount)
      expect(account).toEqual(fixtures.simpleAccount)
    })
  })
})
