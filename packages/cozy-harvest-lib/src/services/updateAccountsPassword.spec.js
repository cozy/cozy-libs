import updateAccountsPassword from './updateAccountsPassword'

import {
  decryptString,
  getOrganizationKey,
  fetchAccountsForCipherId,
  updateAccounts
} from './utils'

jest.mock('./utils')

describe('update accounts password function', () => {
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
      await updateAccountsPassword(mockCozyClient, mockVaultClient, {})
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

    await updateAccountsPassword(mockCozyClient, mockVaultClient, {
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
})
