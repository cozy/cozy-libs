import SymmetricCryptoKey from 'cozy-keys-lib/transpiled/SymmetricCryptoKey'
import EncryptionType from 'cozy-keys-lib/transpiled/EncryptionType'
import merge from 'lodash/merge'
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
        'relationships.vaultCipher.data': {
          _id: cipherId,
          _type: 'com.bitwarden.ciphers'
        }
      })
      .indexFields(['relationships.vaultCipher.data._id'])
  )

  return accounts
}

export const updateAccountsAuth = async (cozyClient, accounts, authData) => {
  await Promise.all(
    accounts.map(account => {
      merge(account.auth, authData)
      unset(account, 'auth.credentials_encrypted')
      const updatedAccount = {
        ...account,
        _type: 'io.cozy.accounts'
      }

      return cozyClient.save(updatedAccount)
    })
  )
}

export const fetchLoginFailedTriggersForAccountsIds = async (
  cozyClient,
  accountsIds
) => {
  const triggers = await cozyClient.queryAll(
    cozyClient.find('io.cozy.triggers').where({
      'message.account': {
        $in: accountsIds
      }
    })
  )

  const triggersIds = triggers.map(trigger => trigger._id)

  const triggersStates = await Promise.all(
    triggersIds.map(triggerId => {
      return cozyClient
        .getStackClient()
        .fetchJSON('GET', `/jobs/triggers/${triggerId}/state`)
    })
  )

  const triggersToRetry = triggersStates
    .filter(state => {
      const { status, last_error: lastError } = state.data.attributes

      return status === 'errored' && lastError === 'LOGIN_FAILED'
    })
    .map(state => state.data.id)

  return triggersToRetry
}

export const launchTriggers = async (cozyClient, triggersIds) => {
  await Promise.all(
    triggersIds.map(triggerId => {
      return cozyClient
        .getStackClient()
        .fetchJSON('POST', `/jobs/triggers/${triggerId}/launch`)
    })
  )
}
