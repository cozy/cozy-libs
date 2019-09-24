import SymmetricCryptoKey from 'cozy-keys-lib/transpiled/SymmetricCryptoKey'
import EncryptionType from 'cozy-keys-lib/transpiled/EncryptionType'
import set from 'lodash/set'
import unset from 'lodash/unset'

export const decryptString = (encryptedString, vaultClient, orgKey) => {
  const [encTypeAndIv, data, mac] = encryptedString.split('|')
  const [encTypeString, iv] = encTypeAndIv.split('.')
  const encType = parseInt(encTypeString, 10)

  return vaultClient.cryptoService.aesDecryptToUtf8(
    encType,
    data,
    iv,
    mac,
    orgKey
  )
}

export const getOrganizationKey = async (cozyClient, vaultClient) => {
  const cozyKeys = await cozyClient
    .getStackClient()
    .fetchJSON('GET', '/bitwarden/organizations/cozy')

  const orgKeyEncType = EncryptionType.AesCbc256_HmacSha256_B64
  const orgKey = new SymmetricCryptoKey(
    vaultClient.Utils.fromB64ToArray(cozyKeys.organizationKey),
    orgKeyEncType
  )

  return orgKey
}

export const fetchAccountsForCipherId = async (cozyClient, cipherId) => {
  const accounts = await cozyClient.query(
    cozyClient
      .find('io.cozy.accounts')
      .where({
        'relationships.vaultCipher': {
          _id: cipherId,
          _type: 'com.bitwarden.ciphers'
        }
      })
      .indexFields(['relationships.vaultCipher._id'])
  )

  return accounts
}

export const updateAccounts = async (
  cozyClient,
  accounts,
  newUsername,
  newPassword
) => {
  await Promise.all(
    accounts.map(account => {
      set(account, 'auth.password', newPassword)
      set(account, 'auth.login', newUsername)
      unset(account, 'auth.credentials_encrypted')
      const updatedAccount = {
        ...account,
        _type: 'io.cozy.accounts'
      }

      return cozyClient.save(updatedAccount)
    })
  )
}
