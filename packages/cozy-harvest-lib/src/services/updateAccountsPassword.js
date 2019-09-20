import SymmetricCryptoKey from 'cozy-keys-lib/transpiled/SymmetricCryptoKey'
import EncryptionType from 'cozy-keys-lib/transpiled/EncryptionType'
import get from 'lodash/get'
import set from 'lodash/set'
import unset from 'lodash/unset'

const decryptString = (encryptedString, vaultClient, orgKey) => {
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

const updateAccountsPassword = async (
  cozyClient,
  vaultClient,
  bitwardenCipherDocument
) => {
  const cozyKeys = await cozyClient
    .getStackClient()
    .fetchJSON('GET', '/bitwarden/organizations/cozy')

  const encryptedPassword = get(bitwardenCipherDocument, 'login.password')
  const encryptedUsername = get(bitwardenCipherDocument, 'login.username')
  const bitwardenCipherId = get(bitwardenCipherDocument, '_id')

  const orgKeyEncType = EncryptionType.AesCbc256_HmacSha256_B64
  const orgKey = new SymmetricCryptoKey(
    vaultClient.Utils.fromB64ToArray(cozyKeys.organizationKey),
    orgKeyEncType
  )

  const decryptedPassword = await decryptString(
    encryptedPassword,
    vaultClient,
    orgKey
  )
  const decryptedUsername = await decryptString(
    encryptedUsername,
    vaultClient,
    orgKey
  )

  const accounts = await cozyClient.query(
    cozyClient
      .find('io.cozy.accounts')
      .where({
        'relationships.vaultCipher': {
          _id: bitwardenCipherId,
          _type: 'com.bitwarden.ciphers'
        }
      })
      .indexFields(['relationships.vaultCipher._id'])
  )

  await Promise.all(
    accounts.data.map(account => {
      set(account, 'auth.password', decryptedPassword)
      set(account, 'auth.login', decryptedUsername)
      unset(account, 'auth.credentials_encrypted')
      const updatedAccount = {
        ...account,
        _type: 'io.cozy.accounts'
      }

      return cozyClient.save(updatedAccount)
    })
  )
}

export default updateAccountsPassword
