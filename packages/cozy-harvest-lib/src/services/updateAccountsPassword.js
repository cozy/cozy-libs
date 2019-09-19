import SymmetricCryptoKey from 'cozy-keys-lib/transpiled/SymmetricCryptoKey'
import get from 'lodash/get'
import set from 'lodash/set'
import unset from 'lodash/unset'

const updateAccountsPassword = async (
  cozyClient,
  vaultClient,
  bitwardenCipherDocument
) => {
  const cozyKeys = await cozyClient
    .getStackClient()
    .fetchJSON('GET', '/bitwarden/organizations/cozy')

  const encryptedPassword = get(bitwardenCipherDocument, 'login.password')
  const bitwardenCipherId = get(bitwardenCipherDocument, '_id')

  const [encTypeAndIv, data, mac] = encryptedPassword.split('|')
  const [encTypeString, iv] = encTypeAndIv.split('.')
  const encType = parseInt(encTypeString, 10)

  const orgKey = new SymmetricCryptoKey(
    vaultClient.Utils.fromB64ToArray(cozyKeys.organizationKey),
    encType
  )

  const decryptedPassword = await vaultClient.cryptoService.aesDecryptToUtf8(
    encType,
    data,
    iv,
    mac,
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
