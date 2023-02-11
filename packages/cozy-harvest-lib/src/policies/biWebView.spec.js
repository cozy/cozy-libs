import CozyClient from 'cozy-client'
import {
  handleOAuthAccount,
  checkBIConnection,
  isBiWebViewConnector,
  refreshContracts,
  fetchExtraOAuthUrlParams,
  isCacheExpired
} from './biWebView'
import ConnectionFlow from '../models/ConnectionFlow'
import flag from 'cozy-flags'

jest.mock('../services/bi-http', () => ({
  createBIConnection: jest
    .fn()
    .mockResolvedValue({ text: Promise.resolve('{}') }),
  updateBIConnection: jest.fn(),
  getBIConnectionAccountsList: jest.fn(),
  getBIConnection: jest.fn()
}))

import {
  getBIConnectionAccountsList,
  getBIConnection
} from '../services/bi-http'

jest.mock('cozy-logger', () => ({
  namespace: () => () => {}
}))

jest.mock('../services/jobUtils', () => ({
  waitForRealtimeEvent: jest.fn()
}))

const realtimeMock = {
  subscribe: jest.fn(),
  unsubscribe: jest.fn()
}

const TEST_BANK_COZY_ID = '100000'

const konnector = {
  slug: 'boursorama83',
  parameters: {
    bankId: TEST_BANK_COZY_ID
  },
  partnership: {
    domain: 'https://budget-insight.com'
  }
}

const konnectorWithMultipleBankIds = {
  slug: 'cic45',
  fields: {
    bankId: {
      type: 'dropdown',
      label: 'branchName',
      options: [
        {
          name: 'Autre',
          value: '45'
        },
        {
          name: 'Bretagne (Particuliers)',
          value: '46'
        }
      ]
    }
  }
}

const account = {
  _id: '1337'
}

describe('handleOAuthAccount', () => {
  it('should handle bi webview authentication if any connection is found in the account', async () => {
    const client = new CozyClient({
      uri: 'http://testcozy.mycozy.cloud'
    })
    client.plugins = { realtime: realtimeMock }
    const flow = new ConnectionFlow(client, null, konnector)
    flow.account = account
    flow.handleFormSubmit = jest.fn()
    flow.saveAccount = async account => account
    const account = { oauth: { query: { connection_id: ['12'] } } }
    const t = jest.fn()
    await handleOAuthAccount({
      account,
      flow,
      client,
      konnector,
      t
    })
    expect(flow.handleFormSubmit).toHaveBeenCalledWith({
      client,
      konnector,
      t,
      account: {
        ...account,
        ...{ auth: { bankIds: [TEST_BANK_COZY_ID] } },
        ...{ data: { auth: { bi: { connId: 12 } } } }
      }
    })
  })
  it('should handle reconnection', async () => {
    const client = new CozyClient({
      uri: 'http://testcozy.mycozy.cloud'
    })
    client.plugins = { realtime: realtimeMock }
    const flow = new ConnectionFlow(client, null, konnector)
    flow.account = account
    flow.handleFormSubmit = jest.fn()
    flow.saveAccount = jest.fn()
    const account = { data: { auth: { bi: { connId: 15 } } } }
    const t = jest.fn()
    const result = await handleOAuthAccount({
      account,
      flow,
      client,
      konnector,
      reconnect: true,
      t
    })
    expect(flow.handleFormSubmit).not.toHaveBeenCalled()
    expect(flow.saveAccount).not.toHaveBeenCalled()
    expect(result).toEqual(true)
  })
})

describe('checkBIConnection', () => {
  const setup = () => {
    const client = new CozyClient({
      uri: 'http://testcozy.mycozy.cloud'
    })
    client.plugins = { realtime: realtimeMock }
    const flow = new ConnectionFlow(client, null, konnector)
    jest.spyOn(client, 'query').mockImplementation(async () => ({ data: [] }))

    return { client, flow }
  }

  it('should refuse to create an account with a bi connection id which already exists', async () => {
    const { client, flow } = setup()

    const account = {}

    const konnector = {
      slug: 'bankingconnectortest',
      parameters: {
        bankId: TEST_BANK_COZY_ID
      }
    }

    jest.spyOn(flow, 'saveAccount').mockImplementation(account => ({
      _id: 'created-account-id',
      ...account
    }))

    jest.spyOn(client, 'query').mockImplementation(async ({ doctype }) => {
      if (doctype === 'io.cozy.accounts') {
        return {
          data: [
            {
              _id: 'account_id',
              auth: { bi: { connId: 12 } }
            }
          ]
        }
      } else if (doctype === 'io.cozy.triggers') {
        return {
          data: [
            {
              message: { account: 'account_id' }
            }
          ]
        }
      } else if (doctype === 'io.cozy.bank.settings') {
        return {
          data: null
        }
      } else {
        throw new Error('unexpected doctype ' + doctype)
      }
    })

    await expect(
      checkBIConnection({
        client,
        flow,
        account,
        konnector
      })
    ).rejects.toEqual(new Error('ACCOUNT_WITH_SAME_IDENTIFIER_ALREADY_DEFINED'))
  })
})

