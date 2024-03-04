/* eslint-env jest */

import {
  createAccount,
  updateAccount,
  saveAccount,
  deleteAccount,
  fetchReusableAccount
} from 'connections/accounts'
import omit from 'lodash/omit'

import CozyClient from 'cozy-client'

import fixtureFile from '../../test/fixtures'

const client = {
  collection: jest.fn().mockReturnValue({
    add: jest.fn(),
    get: jest.fn(),
    all: jest.fn()
  }),
  create: jest.fn(),
  destroy: jest.fn(),
  query: jest.fn(),
  save: jest.fn(),
  where: jest.fn(),
  stackClient: {
    uri: 'cozy.tools:8080',
    token: {
      token: '1234abcd'
    }
  },
  find: jest.fn().mockReturnValue({
    where: jest.fn()
  }),
  options: {
    uri: 'cozy.tools:8080'
  },
  on: () => jest.fn()
}

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
    _id: 'simple-account-id',
    account_type: 'test',
    auth: {
      login: 'login',
      password: 'pass'
    }
  },
  existingAccount: {
    _id: '561be660ff384ce0846c8f20e829ad62',
    account_type: 'test',
    auth: {
      login: 'login',
      password: 'pass'
    },
    relationships: {
      contracts: {
        data: [{ _id: 'contract-id-1', _type: 'io.cozy.bank.accounts' }]
      }
    }
  },
  parentAccount: {
    _id: 'kaggregated-aggregator'
  }
}

