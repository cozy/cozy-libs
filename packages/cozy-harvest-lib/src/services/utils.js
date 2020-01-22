import SymmetricCryptoKey from 'cozy-keys-lib/transpiled/SymmetricCryptoKey'
import EncryptionType from 'cozy-keys-lib/transpiled/EncryptionType'
import set from 'lodash/set'
import unset from 'lodash/unset'
import get from 'lodash/get'

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

export const fetchSharedCiphers = async cozyClient => {
  const ciphers = await cozyClient.query(
    cozyClient
      .find('com.bitwarden.ciphers')
      .where({
        shared_with_cozy: true
      })
      .indexFields(['shared_with_cozy'])
  )
  return ciphers
}

export const fetchTriggersForAccountId = async (cozyClient, accountId) => {
  const triggers = await cozyClient.query(
    cozyClient
      .find('io.cozy.triggers')
      .where({
        'message.account': {
          $eq: accountId
        }
      })
      .indexFields(['message.account'])
  )
  return triggers
}

export const fetchKonnectorManifestBySlug = async (cozyClient, slug) => {
  const konnector = await cozyClient.query(
    cozyClient
      .get('io.cozy.konnectors', slug)
  )
  return konnector
}

export const fetchKonnectorForAccountId = async (cozyClient, accountId) => {
  const triggers = await fetchTriggersForAccountId(cozyClient, accountId)
  const slug = get(triggers, 'data[0].message.konnector')
  if (slug) {
    const manifest = await fetchKonnectorManifestBySlug(cozyClient, slug)
    return manifest
  }
  return
}

export const fetchDecryptedAccount = async (cozyClient, id) => {
  /*const account = await cozyClient.query(
    cozyClient.find('io.cozy.accounts').getById(id)
  )*/

  const account = await cozyClient
    .getStackClient()
    .fetchJSON('GET', `/data/io.cozy.accounts/${id}?include=credentials`)

  //await cozyClient.fetch('GET', `/data/io.cozy.accounts/${id}`)
  return account
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
