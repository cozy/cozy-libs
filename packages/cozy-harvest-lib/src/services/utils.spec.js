import {
  decryptString,
  getOrganizationKey,
  fetchAccountsForCipherId,
  updateAccounts
} from './utils'
import SymmetricCryptoKey from 'cozy-keys-lib/transpiled/SymmetricCryptoKey'
import EncryptionType from 'cozy-keys-lib/transpiled/EncryptionType'

jest.mock('cozy-keys-lib/transpiled/SymmetricCryptoKey', () => {
  class MockSymmetricCryptoKey {
    constructor(key, encType) {
      return { key, encType }
    }
  }

  return MockSymmetricCryptoKey
})

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
  find: jest.fn(() => mockCozyClient),
  where: jest.fn(() => mockCozyClient),
  indexFields: jest.fn(() => mockCozyClient),
  query: jest.fn(),
  save: jest.fn(),
  fetchJSON: jest.fn()
}

describe('decryptString', () => {
  it('should call cryptoService decrypt function with the good parameters', async () => {
    const encType = 2
    const iv = 'iv123'
    const mac = 'mac456'
    const originalString = 'iamsuperman'
    const orgKey = new SymmetricCryptoKey('123', encType)

    const encryptedString = `${encType}.${iv}|${originalString}|${mac}`

    await decryptString(encryptedString, mockVaultClient, orgKey)

    expect(mockVaultClient.cryptoService.aesDecryptToUtf8).toHaveBeenCalledWith(
      encType,
      originalString,
      iv,
      mac,
      orgKey
    )
  })
})

describe('getOrganizationKey', () => {
  it('should create a SymmetricCryptoKey with the params fetched from the stack', async () => {
    const fetchedOrganizationKey = '123'
    mockCozyClient.fetchJSON.mockResolvedValue({
      organizationKey: fetchedOrganizationKey
    })

    const orgKey = await getOrganizationKey(mockCozyClient, mockVaultClient)

    expect(mockCozyClient.fetchJSON).toHaveBeenCalledWith(
      'GET',
      '/bitwarden/organizations/cozy'
    )

    expect(orgKey).toEqual({
      encType: EncryptionType.AesCbc256_HmacSha256_B64,
      key: fetchedOrganizationKey
    })
  })
})

describe('fetchAccountsForCipherId', () => {
  it('should fetch accounts with a relationship with the given cipher id', async () => {
    await fetchAccountsForCipherId(mockCozyClient, '123-456')

    expect(mockCozyClient.find).toHaveBeenCalledWith('io.cozy.accounts')
    expect(mockCozyClient.where).toHaveBeenCalledWith({
      'relationships.vaultCipher': {
        _id: '123-456',
        _type: 'com.bitwarden.ciphers'
      }
    })
    expect(mockCozyClient.indexFields).toHaveBeenCalledWith([
      'relationships.vaultCipher._id'
    ])
  })
})

describe('updateAccounts', () => {
  it('should update all accounts with the given credentials', async () => {
    const accounts = [
      {
        auth: {
          login: 'originalLogin',
          password: 'originalPassword',
          credentials_encrypted: 'toberemoved'
        }
      },
      {
        auth: {
          login: 'originalLogin',
          password: 'originalPassword',
          credentials_encrypted: 'toberemoved'
        }
      }
    ]

    await updateAccounts(mockCozyClient, accounts, 'newLogin', 'newPassword')

    expect(mockCozyClient.save).toHaveBeenCalledTimes(2)
    expect(mockCozyClient.save).toHaveBeenCalledWith({
      _type: 'io.cozy.accounts',
      auth: {
        login: 'newLogin',
        password: 'newPassword'
      }
    })
  })
})