describe('isBiWebViewConnector', () => {
  const BIConnector = {
    slug: 'biconnector',
    partnership: { domain: 'budget-insight.com' }
  }
  const notBIConnector = {
    slug: 'otherconnector'
  }
  it('should return true if the connector is a BI connector and if the  "harvest.bi.webview" is activated', () => {
    flag('harvest.bi.webview', true)
    expect(isBiWebViewConnector(BIConnector)).toEqual(true)
  })
  it('should return false if the connector is not a BI connector', () => {
    flag('harvest.bi.webview', true)
    expect(isBiWebViewConnector(notBIConnector)).toEqual(false)
  })
  it('should return false if the "harvest.bi.webview" flag is not activated', () => {
    flag('harvest.bi.webview', false)
    expect(isBiWebViewConnector(BIConnector)).toEqual(false)
  })
})

describe('refreshContracts', () => {
  it('update current contracts with values from BI', async () => {
    const client = new CozyClient({
      uri: 'http://testcozy.mycozy.cloud'
    })
    client.plugins = { realtime: realtimeMock }
    client.store.dispatch = jest.fn()
    client.query = jest
      .fn()
      .mockResolvedValueOnce({
        data: {
          mode: 'prod',
          timestamp: Date.now(),
          biMapping: {},
          url: 'https://cozy.biapi.pro/2.0',
          clientId: 'test-client-id',
          code: 'bi-temporary-access-token-145613'
        }
      })
      .mockResolvedValue({
        data: [
          {
            vendorId: '1',
            metadata: { imported: true }
          },
          {
            vendorId: '2',
            metadata: { imported: false, disabledAt: '2022-08-05 12:00:00' }
          },
          {
            vendorId: '3',
            metadata: { imported: true }
          },
          {
            vendorId: '4',
            metadata: { imported: false, disabledAt: '2022-08-05 12:01:00' }
          }
        ]
      })
    getBIConnectionAccountsList.mockResolvedValue({
      accounts: [
        { id: 1, disabled: '2022-05-25 12:00:00' },
        { id: 2, disabled: null },
        { id: 3, disabled: '2022-05-25 12:01:00' },
        { id: 4, disabled: null }
      ]
    })

    await refreshContracts({ client, konnector, account: {} })
    expect(client.store.dispatch).toHaveBeenCalledTimes(4)
    expect(client.store.dispatch).toHaveBeenNthCalledWith(1, {
      definition: {},
      mutationId: 'contract-memory-update',
      response: {
        data: [
          {
            metadata: {
              disabledAt: '2022-05-25T12:00:00',
              imported: false
            },
            vendorId: '1'
          }
        ]
      },
      type: 'RECEIVE_MUTATION_RESULT'
    })
    expect(client.store.dispatch).toHaveBeenNthCalledWith(2, {
      definition: {},
      mutationId: 'contract-memory-update',
      response: {
        data: [
          {
            metadata: {
              disabledAt: undefined,
              imported: true
            },
            vendorId: '2'
          }
        ]
      },
      type: 'RECEIVE_MUTATION_RESULT'
    })
    expect(client.store.dispatch).toHaveBeenNthCalledWith(3, {
      definition: {},
      mutationId: 'contract-memory-update',
      response: {
        data: [
          {
            metadata: { disabledAt: '2022-05-25T12:01:00', imported: false },
            vendorId: '3'
          }
        ]
      },
      type: 'RECEIVE_MUTATION_RESULT'
    })
    expect(client.store.dispatch).toHaveBeenNthCalledWith(4, {
      definition: {},
      mutationId: 'contract-memory-update',
      response: {
        data: [
          {
            metadata: { disabledAt: undefined, imported: true },
            vendorId: '4'
          }
        ]
      },
      type: 'RECEIVE_MUTATION_RESULT'
    })
  })
})

