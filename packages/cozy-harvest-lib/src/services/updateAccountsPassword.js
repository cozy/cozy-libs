import get from 'lodash/get'

import {
  decryptString,
  getOrganizationKey,
  fetchAccountsForCipherId,
  updateAccounts,
  fetchLoginFailedTriggersForAccountsIds,
  launchTriggers
} from './utils'

import logger from './logger'

const updateAccountsPassword = async (
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

  logger.debug('Decrypting cipher password...')
  const decryptedPassword = await decryptString(
    encryptedPassword,
    vaultClient,
    orgKey
  )
  logger.debug('Decrypted cipher password')

  logger.debug('Decrypting cipher username...')
  const decryptedUsername = await decryptString(
    encryptedUsername,
    vaultClient,
    orgKey
  )
  logger.debug('Decrypted cipher username')

  if (decryptedPassword === null || decryptedUsername === null) {
    throw new Error('DECRYPT_FAILED')
  }

  logger.debug(`Fetching accounts for cipher ${bitwardenCipherId}...`)
  const accounts = await fetchAccountsForCipherId(cozyClient, bitwardenCipherId)
  logger.debug(
    `Fetched ${accounts.data.length} accounts for cipher ${bitwardenCipherId}...`
  )

  logger.debug('Updating accounts...')
  await updateAccounts(
    cozyClient,
    accounts.data,
    decryptedUsername,
    decryptedPassword
  )
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

export default updateAccountsPassword
