const mockVaultClient = {
  fetch: Promise.resolve({
    data: {
      attributes: {
        key: 'encryptionKey'
      }
    }
  })
}

export const useVaultClient = () => mockVaultClient

export const useVaultUnlockContext = () => ({
  vaultClient: mockVaultClient,
  vaultUnlock: () => {}
})

export const CipherType = {
  AES: 'AES'
}

export const UriMatchType = {
  EXACT: 'EXACT',
  STARTS_WITH: 'STARTS_WITH'
}

export const FieldType = {
  PASSWORD: 'PASSWORD',
  TEXT: 'TEXT'
}
