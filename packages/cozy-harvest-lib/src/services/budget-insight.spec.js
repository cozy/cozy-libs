import CozyClient from 'cozy-client'
import {
  createOrUpdateBIConnection,
  onBIAccountCreation,
  getBIConfigForCozyURL
} from './budget-insight'
import { waitForRealtimeEvent } from './jobUtils'
import { createBIConnection, updateBIConnection } from './bi-http'
import merge from 'lodash/merge'
import ConnectionFlow from '../models/ConnectionFlow'

jest.mock('../connections/accounts', () => ({
  saveAccount: jest.fn().mockImplementation(async account => account)
}))
jest.mock('./jobUtils', () => ({
  waitForRealtimeEvent: jest.fn()
}))

jest.mock('./bi-http', () => ({
  createBIConnection: jest
    .fn()
    .mockResolvedValue({ text: Promise.resolve('{}') }),
  updateBIConnection: jest.fn()
}))

const TEST_BANK_COZY_ID = '100000'
const TEST_BANK_BI_ID = 40

expect.extend({
  toBeJWEValue(received) {
    // Crude check for a JSON Web Encryption value
    // https://tools.ietf.org/html/rfc7516 for the JWE RFC
    const pass =
      received.startsWith('eyJlbmM') && received.split('.').length == 5

    if (pass) {
      return {
        message: () => `expected ${received} not to be a JWE value`,
        pass: true
      }
    } else {
      return {
        message: () => `expected ${received} to be a JWE value`,
        pass: false
      }
    }
  }
})

const konnector = {
  slug: 'boursorama83',
  parameters: {
    bankId: TEST_BANK_COZY_ID
  }
}
const account = {
  _id: '1337',
  auth: {
    login: '80546578',
    secret: 'secretsecret'
  }
}

const sleep = duration => new Promise(resolve => setTimeout(resolve, duration))

describe('getBIConfigForCozyURL', () => {
  it('should correctly work', () => {
    expect(getBIConfigForCozyURL().mode).toBe('dev')
    expect(getBIConfigForCozyURL('http://cozy.tools:8080').mode).toBe('dev')
    expect(getBIConfigForCozyURL('https://test.cozy.works').mode).toBe('dev')
    expect(getBIConfigForCozyURL('https://test.cozy.rocks').mode).toBe('prod')
    expect(getBIConfigForCozyURL('https://test.mycozy.cloud').mode).toBe('prod')
  })
})

describe('createOrUpdateBIConnection', () => {
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
            code: 'bi-temporary-access-token-145613'
          }
        }
      }
    })

    createBIConnection
      .mockReset()
      .mockResolvedValue({ id: 'created-bi-connection-id-789' })
    updateBIConnection
      .mockReset()
      .mockResolvedValue({ id: 'updated-bi-connection-id-789' })
    return { client, flow }
  }

  it('should create a BI connection if no connection id in account', async () => {
    const { client, flow } = setup()
    const connection = await createOrUpdateBIConnection({
      client,
      account,
      konnector,
      flow
    })
    expect(waitForRealtimeEvent).toHaveBeenCalledWith(
      client,
      {
        _id: 'job-id-1337'
      },
      'result'
    )
    expect(createBIConnection).toHaveBeenCalledWith(
      expect.any(Object),
      {
        id_bank: TEST_BANK_BI_ID,
        login: expect.toBeJWEValue(),
        password: expect.toBeJWEValue()
      },
      'bi-temporary-access-token-145613'
    )
    expect(updateBIConnection).not.toHaveBeenCalled()
    expect(connection).toEqual({ id: 'created-bi-connection-id-789' })
  })

  it('should update the BI connection if connection id in account', async () => {
    const { client, flow } = setup()
    const connection = await createOrUpdateBIConnection({
      client,
      flow,
      account: merge(account, {
        data: {
          auth: {
            bi: {
              connId: 1337
            }
          }
        }
      }),
      konnector
    })
    expect(waitForRealtimeEvent).toHaveBeenCalledWith(
      client,
      {
        _id: 'job-id-1337'
      },
      'result'
    )
    expect(createBIConnection).not.toHaveBeenCalled()
    expect(updateBIConnection).toHaveBeenCalledWith(
      expect.any(Object),
      1337,
      {
        id_bank: TEST_BANK_BI_ID,
        login: expect.toBeJWEValue(),
        password: expect.toBeJWEValue()
      },
      'bi-temporary-access-token-145613'
    )
    expect(connection).toEqual({ id: 'updated-bi-connection-id-789' })
  })

  it('should convert wrongpass correctly', async () => {
    const { client, flow } = setup()
    const err = new Error()
    err.code = 'wrongpass'
    updateBIConnection.mockReset().mockRejectedValue(err)
    await expect(
      createOrUpdateBIConnection({
        client,
        flow,
        account: merge(account, {
          data: {
            auth: {
              bi: {
                connId: 1337
              }
            }
          }
        }),
        konnector
      })
    ).rejects.toEqual(new Error('LOGIN_FAILED'))
  })

  it('should convert SCARequired correctly', async () => {
    const { client, flow } = setup()
    const err = new Error()
    err.code = 'SCARequired'
    updateBIConnection.mockReset().mockRejectedValue(err)
    await expect(
      createOrUpdateBIConnection({
        client,
        flow,
        account: merge(account, {
          data: {
            auth: {
              bi: {
                connId: 1337
              }
            }
          }
        }),
        konnector
      })
    ).rejects.toEqual(new Error('USER_ACTION_NEEDED.SCA_REQUIRED'))
  })

  it('should remove sensible data from account and create bi connection', async () => {
    const { client, flow } = setup()

    const account = {
      auth: {
        login: '1234',
        password: '4567',
        dob: '20/12/1890',
        bankId: '100000'
      }
    }

    const konnector = {
      slug: 'bankingconnectortest'
    }

    jest.spyOn(flow, 'saveAccount').mockImplementation(account => ({
      _id: 'created-account-id',
      ...account
    }))

    const createOrUpdateBIConnection = jest
      .fn()
      .mockResolvedValue({ id: 'created-bi-connection-id' })

    const accountToSave = await onBIAccountCreation({
      client,
      flow,
      account,
      konnector,
      createOrUpdateBIConnectionFn: createOrUpdateBIConnection
    })

    expect(createOrUpdateBIConnection).toHaveBeenCalledWith(
      expect.objectContaining({
        account: {
          _id: 'created-account-id',
          auth: {
            bankId: '100000',
            login: '1234',
            password: '4567',
            dob: '20/12/1890'
          }
        }
      })
    )

    expect(flow.saveAccount).toHaveBeenCalledWith({
      auth: {
        login: '1234',
        bankId: '100000'
      }
    })

    expect(accountToSave).toEqual({
      _id: 'created-account-id',
      auth: {
        login: '1234',
        bankId: '100000'
      },
      data: {
        auth: {
          bi: {
            connId: 'created-bi-connection-id'
          }
        }
      }
    })
  })
})
