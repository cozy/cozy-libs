import logger from './logger'
import {
  decryptString,
  getOrganizationKey,
  fetchAccountsForCipherId,
  fetchKonnectorFromAccount,
  fetchTriggersFromAccount,
  updateAccountsAuth
} from './utils'
import get from 'lodash/get'
import { ensureTrigger } from '../connections/triggers'
import { translate as t } from 'cozy-ui/transpiled/react/I18n'

const makeDecrypt = (vaultClient, orgKey) => encryptedVal =>
  decryptString(encryptedVal, vaultClient, orgKey)

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
    throw new Error('DECRYPT_FAILED')
  }
  if (cipherDoc.deletedDate) {
    // Soft delete from bitwarden
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
    // Restore from bitwarden
    logger.debug('Restore accounts triggers...')

    // Restore triggers
    for (const account of accounts.data) {
      const konnector = await fetchKonnectorFromAccount(cozyClient, account)

      await ensureTrigger(cozyClient, {
        account,
        t,
        konnector
      })
    }
    // Note: there is no need to restore credentials here, because it is already
    // done by the updateAccountsFromCipher service.
  }
}
export default softDeleteOrRestoreAccounts
