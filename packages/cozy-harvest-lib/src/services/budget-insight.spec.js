import CozyClient from 'cozy-client'
import {
  createOrUpdateBIConnection,
  onBIAccountCreation,
  fetchExtraOAuthUrlParams,
  finishConnection,
  handleOAuthAccount,
  setSync,
  getBIConfig,
  saveBIConfig,
  updateBIConnectionFromFlow
} from './budget-insight'
import { waitForRealtimeEvent } from './jobUtils'
import {
  getBIConnection,
  createBIConnection,
  updateBIConnection
} from './bi-http'
import merge from 'lodash/merge'
import ConnectionFlow from '../models/ConnectionFlow'
import biPublicKeyProd from './bi-public-key-prod.json'
import { LOGIN_SUCCESS_EVENT } from '../models/flowEvents'

jest.mock('cozy-logger', () => ({
  namespace: () => () => {}
}))
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
  updateBIConnection: jest.fn(),
  getBIConnection: jest.fn()
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

const konnectorWithoutParam = {
  slug: 'lcl-linxo'
}

const account = {
  _id: '1337',
  auth: {
    login: '80546578',
    secret: 'secretsecret',
    bankId: TEST_BANK_COZY_ID
  }
}

const sleep = duration => new Promise(resolve => setTimeout(resolve, duration))

