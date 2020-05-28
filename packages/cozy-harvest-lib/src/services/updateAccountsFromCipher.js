import get from 'lodash/get'

import {
  decryptString,
  getOrganizationKey,
  fetchAccountsForCipherId,
  updateAccountsAuth,
  fetchLoginFailedTriggersForAccountsIds,
  launchTriggers
} from './utils'

import logger from './logger'

const makeDecrypt = (vaultClient, orgKey) => encryptedVal => decryptString(
    encryptedVal,
    vaultClient,
    orgKey
  )

const updateAccountsFromCipher = async (
  cozyClient,
  vaultClient,
  bitwardenCipherDocument
) => {
  const encryptedPassword = get(bitwardenCipherDocument, 'login.password')
  const encryptedUsername = get(bitwardenCipherDocument, 'login.username')
  const bitwardenCipherId = get(bitwardenCipherDocument, '_id')

  logger.debug('Fetching organization key...')
  const orgKey = await getOrganizationKey(cozyClient, vaultClient)
  logger.debug('Fetched organization key')

  const decrypt = makeDecrypt(vaultClient, orgKey)
  logger.debug('Decrypting cipher password...')
  const decryptedPassword = await decrypt(encryptedPassword)
  logger.debug('Decrypted cipher password')

  logger.debug('Decrypting cipher username...')
  const decryptedUsername = await decrypt(encryptedUsername)
  logger.debug('Decrypted cipher username')

  const encryptedFields = get(bitwardenCipherDocument, 'fields') || []
  logger.debug(`Decrypting ${encryptedFields.length} fields...`)
  const decryptedFields = {}
  for (const encryptedField of encryptedFields) {
    const fieldName = await decrypt(encryptedField.name)
    const fieldValue = await decrypt(encryptedField.value)
    decryptedFields[fieldName] = fieldValue
  }
  logger.debug('Decrypted fields')


  if (decryptedPassword === null || decryptedUsername === null) {
    throw new Error('DECRYPT_FAILED')
  }

  logger.debug(`Fetching accounts for cipher ${bitwardenCipherId}...`)
  const accounts = await fetchAccountsForCipherId(cozyClient, bitwardenCipherId)
  logger.debug(
    `Fetched ${accounts.data.length} accounts for cipher ${bitwardenCipherId}...`
  )

  logger.debug('Updating accounts...')
  await updateAccountsAuth(cozyClient, accounts.data, {
    login: decryptedUsername,
    password: decryptedPassword,
    ...decryptedFields
  })
  logger.debug('Updated accounts')

  logger.debug('Fetching LOGIN_FAILED triggers...')
  const accountsIds = accounts.data.map(account => account._id)
  const loginFailedTriggers = await fetchLoginFailedTriggersForAccountsIds(
    cozyClient,
    accountsIds
  )

  logger.debug(`Fetched ${loginFailedTriggers.length} LOGIN_FAILED triggers...`)

  logger.debug('Launching LOGIN_FAILED triggers...')
  await launchTriggers(cozyClient, loginFailedTriggers)
  logger.debug('Launched LOGIN_FAILED triggers...')
}

export default updateAccountsFromCipher
