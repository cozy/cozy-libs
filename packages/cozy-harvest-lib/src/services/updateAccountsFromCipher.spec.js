import updateAccountsFromCipher from './updateAccountsFromCipher'

import {
  decryptString,
  getOrganizationKey,
  fetchAccountsForCipherId,
  updateAccounts,
  fetchLoginFailedTriggersForAccountsIds,
  launchTriggers
} from 'services/utils'

jest.mock('services/utils')
jest.mock('services/logger')

afterEach(() => {
  jest.clearAllMocks()
})

describe('update accounts from cipher', () => {
  const mockVaultClient = {
    Utils: {
      fromB64ToArray: str => str
    },
    cryptoService: {
      aesDecryptToUtf8: jest.fn(str => str)
    }
  }
  const mockCozyClient = {
    getStackClient: () => mockCozyClient,
    find: () => mockCozyClient,
    where: () => mockCozyClient,
    indexFields: () => mockCozyClient,
    query: jest.fn(),
    save: jest.fn(),
    fetchJSON: jest.fn()
  }

  it('should fail when the stack provides no org key', async () => {
    getOrganizationKey.mockRejectedValue({
      error: 'No org key'
    })
    expect.assertions(1)
    try {
      await updateAccountsFromCipher(mockCozyClient, mockVaultClient, {})
    } catch (err) {
      expect(err).toEqual({
        error: 'No org key'
      })
    }
  })

  it('should decrypt the password', async () => {
    const encType = 2
    const iv = 'iv123'
    const mac = 'mac456'
    const password = 'iamsuperman'
    const username = 'Clark Kent'

    const encryptedPassword = `${encType}.${iv}|${password}|${mac}`
    const encryptedUsername = `${encType}.${iv}|${username}|${mac}`

    decryptString.mockImplementation(str => str)
    const orgKey = {}
    getOrganizationKey.mockResolvedValue(orgKey)
    fetchAccountsForCipherId.mockResolvedValue({ data: [] })
    fetchLoginFailedTriggersForAccountsIds.mockResolvedValue({ data: [] })

    await updateAccountsPassword(mockCozyClient, mockVaultClient, {
      login: {
        password: encryptedPassword,
        username: encryptedUsername
      }
    })

    expect(decryptString).toHaveBeenCalledWith(
      encryptedPassword,
      mockVaultClient,
      orgKey
    )

    expect(decryptString).toHaveBeenCalledWith(
      encryptedUsername,
      mockVaultClient,
      orgKey
    )
  })

  it('should update accounts', async () => {
    const orgKey = {}
    getOrganizationKey.mockResolvedValue(orgKey)

    decryptString.mockImplementation(str => `${str}_decrypted`)

    const accounts = {
      data: [
        {
          auth: {
            credentials_encrypted: 'abc123',
            login: 'A'
          }
        },
        {
          auth: {
            credentials_encrypted: 'abc123',
            login: 'B',
            extra_field: 'stays'
          }
        }
      ]
    }
    fetchAccountsForCipherId.mockResolvedValue(accounts)

    await updateAccountsFromCipher(mockCozyClient, mockVaultClient, {
      login: {
        password: 'yolo',
        username: 'yolo'
      }
    })

    expect(updateAccounts).toHaveBeenCalledWith(
      mockCozyClient,
      accounts.data,
      'yolo_decrypted',
      'yolo_decrypted'
    )
  })

  it('should launch triggers in LOGIN_FAILED error state', async () => {
    const accounts = {
      data: [{ _id: 'acc1' }, { _id: 'acc2' }]
    }

    fetchAccountsForCipherId.mockResolvedValue(accounts)

    fetchLoginFailedTriggersForAccountsIds.mockResolvedValue(['tri1', 'tri2'])

    await updateAccountsFromCipher(mockCozyClient, mockVaultClient, {
      login: {
        password: 'yolo',
        username: 'yolo'
      }
    })

    expect(fetchLoginFailedTriggersForAccountsIds).toHaveBeenCalledWith(
      mockCozyClient,
      ['acc1', 'acc2']
    )

    expect(launchTriggers).toHaveBeenCalledWith(mockCozyClient, [
      'tri1',
      'tri2'
    ])
  })

  it('should throw an error if it can not decrypt username or password', async () => {
    const orgKey = {}
    getOrganizationKey.mockResolvedValue(orgKey)
    decryptString.mockResolvedValue(null)

    expect(
      updateAccountsFromCipher(mockCozyClient, mockVaultClient, {
        login: {
          password: 'yolo',
          username: 'yolo'
        }
      })
    ).rejects.toThrow('DECRYPT_FAILED')
  })
})