describe('finishConnection', () => {
  const setup = () => {
    const client = new CozyClient({
      uri: 'http://testcozy.mycozy.cloud'
    })
    const flow = new ConnectionFlow(client, { konnector, account })
    return { flow }
  }

  it('should not do anything when the connection state is ok', async () => {
    const { flow } = setup()
    flow.setData({
      biConnection: {
        id: 'testConnId',
        error: null
      }
    })
    flow.saveTwoFARequest = jest.fn()
    flow.triggerEvent = jest.fn()

    await finishConnection({ flow })
    expect(flow.saveTwoFARequest).not.toHaveBeenCalled()
    expect(flow.triggerEvent).toHaveBeenCalledWith(LOGIN_SUCCESS_EVENT)
  })

  it('should throw if connection error is not decoupled or additionalinfo', async () => {
    const { flow } = setup()
    flow.setData({
      biConnection: {
        id: 'testConnId',
        error: 'unknown error'
      }
    })
    flow.saveTwoFARequest = jest.fn()
    flow.triggerEvent = jest.fn()

    await expect(finishConnection({ flow })).rejects.toEqual(
      new Error('UNKNOWN_ERROR')
    )
    expect(flow.saveTwoFARequest).not.toHaveBeenCalled()
    expect(flow.triggerEvent).not.toHaveBeenCalled()
  })

  it('should handle one decoupled state', async () => {
    const { flow } = setup()
    flow.setData({
      biConnection: {
        id: 'testConnId',
        error: 'decoupled'
      },
      biConfig: { code: 'testCode' }
    })
    flow.account = {
      data: {
        auth: {
          bi: {
            connId: 'testConnId'
          }
        }
      }
    }

    flow.triggerEvent = jest.fn()
    flow.saveTwoFARequest = jest.fn()

    updateBIConnection
      .mockReset()
      .mockResolvedValue({ id: 'updated-bi-connection-id-789', error: null })
    await finishConnection({ flow })
    expect(flow.triggerEvent).toHaveBeenCalledWith(LOGIN_SUCCESS_EVENT)
    expect(updateBIConnection).toHaveBeenCalledWith(
      expect.any(Object),
      'testConnId',
      {
        resume: 'true'
      },
      'testCode'
    )
  })

  it('should handle one additional information needed state', async () => {
    const { flow } = setup()
    flow.setData({
      biConnection: {
        id: 'testConnId',
        error: 'additionalInformationNeeded'
      }
    })

    flow.triggerEvent = jest.fn()
    flow.saveTwoFARequest = jest.fn()
    flow.waitForTwoFA = jest.fn().mockImplementationOnce(async () => {
      flow.setData({
        biConnection: {
          id: 'testConnId',
          error: null
        }
      })
    })

    await finishConnection({ flow })
    expect(flow.triggerEvent).toHaveBeenCalledWith(LOGIN_SUCCESS_EVENT)
  })

  it('should handle multiple decoupled states', async () => {
    const { flow } = setup()
    flow.setData({
      biConnection: {
        id: 'testConnId',
        error: 'decoupled'
      },
      biConfig: { code: 'testCode' }
    })
    flow.account = {
      data: {
        auth: {
          bi: {
            connId: 'testConnId'
          }
        }
      }
    }

    flow.triggerEvent = jest.fn()
    flow.saveTwoFARequest = jest.fn()

    updateBIConnection
      .mockReset()
      .mockResolvedValueOnce({
        id: 'updated-bi-connection-id-789',
        error: 'decoupled'
      })
      .mockResolvedValueOnce({
        id: 'updated-bi-connection-id-789',
        error: null
      })
    await finishConnection({ flow })
    expect(flow.triggerEvent).toHaveBeenCalledWith(LOGIN_SUCCESS_EVENT)
    expect(updateBIConnection).toHaveBeenCalledTimes(2)
  })

  it('should handle multiple decoupled states and additionalinformation needed', async () => {
    const { flow } = setup()
    flow.setData({
      biConnection: {
        id: 'testConnId',
        error: 'decoupled'
      },
      biConfig: { code: 'testCode' }
    })
    flow.account = {
      data: {
        auth: {
          bi: {
            connId: 'testConnId'
          }
        }
      }
    }

    flow.triggerEvent = jest.fn()
    flow.saveTwoFARequest = jest.fn()

    flow.waitForTwoFA = jest.fn().mockImplementationOnce(async () => {
      flow.setData({
        biConnection: {
          id: 'testConnId',
          error: null
        }
      })
    })
    updateBIConnection.mockReset().mockResolvedValueOnce({
      id: 'updated-bi-connection-id-789',
      error: 'additionalInformationNeeded'
    })
    await finishConnection({ flow })
    expect(flow.triggerEvent).toHaveBeenCalledWith(LOGIN_SUCCESS_EVENT)
    expect(updateBIConnection).toHaveBeenCalledTimes(1)
    expect(flow.waitForTwoFA).toHaveBeenCalledTimes(1)
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
            mode: 'prod',
            url: 'https://cozy.biapi.pro/2.0',
            publicKey: biPublicKeyProd,
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

  it('should accept a connector without parameter and find bank id in the account', async () => {
    const { client, flow } = setup()
    const connection = await createOrUpdateBIConnection({
      client,
      account,
      konnector: konnectorWithoutParam,
      flow
    })
    expect(waitForRealtimeEvent).toHaveBeenCalledWith(
      client,
      {
        _id: 'job-id-1337'
      },
      'result',
      30000
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
      'result',
      30000
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
    getBIConnection.mockReset().mockResolvedValue({
      id: 'updated-bi-connection-id-789'
    })
    updateBIConnection.mockReset().mockResolvedValue({
      id: 'updated-bi-connection-id-789'
    })
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
      'result',
      30000
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
    expect(getBIConfig(flow)).toEqual(
      expect.objectContaining({
        code: 'bi-temporary-access-token-145613',
        publicKey: expect.any(Object),
        url: 'https://cozy.biapi.pro/2.0',
        mode: 'prod'
      })
    )
  })

  it('should create the BI connection if connection id in the account does not exist', async () => {
    const { client, flow } = setup()
    getBIConnection.mockRejectedValueOnce()
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
      'result',
      30000
    )
    expect(updateBIConnection).not.toHaveBeenCalled()
    expect(createBIConnection).toHaveBeenCalledWith(
      expect.any(Object),
      {
        id_bank: TEST_BANK_BI_ID,
        login: expect.toBeJWEValue(),
        password: expect.toBeJWEValue()
      },
      'bi-temporary-access-token-145613'
    )
    expect(connection).toEqual({ id: 'created-bi-connection-id-789' })
    expect(getBIConfig(flow)).toEqual(
      expect.objectContaining({
        code: 'bi-temporary-access-token-145613',
        publicKey: expect.any(Object),
        url: 'https://cozy.biapi.pro/2.0',
        mode: 'prod'
      })
    )
  })

  it('should convert wrongpass correctly', async () => {
    const { client, flow } = setup()
    const err = new Error()
    err.code = 'wrongpass'
    getBIConnection.mockReset().mockResolvedValueOnce({})
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
    getBIConnection.mockReset().mockResolvedValueOnce({})
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

describe('fetchExtraOAuthUrlParams', () => {
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
    waitForRealtimeEvent.mockImplementation(async () => {
      sleep(2)
      return {
        data: {
          result: {
            code: 'bi-temporary-access-token-121212',
            mode: 'prod',
            biBankId: TEST_BANK_BI_ID,
            bankId: TEST_BANK_COZY_ID
          }
        }
      }
    })

    return { client }
  }
  it('should create a temporary token', async () => {
    const { client } = setup()
    const konnector = {
      slug: 'revolut',
      parameters: {
        bankId: TEST_BANK_COZY_ID
      }
    }

    const account = {}

    const { id_connector, token } = await fetchExtraOAuthUrlParams({
      client,
      konnector,
      account
    })
    expect(token).toEqual('bi-temporary-access-token-121212')
    expect(id_connector).toEqual(TEST_BANK_BI_ID)
  })
})

describe('handleOAuthAccount', () => {
  it('should handle webauth if any connection is found in the account', async () => {
    const client = new CozyClient({
      uri: 'http://testcozy.mycozy.cloud'
    })
    const flow = new ConnectionFlow(client, null, konnector)
    flow.account = account
    flow.handleFormSubmit = jest.fn()
    flow.saveAccount = async account => account
    const account = { oauth: { query: { id_connection: ['12'] } } }
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

describe('setSync', () => {
  it('should set synchronization status for a contract', async () => {
    const client = new CozyClient({
      uri: 'http://testcozy.mycozy.cloud'
    })
    const flow = new ConnectionFlow(client, null, konnector)
    flow.account = account
    flow.handleFormSubmit = jest.fn()
    flow.saveAccount = async account => account
    const biConnId = 'conn-1337'
    const tempToken = 'temp-token'
    const biContractId = '1234'
    const account = { data: { auth: { bi: { connId: biConnId } } } }
    const contract = { vendorId: biContractId }
    const createTemporaryToken = jest.fn().mockResolvedValue({
      code: tempToken
    })
    const setBIConnectionSyncStatus = jest.fn()
    await setSync({
      client,
      account,
      konnector,
      syncStatus: false,
      contract,
      createTemporaryToken,
      setBIConnectionSyncStatus
    })
    expect(setBIConnectionSyncStatus).toHaveBeenCalledWith(
      expect.any(Object), // config
      biConnId,
      biContractId,
      false,
      tempToken
    )
  })
})

describe('updateBIConnectionFromFlow', () => {
  it('should update a connection with given fields', async () => {
    const client = new CozyClient({
      uri: 'http://testcozy.mycozy.cloud'
    })
    const biConnId = 'conn-1337'
    const account = { data: { auth: { bi: { connId: biConnId } } } }
    const flow = new ConnectionFlow(client, null, konnector)
    flow.account = account
    saveBIConfig(flow, {
      code: 'temporary-token',
      url: 'https://bi-endpoint.biapi.pro'
    })
    updateBIConnection.mockReturnValue({
      id: 'connection-id'
    })
    const connectionData = { login: '1234' }
    await updateBIConnectionFromFlow(flow, connectionData)
    expect(updateBIConnection).toHaveBeenCalledWith(
      {
        url: 'https://bi-endpoint.biapi.pro'
      },
      'conn-1337',
      { login: '1234' },
      'temporary-token'
    )
  })
})
