import CozyClient from 'cozy-client'
import {
  handleOAuthAccount,
  checkBIConnection,
  isBiWebViewConnector
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
  getBIConnection: jest.fn()
}))

import { getBIConnection } from './bi-http'

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
        ...{ auth: { bankId: TEST_BANK_COZY_ID } },
        ...{ data: { auth: { bi: { connId: 12 } } } }
      }
    })
  })
})

describe('checkBIConnection', () => {
  const setup = () => {
    const client = new CozyClient({
      uri: 'http://testcozy.mycozy.cloud'
    })
    const flow = new ConnectionFlow(client, { konnector, account })
    client.stackClient.jobs.create = jest.fn().mockReturnValue({
      data: {
        attributes: {
          _id: 'job-id-1337'
        }
      }
    })
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
