import CozyClient from 'cozy-client'
import {
  createOrUpdateBIConnection,
  onBIAccountCreation
} from './budget-insight'
import { waitForRealtimeResult } from './jobUtils'
import { createBIConnection, updateBIConnection } from './biUtils'
import merge from 'lodash/merge'

jest.mock('./jobUtils', () => ({
  waitForRealtimeResult: jest.fn()
}))

jest.mock('./biUtils', () => {
  const originalBIUtils = jest.requireActual('./biUtils')
  return {
    ...originalBIUtils,
    createBIConnection: jest.fn(),
    updateBIConnection: jest.fn()
  }
})

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

const sleep = duration => new Promise(resolve => setTimeout(resolve, duration))

describe('createOrUpdateBIConnection', () => {
  const setup = () => {
    const client = new CozyClient({
      uri: 'http://testcozy.mycozy.cloud'
    })
    client.stackClient.jobs.create = jest.fn().mockReturnValue({
      data: {
        attributes: {
          _id: 'job-id-1337'
        }
      }
    })
    waitForRealtimeResult.mockImplementation(async () => {
      sleep(2)
      return {
        data: {
          code: 'bi-temporary-access-token-145613'
        }
      }
    })

    createBIConnection
      .mockReset()
      .mockResolvedValue({ id: 'created-bi-connection-id-789' })
    updateBIConnection
      .mockReset()
      .mockResolvedValue({ id: 'updated-bi-connection-id-789' })
    return { client }
  }

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

  it('should create a BI connection if no connection id in account', async () => {
    const { client } = setup()
    const connection = await createOrUpdateBIConnection({
      client,
      account,
      konnector
    })
    expect(waitForRealtimeResult).toHaveBeenCalledWith(client, {
      _id: 'job-id-1337'
    })
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
    const { client } = setup()
    const connection = await createOrUpdateBIConnection({
      client,
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
    expect(waitForRealtimeResult).toHaveBeenCalledWith(client, {
      _id: 'job-id-1337'
    })
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

  it('should remove sensible data from account and create bi connection', async () => {
    const { client } = setup()

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

    const saveAccount = jest.fn().mockImplementation((konnector, account) => ({
      _id: 'created-account-id',
      ...account
    }))

    const createOrUpdateBIConnection = jest
      .fn()
      .mockResolvedValue({ id: 'created-bi-connection-id' })

    const accountToSave = await onBIAccountCreation({
      client,
      account,
      konnector,
      saveAccount,
      createOrUpdateBIConnectionFn: createOrUpdateBIConnection
    })

    expect(saveAccount).toHaveBeenCalledWith(konnector, {
      auth: {
        login: '1234',
        bankId: '100000'
      }
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
