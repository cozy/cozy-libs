import softDeleteOrRestoreAccounts from './softDeleteOrRestoreAccounts'

import {
  decryptString,
  getOrganizationKey,
  fetchAccountsForCipherId,
  fetchTriggersFromAccount,
  fetchKonnectorFromAccount,
  updateAccountsAuth,
  getT
} from 'services/utils'

import { ensureTrigger } from '../connections/triggers'

jest.mock('services/utils')
jest.mock('services/logger')

jest.mock('../connections/triggers', () => ({
  ensureTrigger: jest.fn()
}))

decryptString.mockImplementation(str => `${str}_decrypted`)
getT.mockImplementation(() => ({}))

const mockCozyClient = {
  getStackClient: () => mockCozyClient,
  find: () => mockCozyClient,
  where: () => mockCozyClient,
  indexFields: () => mockCozyClient,
  query: jest.fn(),
  save: jest.fn(),
  fetchJSON: jest.fn(),
  destroy: jest.fn()
}

const mockVaultClient = {
  Utils: {
    fromB64ToArray: str => str
  },
  cryptoService: {
    aesDecryptToUtf8: jest.fn(str => str)
  }
}

getOrganizationKey.mockResolvedValue({})

afterEach(() => {
  jest.clearAllMocks()
})

describe('soft delete from cipher', () => {
  it('should remove encrypted password and delete trigger', async () => {
    const accounts = {
      data: [
        {
          auth: {
            credentials_encrypted: 'abc123',
            login: 'A'
          }
        }
      ]
    }
    const triggers = [
      {
        message: {
          konnector: 'dummy'
        }
      }
    ]

    fetchAccountsForCipherId.mockResolvedValue(accounts)
    fetchTriggersFromAccount.mockResolvedValue(triggers)

    await softDeleteOrRestoreAccounts(mockCozyClient, mockVaultClient, {
      login: {
        password: 'abc123',
        username: 'A'
      },
      deletedDate: '2020-01-01'
    })

    expect(updateAccountsAuth).toHaveBeenCalledWith(
      mockCozyClient,
      accounts.data,
      {
        login: 'A_decrypted'
      }
    )
    expect(mockCozyClient.destroy).toHaveBeenCalledWith(triggers[0])
  })
})

describe('restore from cipher', () => {
  it('should restore trigger', async () => {
    const accounts = {
      data: [
        {
          auth: {
            login: 'A'
          }
        }
      ]
    }
    const konnector = {
      name: 'dummy'
    }

    fetchAccountsForCipherId.mockResolvedValue(accounts)
    fetchKonnectorFromAccount.mockResolvedValue(konnector)

    await softDeleteOrRestoreAccounts(mockCozyClient, mockVaultClient, {
      login: {
        password: 'abc123',
        username: 'A'
      }
    })

    expect(ensureTrigger).toHaveBeenCalledWith(mockCozyClient, {
      account: accounts.data[0],
      t: {},
      konnector
    })
  })
})
