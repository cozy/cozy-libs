import logger from './logger'
import {
  decryptString,
  getOrganizationKey,
  fetchAccountsForCipherId,
  fetchKonnectorFromAccount,
  fetchTriggersFromAccount,
  updateAccountsAuth,
  getT
} from './utils'
import get from 'lodash/get'
import { ensureTrigger } from '../connections/triggers'

const makeDecrypt = (vaultClient, orgKey) => encryptedVal =>
  decryptString(encryptedVal, vaultClient, orgKey)

/**
 * This service is useful to deal with soft delete and restore from
 * bitwarden routes, used for a trash feature.
 * See https://docs.cozy.io/en/cozy-stack/bitwarden/#put-bitwardenapiciphersiddelete

 * When a cipher is soft deleted, a deletedDate field is added to the
 * cipher. Then, the service removes the encrypted credentials from the
 * referenced account and deletes the associated trigger.

 * When the cipher is restored, the deletedDate is removed: the service
 * recreates the account's trigger. The account's credentials are then
 * restored through the updateAccountsFromCipher service.
 */
const softDeleteOrRestoreAccounts = async (
  cozyClient,
  vaultClient,
  cipherDoc
) => {
  const cipherId = get(cipherDoc, '_id')

  logger.debug(`Fetching accounts for cipher ${cipherId}...`)
  const accounts = await fetchAccountsForCipherId(cozyClient, cipherId)
  if (accounts.data.length < 1) {
    logger.debug('No account found for this cipher.')
    return
  }
  const orgKey = await getOrganizationKey(cozyClient, vaultClient)
  const decrypt = makeDecrypt(vaultClient, orgKey)

  const encryptedPassword = get(cipherDoc, 'login.password')
  const encryptedUsername = get(cipherDoc, 'login.username')

  const encryptedFields = get(cipherDoc, 'fields') || []
  const decryptedFields = {}
  for (const encryptedField of encryptedFields) {
    const fieldName = await decrypt(encryptedField.name)
    const fieldValue = await decrypt(encryptedField.value)
    decryptedFields[fieldName] = fieldValue
  }

  const decryptedPassword = await decrypt(encryptedPassword)
  const decryptedUsername = await decrypt(encryptedUsername)
  if (decryptedPassword === null || decryptedUsername === null) {
    // Something wrong occured dujring the credentials encryption
    // and/or decryption
    throw new Error('DECRYPT_FAILED')
  }
  if (cipherDoc.deletedDate) {
    // The cipher has been soft deleted.
    logger.debug('Remove accounts credentials and triggers...')

    // Delete triggers
    for (const account of accounts.data) {
      const triggers = await fetchTriggersFromAccount(cozyClient, account)
      for (const trigger of triggers) {
        logger.debug(`Remove trigger ${trigger._id}`)
        await cozyClient.destroy(trigger)
      }
    }
    // Remove credentials
    logger.debug('Remove accounts credentials...')
    await updateAccountsAuth(cozyClient, accounts.data, {
      login: decryptedUsername,
      ...decryptedFields
    })
  } else {
    // The cipher has been restored.
    logger.debug('Restore accounts triggers...')

    // Restore triggers
    for (const account of accounts.data) {
      const konnector = await fetchKonnectorFromAccount(cozyClient, account)

      await ensureTrigger(cozyClient, {
        account,
        t: getT(),
        konnector
      })
    }
    // The updateAccountsFromCipher service will restore the credentials from
    // the linked cipher: therefore, it is not useful to it here.
  }
}
export default softDeleteOrRestoreAccounts