describe('Account mutations', () => {
  beforeEach(() => {
    client.create.mockResolvedValue({ data: fixtures.existingAccount })
    client.save.mockImplementation(async account => ({ data: account }))
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
        client,
        fixtures.konnector,
        fixtures.simpleAccount
      )

      expect(client.create).toHaveBeenCalledWith(
        'io.cozy.accounts',
        fixtures.simpleAccount
      )
      expect(account).toEqual(fixtures.existingAccount)
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
      client.query.mockResolvedValue({
        data: simpleAccountFixtureWithMasterRelation
      })
    })

    it('throws an error when konnector have no aggregator.accountId attribute', async () => {
      const konnector = { aggregator: {} }
      await expect(
        createAccount(client, konnector, fixtures.simpleAccount)
      ).rejects.toEqual(
        new Error('Konnector does not provide aggregator account id')
      )
    })

    describe('if parent account does not exist', () => {
      beforeEach(() => {
        client.query = jest.fn().mockRejectedValue({ status: 404 })

        client.create.mockReset()
        client.create.mockResolvedValue({
          data: simpleAccountFixtureWithMasterRelation
        })
        client.create.mockResolvedValueOnce({ data: fixtures.parentAccount })
      })

      it('creates parent account', async () => {
        await createAccount(
          client,
          fixtures.konnectorWithAggregator,
          fixtures.simpleAccount
        )

        expect(client.create).toHaveBeenCalledWith('io.cozy.accounts', {
          _id: fixtures.konnectorWithAggregator.aggregator.accountId
        })
      })

      it('adds permissions to parent account', async () => {
        await createAccount(
          client,
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
          client,
          fixtures.konnectorWithAggregator,
          fixtures.simpleAccount
        )

        expect(client.create).toHaveBeenCalledWith(
          'io.cozy.accounts',
          simpleAccountFixtureWithMasterRelation
        )
      })

      it('throws error if get fails', async () => {
        client.query.mockReset()
        client.query.mockRejectedValue(new Error('Mocked error'))

        await expect(
          createAccount(
            client,
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
            client,
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
          client,
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
            client,
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
            client,
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
          client,
          fixtures.konnectorWithAggregator,
          fixtures.simpleAccount
        )

        expect(client.create).not.toHaveBeenCalledWith('io.cozy.accounts', {
          _id: fixtures.konnectorWithAggregator.aggregator.accountId
        })
      })

      it('adds permissions to parent account', async () => {
        await createAccount(
          client,
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
          client,
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
          client,
          fixtures.konnectorWithAggregator,
          fixtures.simpleAccount
        )

        expect(account).toEqual(simpleAccountFixtureWithMasterRelation)
      })

      it('throws error if get fails', async () => {
        client.query.mockReset()
        client.query.mockRejectedValue(new Error('Mocked error'))

        await expect(
          createAccount(
            client,
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
            client,
            fixtures.konnectorWithAggregator,
            fixtures.simpleAccount
          )
        ).rejects.toEqual(new Error('Mocked error'))
      })
    })
  })

  describe('updateAccount', () => {
    it('calls CozyClient::save and returns account', async () => {
      const account = await updateAccount(client, fixtures.simpleAccount)
      expect(client.save).toHaveBeenCalledWith(fixtures.simpleAccount)
      expect(account).toEqual(fixtures.simpleAccount)
    })
  })

  describe('deleteAccount', () => {
    it('calls CozyClient::destroy', async () => {
      await deleteAccount(client, fixtures.simpleAccount)
      expect(client.destroy).toHaveBeenCalledWith(fixtures.simpleAccount)
    })

    describe('when there is a conflict', () => {
      it('should re-fetch the account and retry', async () => {
        client.destroy.mockRejectedValueOnce({ status: 409 })
        client.query.mockResolvedValueOnce([
          { _id: 'account1', _type: 'io.cozy.accounts' }
        ])

        await deleteAccount(client, fixtures.simpleAccount)

        expect(client.query).toHaveBeenCalled()
        expect(client.destroy).toHaveBeenCalledTimes(2)
      })
    })
  })

  describe('saveAccount', () => {
    it('calls CozyClient::create for new account', async () => {
      const newSimpleAccount = omit(fixtures.simpleAccount, '_id')
      const account = await saveAccount(
        client,
        fixtures.konnector,
        newSimpleAccount
      )

      expect(client.create).toHaveBeenCalledWith('io.cozy.accounts', {
        ...newSimpleAccount,
        cozyMetadata: { sourceAccountIdentifier: 'login' }
      })
      expect(account).toEqual(fixtures.existingAccount)
    })

    it('calls CozyClient::save for existing account', async () => {
      const account = await saveAccount(
        client,
        fixtures.konnector,
        fixtures.existingAccount
      )
      const accountWithSourceAccountIdentifier = {
        ...fixtures.existingAccount,
        cozyMetadata: { sourceAccountIdentifier: 'login' }
      }
      expect(client.save).toHaveBeenCalledWith(
        accountWithSourceAccountIdentifier
      )
      expect(account).toStrictEqual(accountWithSourceAccountIdentifier)
    })
  })
})

describe('fetchReusableAccount', () => {
  const setup = ({ accounts, triggers }) => {
    const client = new CozyClient({})
    client.query = jest.fn().mockImplementation(() => {
      return {
        data: accounts
      }
    })

    client.queryAll = jest.fn().mockImplementation(() => {
      return triggers
    })
    return { client }
  }
  it('should return the right account when possible', async () => {
    const { client } = setup({
      accounts: fixtureFile.accounts,
      triggers: fixtureFile.triggers
    })
    await expect(
      fetchReusableAccount(client, fixtures.konnector)
    ).resolves.toEqual({
      account_type: 'konnectest',
      auth: { login: 'goodlogin', password: 'secretpassword' }
    })
    expect(client.query).toHaveBeenCalledWith(
      expect.objectContaining({
        selector: {
          _id: {
            $nin: ['otherslug-account', 'otherslug-account2']
          }
        }
      })
    )
  })

  it('should return undefined when no correct account available', async () => {
    const { client } = setup({ accounts: [], triggers: fixtureFile.triggers })
    await expect(
      fetchReusableAccount(client, fixtures.konnector)
    ).resolves.toBe(undefined)
  })
})
