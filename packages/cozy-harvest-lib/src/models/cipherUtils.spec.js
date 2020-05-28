import * as cipherUtils from './cipherUtils'

const accountWithoutCipher = {
  relationships: {}
}

describe('createOrUpdateCipher', () => {
  const setup = ({
    konnector: konnectorAttrs,
    userCredentials: userCredentialsAttrs,
    vaultClient: vaultClientAttrs,
    account: accountAttrs
  } = {}) => {
    const konnector = {
      vendor_link: 'konnector-vendor-link',
      fields: { login: { role: 'identifier' } },
      name: 'konnector-name',
      ...konnectorAttrs
    }

    const userCredentials = {
      login: 'my-login-credential',
      password: 'my-password-credential',
      ...userCredentialsAttrs
    }

    const sharedCipher = {
      id: 'shared-with-cozy-cipher-id'
    }

    const account = {
      relationships: {
        vaultCipher: {
          data: {
            _id: 'existing-cipher'
          }
        }
      },
      ...accountAttrs
    }

    const foundCipher = { id: 'found-cipher-id' }

    const vaultClient = {
      decrypt: jest.fn().mockImplementation(cipher => {
        if (!cipher) {
          throw new Error('Mocked decrypt called with a null cipher')
        } else {
          return cipher
        }
      }),
      get: id => ({ id }),
      getByIdOrSearch: jest.fn().mockReturnValue(foundCipher),
      shareWithCozy: jest.fn().mockResolvedValue(sharedCipher),
      createNewCozySharedCipher: jest.fn().mockImplementation(cipherData => ({
        ...cipherData,
        organizationId: 'cozy-org-id',
        collectionIds: ['cozy-org-collection-id']
      })),
      saveCipher: jest.fn().mockImplementation(cipher => ({
        ...cipher,
        id: cipher.id || 'saved-cipher'
      })),
      ...vaultClientAttrs
    }

    const existingCipher = {
      collectionIds: ['cozy-org-collection-id'],
      id: 'existing-cipher',
      login: {
        password: 'password-to-be-updated',
        uris: [
          {
            match: 'Domain',
            uri: 'konnector-vendor-link'
          }
        ],
        username: 'login-to-be-updated'
      },
      name: 'konnector-name',
      organizationId: 'cozy-org-id',
      type: 'Login'
    }

    return {
      konnector,
      userCredentials,
      vaultClient,
      account,
      existingCipher
    }
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('when not given a cipherId', () => {
    describe('when no cipher exists with same credentials', () => {
      it('should create a cipher with given credentials', async () => {
        const { konnector, account, userCredentials, vaultClient } = setup({
          vaultClient: {
            isLocked: jest.fn().mockResolvedValue(false)
          },
          account: accountWithoutCipher
        })

        vaultClient.getByIdOrSearch.mockResolvedValue(null)

        const cipherId = null

        const cipher = await cipherUtils.createOrUpdateCipher(
          vaultClient,
          cipherId,
          { userCredentials, account, konnector }
        )

        expect(cipher.id).toBeNull()
        expect(cipher.login.username).toBe(userCredentials.login)
        expect(cipher.login.password).toBe(userCredentials.password)
        expect(cipher.organizationId).toBe('cozy-org-id')
        expect(cipher.collectionIds).toEqual(['cozy-org-collection-id'])
      })
    })

    describe('when a cipher exists with the same credentials (account with cipher)', () => {
      it('should update the cipher with given credentials', async () => {
        const {
          konnector,
          account,
          userCredentials,
          vaultClient,
          existingCipher
        } = setup({
          vaultClient: {
            isLocked: jest.fn().mockResolvedValue(false)
          }
        })

        vaultClient.getByIdOrSearch.mockResolvedValue(existingCipher)

        const cipherId = null

        const cipher = await cipherUtils.createOrUpdateCipher(
          vaultClient,
          cipherId,
          { userCredentials, account, konnector }
        )

        expect(cipher.id).toBe('existing-cipher')
        expect(cipher.login.username).toBe(userCredentials.login)
        expect(cipher.login.password).toBe(userCredentials.password)
        expect(cipher.organizationId).toBe('cozy-org-id')
        expect(cipher.collectionIds).toEqual(['cozy-org-collection-id'])
      })
    })

    describe('when a cipher exists with the same credentials (account without cipher)', () => {
      it('should create a new cipher with given credentials', async () => {
        const {
          konnector,
          account,
          userCredentials,
          vaultClient,
          existingCipher
        } = setup({
          vaultClient: {
            isLocked: jest.fn().mockResolvedValue(false)
          },
          account: accountWithoutCipher
        })

        vaultClient.getByIdOrSearch.mockResolvedValue(existingCipher)

        const cipherId = null

        const cipher = await cipherUtils.createOrUpdateCipher(
          vaultClient,
          cipherId,
          { userCredentials, account, konnector }
        )

        expect(cipher.id).toBe(null)
        expect(cipher.login.username).toBe(userCredentials.login)
        expect(cipher.login.password).toBe(userCredentials.password)
        expect(cipher.organizationId).toBe('cozy-org-id')
        expect(cipher.collectionIds).toEqual(['cozy-org-collection-id'])
      })
    })
  })

  describe('when given a cipherId', () => {
    it('should update the cipher with given credentials', async () => {
      const {
        konnector,
        account,
        userCredentials,
        vaultClient,
        existingCipher
      } = setup({
        vaultClient: {
          isLocked: jest.fn().mockResolvedValue(false)
        }
      })

      vaultClient.getByIdOrSearch.mockResolvedValue(existingCipher)

      const cipherId = 'existing-cipher'

      const cipher = await cipherUtils.createOrUpdateCipher(
        vaultClient,
        cipherId,
        { userCredentials, account, konnector }
      )

      expect(cipher.id).toBe('existing-cipher')
      expect(cipher.login.username).toBe(userCredentials.login)
      expect(cipher.login.password).toBe(userCredentials.password)
      expect(cipher.organizationId).toBe('cozy-org-id')
      expect(cipher.collectionIds).toEqual(['cozy-org-collection-id'])
    })
  })
})
