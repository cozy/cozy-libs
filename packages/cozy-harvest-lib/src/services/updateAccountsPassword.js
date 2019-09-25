import get from 'lodash/get'

import {
  decryptString,
  getOrganizationKey,
  fetchAccountsForCipherId,
  updateAccounts,
  fetchLoginFailedTriggersForAccountsIds,
  launchTriggers
} from './utils'

const updateAccountsPassword = async (
  cozyClient,
  vaultClient,
  bitwardenCipherDocument
) => {
  const encryptedPassword = get(bitwardenCipherDocument, 'login.password')
  const encryptedUsername = get(bitwardenCipherDocument, 'login.username')
  const bitwardenCipherId = get(bitwardenCipherDocument, '_id')

  const orgKey = await getOrganizationKey(cozyClient, vaultClient)

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

  if (decryptedPassword === null || decryptedUsername === null) {
    throw new Error('DECRYPT_FAILED')
  }

  const accounts = await fetchAccountsForCipherId(cozyClient, bitwardenCipherId)

  await updateAccounts(
    cozyClient,
    accounts.data,
    decryptedUsername,
    decryptedPassword
  )

  const accountsIds = accounts.data.map(account => account._id)
  const loginFailedTriggers = await fetchLoginFailedTriggersForAccountsIds(
    cozyClient,
    accountsIds
  )

  await launchTriggers(cozyClient, loginFailedTriggers)
}

export default updateAccountsPassword
