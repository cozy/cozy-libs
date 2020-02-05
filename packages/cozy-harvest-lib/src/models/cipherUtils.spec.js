import { createOrUpdateCipher } from './cipherUtils'

describe('createOrUpdateCipher', () => {
  const setup = ({
    account: accountAttrs,
    konnector: konnectorAttrs,
    userCredentials: userCredentialsAttrs,
    vaultClient: vaultClientAttrs
  } = {}) => {
    const account = {
      relationships: {
        vaultCipher: {
          data: [
            {
              _id: 'cipher-relationship-id'
            }
          ]
        }
      },
      ...accountAttrs
    }

    const konnector = {
      vendor_link: 'konnector-vendor-link',
      fields: { login: { role: 'identifier' } },
      ...konnectorAttrs
    }

    const userCredentials = {
      login: 'my-login-credential',
      password: 'my-password-credential',
      ...userCredentialsAttrs
    }

    const savedCipher = {
      id: 'saved-cipher-id'
    }

    const sharedCipher = {
      id: 'shared-with-cozy-cipher-id'
    }

    const foundCipher = { id: 'found-cipher-id' }

    const vaultClient = {
      decrypt: jest.fn().mockReturnValue({
        login: {
          username: 'my-decrypted-username',
          password: 'my-decrypted-password'
        }
      }),
      get: ({ id }) => ({ id }),
      getByIdOrSearch: jest.fn().mockReturnValue(foundCipher),
      shareWithCozy: jest.fn().mockResolvedValue(sharedCipher),
      createNewCozySharedCipher: jest.fn(),
      saveCipher: jest.fn().mockResolvedValue(savedCipher),
      ...vaultClientAttrs
    }

    return {
      account,
      konnector,
      userCredentials,
      vaultClient
    }
  }

  it('should return null if vault client is locked', async () => {
    const { konnector, account, userCredentials, vaultClient } = setup({
      vaultClient: {
        isLocked: jest.fn().mockResolvedValue(true)
      }
    })
    const cipherId = null
    const cipher = await createOrUpdateCipher(vaultClient, cipherId, {
      konnector,
      account,
      userCredentials
    })
    expect(cipher).toBe(null)
  })

  it('should pass the correct search to vault client', async () => {
    const { konnector, account, userCredentials, vaultClient } = setup({
      vaultClient: {
        isLocked: jest.fn().mockResolvedValue(false)
      }
    })
    const cipherId = null
    const cipher = await createOrUpdateCipher(vaultClient, cipherId, {
      konnector,
      account,
      userCredentials
    })
    expect(vaultClient.getByIdOrSearch).toHaveBeenCalledTimes(2)
    expect(vaultClient.getByIdOrSearch).toHaveBeenCalledWith(
      'cipher-relationship-id',
      {
        type: 'Login',
        uri: 'konnector-vendor-link',
        username: 'my-login-credential'
      },
      [expect.any(Function), 'revisionDate']
    )
    expect(vaultClient.getByIdOrSearch).toHaveBeenCalledWith('found-cipher-id')
    expect(cipher).toEqual({
      id: 'saved-cipher-id'
    })
  })
})
