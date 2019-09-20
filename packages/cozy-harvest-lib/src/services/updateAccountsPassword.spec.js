import updateAccountsPassword from './updateAccountsPassword'

jest.mock('cozy-keys-lib/transpiled/SymmetricCryptoKey', () => {
  class MockSymmetricCryptoKey {
    constructor(key, encType) {
      return { key, encType }
    }
  }

  return MockSymmetricCryptoKey
})

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
    mockCozyClient.fetchJSON.mockRejectedValue({
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
    const orgKey = '123'

    const encryptedPassword = `${encType}.${iv}|${password}|${mac}`
    const encryptedUsername = `${encType}.${iv}|${username}|${mac}`
    mockCozyClient.fetchJSON.mockResolvedValue({
      organizationKey: orgKey
    })
    mockCozyClient.query.mockResolvedValue({
      data: []
    })
    await updateAccountsPassword(mockCozyClient, mockVaultClient, {
      login: {
        password: encryptedPassword,
        username: encryptedUsername
      }
    })
    expect(mockVaultClient.cryptoService.aesDecryptToUtf8).toHaveBeenCalledWith(
      encType,
      password,
      iv,
      mac,
      {
        key: orgKey,
        encType
      }
    )
    expect(mockVaultClient.cryptoService.aesDecryptToUtf8).toHaveBeenCalledWith(
      encType,
      username,
      iv,
      mac,
      {
        key: orgKey,
        encType
      }
    )
  })

  it('should update accounts', async () => {
    mockCozyClient.fetchJSON.mockResolvedValue({
      organizationKey: '123'
    })
    mockCozyClient.save.mockResolvedValue()
    mockVaultClient.cryptoService.aesDecryptToUtf8.mockResolvedValueOnce(
      'new_password'
    )
    mockVaultClient.cryptoService.aesDecryptToUtf8.mockResolvedValueOnce(
      'new_login'
    )
    mockCozyClient.query.mockResolvedValue({
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
    })
    await updateAccountsPassword(mockCozyClient, mockVaultClient, {
      login: {
        password: 'yolo',
        username: 'yolo'
      }
    })

    expect(mockCozyClient.save).toHaveBeenCalledTimes(2)
    expect(mockCozyClient.save).toHaveBeenCalledWith({
      _type: 'io.cozy.accounts',
      auth: {
        login: 'new_login',
        password: 'new_password'
      }
    })
    expect(mockCozyClient.save).toHaveBeenCalledWith({
      _type: 'io.cozy.accounts',
      auth: {
        login: 'new_login',
        password: 'new_password',
        extra_field: 'stays'
      }
    })
  })
})