describe('isCacheExpired', () => {
  it('should not be marked as expired when userId did not change and cache is not old', () => {
    const tokenCache = { timestamp: Date.now(), userId: 666 }
    const biUser = { userId: 666 }
    expect(isCacheExpired(tokenCache, biUser)).toBe(false)
  })
  it('should be marked as expired when userId did not change and cache is old', () => {
    const tokenCache = { timestamp: 0, userId: 666 }
    const biUser = { userId: 666 }
    expect(isCacheExpired(tokenCache, biUser)).toBe(true)
  })
  it('should be marked as expired when userId did change and cache is old', () => {
    const tokenCache = { timestamp: 0, userId: 666 }
    const biUser = { userId: 667 }
    expect(isCacheExpired(tokenCache, biUser)).toBe(true)
  })
  it('should be marked as expired when userId did change and cache is not old', () => {
    const tokenCache = { timestamp: Date.now(), userId: 666 }
    const biUser = { userId: 667 }
    expect(isCacheExpired(tokenCache, biUser)).toBe(true)
  })
  it('should be marked as expired when cache has no user id', () => {
    const tokenCache = { timestamp: Date.now() }
    const biUser = { userId: 666 }
    expect(isCacheExpired(tokenCache, biUser)).toBe(true)
  })
})

describe('fetchExtraOAuthUrlParams', () => {
  it('should asynchronously fetch BI token', async () => {
    const client = new CozyClient({
      uri: 'http://testcozy.mycozy.cloud'
    })
    client.query = jest.fn().mockResolvedValue({
      data: {
        timestamp: Date.now(),
        code: 'bi-temporary-access-token-123',
        biMapping: {}
      }
    })
    const result = await fetchExtraOAuthUrlParams({
      client,
      konnector,
      account
    })
    expect(result).toMatchObject({ token: 'bi-temporary-access-token-123' })
  })

  it('should add id_connector param for multiple bank ids', async () => {
    const client = new CozyClient({
      uri: 'http://testcozy.mycozy.cloud'
    })
    client.query = jest.fn().mockResolvedValue({
      data: {
        timestamp: Date.now(),
        code: 'bi-temporary-access-token-123',
        biMapping: { [TEST_BANK_COZY_ID]: 2 }
      }
    })
    const result = await fetchExtraOAuthUrlParams({
      client,
      konnector,
      account
    })
    expect(result).toMatchObject({ id_connector: [2] })
  })

  it('should get biBankIds associated to the konnector, even if other bank ids are in cache', async () => {
    const client = new CozyClient({
      uri: 'http://testcozy.mycozy.cloud'
    })
    client.query = jest.fn().mockResolvedValue({
      data: {
        timestamp: Date.now(),
        code: 'bi-temporary-access-token-123',
        biMapping: { [TEST_BANK_COZY_ID]: 2 },
        biBankIds: [1, 2, 3]
      }
    })
    const result = await fetchExtraOAuthUrlParams({
      client,
      konnector,
      account
    })
    expect(result).toMatchObject({ id_connector: [2] })
  })

  it('should fetch reconnect params', async () => {
    const client = new CozyClient({
      uri: 'http://testcozy.mycozy.cloud'
    })
    client.query = jest.fn().mockResolvedValue({
      data: {
        timestamp: Date.now(),
        code: 'bi-temporary-access-token-12',
        biMapping: { [TEST_BANK_COZY_ID]: 2 }
      }
    })
    const result = await fetchExtraOAuthUrlParams({
      client,
      konnector,
      account: { ...account, data: { auth: { bi: { connId: 15 } } } },
      reconnect: true
    })
    expect(result).toMatchObject({
      connection_id: 15,
      code: 'bi-temporary-access-token-12'
    })
  })

  it('should fetch manage params', async () => {
    const client = new CozyClient({
      uri: 'http://testcozy.mycozy.cloud'
    })
    client.query = jest.fn().mockResolvedValue({
      data: {
        timestamp: Date.now(),
        code: 'bi-temporary-access-token-12-manage',
        biMapping: { [TEST_BANK_COZY_ID]: 2 }
      }
    })
    const result = await fetchExtraOAuthUrlParams({
      client,
      konnector,
      account: { ...account, data: { auth: { bi: { connId: 15 } } } },
      manage: true
    })
    expect(result).toMatchObject({
      connection_id: 15,
      code: 'bi-temporary-access-token-12-manage'
    })
  })

  it('should get bi connection bank id if multiple biBankIds are in the mapping', async () => {
    const client = new CozyClient({
      uri: 'http://testcozy.mycozy.cloud'
    })
    client.query = jest.fn().mockResolvedValue({
      data: {
        timestamp: Date.now(),
        code: 'bi-temporary-access-token-12',
        biMapping: { [TEST_BANK_COZY_ID]: 2, 12: 2, 45: 3, 46: 4 }
      }
    })
    getBIConnection.mockResolvedValueOnce({
      id_bank: 4
    })
    const result = await fetchExtraOAuthUrlParams({
      client,
      konnector: konnectorWithMultipleBankIds,
      account: { ...account, data: { auth: { bi: { connId: 15 } } } }
    })
    expect(result).toEqual({
      id_connector: 4,
      token: 'bi-temporary-access-token-12'
    })
  })
})