import merge from 'lodash/merge'
import unset from 'lodash/unset'
import Polyglot from 'node-polyglot'

import { Q } from 'cozy-client'
import SymmetricCryptoKey from 'cozy-keys-lib/transpiled/SymmetricCryptoKey'
import EncryptionType from 'cozy-keys-lib/transpiled/EncryptionType'
import logger from './logger'

/**
 * Decrypt the given string with the organization key
 *
 * @param {string} encryptedString - The encrypted string
 * @param {object} vaultClient - The vault client
 * @param {ArrayBuffer} orgKey - The organization key
 * @returns {Promise<string>} The decrypted string
 */
export const decryptString = async (encryptedString, vaultClient, orgKey) => {
  if (!encryptedString) {
    return ''
  }
  const [encTypeAndIv, data, mac] = encryptedString.split('|')
  if (!encTypeAndIv) {
    logger.error('Encrypted string is malformed')
    throw new Error('DECRYPT_FAILED')
  }
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

export const getT = () => {
  const supportedLocales = ['en', 'fr', 'es']
  const locale =
    supportedLocales.find(l => l === process.env.COZY_LOCALE) || 'en'
  const locales = require(`../locales/${locale}.json`)
  const polyglot = new Polyglot()
  polyglot.extend(locales)
  return polyglot.t.bind(polyglot)
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
    Q('io.cozy.accounts')
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

export const fetchKonnectorFromAccount = async (cozyClient, account) => {
  const slug = account.account_type
  const konnector = await cozyClient.query(
    Q('io.cozy.konnectors').getById(`io.cozy.konnectors/${slug}`)
  )
  return konnector.data
    ? {
        _id: konnector.data._id,
        _type: konnector.data.type,
        ...konnector.data.attributes
      }
    : null
}

export const fetchTriggersFromAccount = async (cozyClient, account) => {
  const triggers = await cozyClient.queryAll(
    Q('io.cozy.triggers').where({
      worker: {
        $in: ['konnector', 'client']
      },
      'message.account': account._id
    })
  )
  return triggers
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
    Q('io.cozy.triggers').where({
      worker: {
        $in: ['konnector', 'client']
      },
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
