import {
  decryptString,
  getOrganizationKey,
  fetchAccountsForCipherId,
  updateAccountsAuth,
  fetchLoginFailedTriggersForAccountsIds,
  launchTriggers
} from 'services/utils'
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

let mockVaultClient, mockCozyClient

beforeEach(() => {
  mockVaultClient = {
    Utils: {
      fromB64ToArray: str => str
    },
    cryptoService: {
      aesDecryptToUtf8: jest.fn(str => str)
    }
  }

  mockCozyClient = {
    getStackClient: () => mockCozyClient,
    find: jest.fn(() => mockCozyClient),
    where: jest.fn(() => mockCozyClient),
    indexFields: jest.fn(() => mockCozyClient),
    query: jest.fn(),
    save: jest.fn(),
    fetchJSON: jest.fn(),
    queryAll: jest.fn()
  }
})

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
      'relationships.vaultCipher.data': {
        _id: '123-456',
        _type: 'com.bitwarden.ciphers'
      }
    })
    expect(mockCozyClient.indexFields).toHaveBeenCalledWith([
      'relationships.vaultCipher.data._id'
    ])
  })
})

describe('updateAccountsAuth', () => {
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

    await updateAccountsAuth(
      mockCozyClient,
      accounts, {
        login: 'newLogin',
        password: 'newPassword'
      }
    )

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

describe('fetchLoginFailedTriggersForAccountsIds', () => {
  it('should fetch triggers that are in a LOGIN_FAILED errored state for given accounts ids', async () => {
    mockCozyClient.queryAll.mockResolvedValue([
      { _id: 'tri1' },
      { _id: 'tri2' },
      { _id: 'tri3' }
    ])

    let i = 0
    mockCozyClient.fetchJSON.mockImplementation(() => {
      const triggerState = {
        data: {
          id: `tri${i + 1}`,
          attributes: {
            status: i < 2 ? 'errored' : 'done',
            last_error: i < 2 ? 'LOGIN_FAILED' : 'ERROR'
          }
        }
      }

      ++i

      return triggerState
    })

    const accountsIds = ['acc1', 'acc2']
    const triggers = await fetchLoginFailedTriggersForAccountsIds(
      mockCozyClient,
      accountsIds
    )

    expect(triggers).toEqual(['tri1', 'tri2'])
  })
})

describe('launchTriggers', () => {
  it('should launch all triggers which ids are passed in arguments', async () => {
    const triggersIds = ['tri1', 'tri2']
    await launchTriggers(mockCozyClient, triggersIds)

    expect(mockCozyClient.fetchJSON).toHaveBeenCalledTimes(2)
    expect(mockCozyClient.fetchJSON).toHaveBeenCalledWith(
      'POST',
      '/jobs/triggers/tri1/launch'
    )
    expect(mockCozyClient.fetchJSON).toHaveBeenCalledWith(
      'POST',
      '/jobs/triggers/tri2/launch'
    )
  })
})
