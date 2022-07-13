import CozyClient from 'cozy-client'
import {
  handleOAuthAccount,
  checkBIConnection,
  isBiWebViewConnector,
  fetchContractSynchronizationUrl,
  refreshContracts,
  fetchExtraOAuthUrlParams
} from './biWebView'
import ConnectionFlow from '../models/ConnectionFlow'
import { waitForRealtimeEvent } from './jobUtils'
import biPublicKeyProd from './bi-public-key-prod.json'
import flag from 'cozy-flags'

jest.mock('./bi-http', () => ({
  createBIConnection: jest
    .fn()
    .mockResolvedValue({ text: Promise.resolve('{}') }),
  updateBIConnection: jest.fn(),
  getBIConnection: jest.fn(),
  getBIConnectionAccountsList: jest.fn()
}))

import { getBIConnection, getBIConnectionAccountsList } from './bi-http'

jest.mock('cozy-logger', () => ({
  namespace: () => () => {}
}))

jest.mock('./jobUtils', () => ({
  waitForRealtimeEvent: jest.fn()
}))

const sleep = duration => new Promise(resolve => setTimeout(resolve, duration))

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

const account = {
  _id: '1337'
}

describe('handleOAuthAccount', () => {
  it('should handle bi webview authentication if any connection is found in the account', async () => {
    const client = new CozyClient({
      uri: 'http://testcozy.mycozy.cloud'
    })
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
    expect(result).toEqual(15)
  })
})

describe('checkBIConnection', () => {
  const setup = () => {
    const client = new CozyClient({
      uri: 'http://testcozy.mycozy.cloud'
    })
    const flow = new ConnectionFlow(client, { konnector, account })
    waitForRealtimeEvent.mockImplementation(async () => {
      sleep(2)
      return {
        data: {
          result: {
            mode: 'prod',
            url: 'https://cozy.biapi.pro/2.0',
            publicKey: biPublicKeyProd,
            code: 'bi-temporary-access-token-145613'
          }
        }
      }
    })
    jest.spyOn(client, 'query').mockImplementation(async () => ({ data: [] }))
    client.save = jest.fn().mockResolvedValue({
      data: {
        mode: 'prod',
        url: 'https://cozy.biapi.pro/2.0',
        publicKey: biPublicKeyProd,
        code: 'bi-temporary-access-token-145613',
        biMapping: {}
      }
    })
    client.query = jest.fn()
    client.stackClient.jobs.create = jest.fn().mockReturnValue({
      data: {
        attributes: {
          _id: 'job-id-1337'
        }
      }
    })

    return { client, flow }
  }

  it('should refuse to create an account with a bi connection id which already exists', async () => {
    const { client, flow } = setup()

    getBIConnection.mockReset().mockResolvedValue({
      id: 12
    })

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

describe('fetchContractSynchronizationUrl', () => {
  it('should provide a proper bi manage webview url', async () => {
    const client = new CozyClient({
      uri: 'http://testcozy.mycozy.cloud'
    })
    client.query = jest.fn().mockResolvedValue({
      data: {
        mode: 'prod',
        timestamp: Date.now(),
        biMapping: {},
        url: 'https://cozy.biapi.pro/2.0',
        clientId: 'test-client-id',
        code: 'bi-temporary-access-token-145613'
      }
    })

    const url = await fetchContractSynchronizationUrl({
      account: { ...account, data: { auth: { bi: { connId: 1337 } } } },
      client,
      konnector
    })
    expect(url).toEqual(
      'https://cozy.biapi.pro/2.0/auth/webview/manage?client_id=test-client-id&code=bi-temporary-access-token-145613&connection_id=1337'
    )
  })
})

describe('refreshContracts', () => {
  it('update current contracts with values from BI', async () => {
    const client = new CozyClient({
      uri: 'http://testcozy.mycozy.cloud'
    })
    client.save = jest.fn()
    client.query = jest.fn().mockResolvedValue({
      data: {
        mode: 'prod',
        timestamp: Date.now(),
        biMapping: {},
        url: 'https://cozy.biapi.pro/2.0',
        clientId: 'test-client-id',
        code: 'bi-temporary-access-token-145613'
      }
    })
    const accountWithContracts = {
      _id: 'testaccount',
      relationships: {
        contracts: {
          data: [
            { metadata: { vendorId: '1', imported: true } },
            {
              metadata: {
                vendorId: '2',
                imported: false,
                disabledAt: '2022-05-24T12:00:00'
              }
            },
            { metadata: { vendorId: '3', imported: true } },
            {
              metadata: {
                vendorId: '4',
                imported: false,
                disabledAt: '2022-05-23T13:00:00'
              }
            }
          ]
        }
      }
    }
    getBIConnectionAccountsList.mockResolvedValue({
      accounts: [
        { id: 1, disabled: '2022-05-25 12:00:00' },
        { id: 2, disabled: null },
        { id: 3, disabled: '2022-05-25 12:01:00' },
        { id: 4, disabled: null }
      ]
    })

    await refreshContracts({ client, konnector, account: accountWithContracts })
    expect(client.save).toHaveBeenCalledWith({
      _id: 'testaccount',
      relationships: {
        contracts: {
          data: [
            {
              metadata: {
                vendorId: '1',
                imported: false,
                disabledAt: '2022-05-25T12:00:00'
              }
            },
            { metadata: { vendorId: '2', imported: true } },
            {
              metadata: {
                vendorId: '3',
                imported: false,
                disabledAt: '2022-05-25T12:01:00'
              }
            },
            { metadata: { vendorId: '4', imported: true } }
          ]
        }
      }
    })
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

  it('should add id_connector param for mono bankId', async () => {
    const client = new CozyClient({
      uri: 'http://testcozy.mycozy.cloud'
    })
    client.query = jest.fn().mockResolvedValue({
      data: {
        timestamp: Date.now(),
        code: 'bi-temporary-access-token-123',
        biBankId: 12,
        biMapping: {}
      }
    })
    const result = await fetchExtraOAuthUrlParams({
      client,
      konnector,
      account
    })
    expect(result).toMatchObject({ id_connector: 12 })
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

  it('should fetch reconnect params if any connection id in the account', async () => {
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
      account: { ...account, data: { auth: { bi: { connId: 15 } } } }
    })
    expect(result).toMatchObject({
      connection_id: 15,
      code: 'bi-temporary-access-token-12'
    })
  })

  it('should not add connection_id param if not connection_id', async () => {
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
      account
    })
    expect(result).not.toHaveProperty('connection_id')
  })
})
