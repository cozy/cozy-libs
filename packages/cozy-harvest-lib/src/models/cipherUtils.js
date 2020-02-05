import manifest from '../helpers/manifest'
import accounts from '../helpers/accounts'
import get from 'lodash/get'
import assert from '../assert'
import logger from '../logger'

import { CipherType, UriMatchType } from 'cozy-keys-lib'

/**
 * Create a new cipher and return its ID
 *
 * @param {string} login - the login to register in the new cipher
 * @param {string} password - the password to register in the new cipher
 *
 * @returns {string} the cipher ID
 */
export const createCipher = async (vaultClient, createOptions) => {
  const { konnector, login, password } = createOptions
  const konnectorURI = get(konnector, 'vendor_link')
  const konnectorName = get(konnector, 'name') || get(konnector, 'slug')

  const cipherData = {
    id: null,
    type: CipherType.Login,
    name: konnectorName,
    login: {
      username: login,
      password,
      uris: konnectorURI
        ? [{ uri: konnectorURI, match: UriMatchType.Domain }]
        : []
    }
  }

  const cipher = await vaultClient.createNewCozySharedCipher(cipherData, null)
  await vaultClient.saveCipher(cipher)

  return cipher
}

/**
 * Share a cipher to the cozy org
 * @param {string} cipherId - uuid of a cipher
 */
export const shareCipherWithCozy = async (vaultClient, cipherId) => {
  const cipher = await vaultClient.get(cipherId)
  const cipherView = await vaultClient.decrypt(cipher)
  await vaultClient.shareWithCozy(cipherView)
}

/**
 * Update a cipher with provided identifier and password
 *
 * @param {string} cipherId - uuid of a cipher
 * @param {string} data.login - the new login
 * @param {string} data.password - the new password
 */
export const updateCipher = async (vaultClient, cipherId, data) => {
  const { login, password } = data

  const originalCipher = await vaultClient.getByIdOrSearch(cipherId)
  const cipherData = await vaultClient.decrypt(originalCipher)

  if (
    cipherData.login.username !== login ||
    cipherData.login.password !== password
  ) {
    cipherData.login.username = login
    cipherData.login.password = password

    const newCipher = await vaultClient.createNewCozySharedCipher(
      cipherData,
      originalCipher
    )
    const cipher = await vaultClient.saveCipher(newCipher)
    return cipher
  } else {
    return originalCipher
  }
}

/**
 * Creates or updates a cipher from Cozy objects
 *
 * If not cipherId is passed, finds existing cipher based on the
 * identifier declared in the `konnector` manifest
 *
 * @param  {VaultClient} vaultClient
 * @param  {string} cipherId
 * @param  {object} options.userCredentials
 * @param  {io.cozy.account} options.account
 * @param  {io.cozy.konnector} options.konnector
 * @return {Cipher|null} - Returns null if vault is locked
 */
export const createOrUpdateCipher = async (
  vaultClient,
  cipherId,
  { userCredentials, account, konnector }
) => {
  const isLocked = await vaultClient.isLocked()

  if (isLocked) {
    logger.warn('Impossible to create or update cipher since vault is locked')
    return null
  }

  const identifierProperty = manifest.getIdentifier(konnector.fields)
  assert(identifierProperty, 'No identifier property found in konnector fields')

  const login = userCredentials[identifierProperty]
  const password = userCredentials.password

  let cipher

  if (!cipherId) {
    cipher = await searchForCipher(vaultClient, {
      konnector,
      account,
      login,
      password
    })
  }

  if (cipherId || cipher) {
    cipher = await updateCipher(vaultClient, cipherId || cipher.id, {
      login,
      password
    })
  } else {
    cipher = await createCipher(vaultClient, {
      konnector,
      login,
      password
    })
  }

  if (cipher) {
    await shareCipherWithCozy(vaultClient, cipher.id)
  }

  return cipher
}

/**
 * Finds a cipher inside vaultClient from account / konnector / login / password
 *
 * @param {string} searchOptions - Used to find the cipher
 * @param {string} searchOptions.konnector - Used for its vendor link
 * @param {string} searchOptions.account - Used for its cipherId if it exists
 * @param {string} searchOptions.login - Used to match the cipher
 * @param {string} searchOptions.password - Used to match the cipher
 *
 * @returns {Cipher} The cipher or null if no cipher was found
 */
const searchForCipher = async (vaultClient, searchOptions) => {
  const { konnector, account, login, password } = searchOptions
  const konnectorURI = get(konnector, 'vendor_link')
  const id = accounts.getVaultCipherId(account)
  const search = {
    username: login,
    uri: konnectorURI,
    type: CipherType.Login
  }
  const sort = [view => view.login.password === password, 'revisionDate']
  const cipher = await vaultClient.getByIdOrSearch(id, search, sort)
  return cipher || null
}
