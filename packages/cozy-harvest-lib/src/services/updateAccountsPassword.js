import get from 'lodash/get'

import {
  decryptString,
  getOrganizationKey,
  fetchAccountsForCipherId,
  updateAccounts
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

  const accounts = await fetchAccountsForCipherId(cozyClient, bitwardenCipherId)

  await updateAccounts(
    cozyClient,
    accounts.data,
    decryptedUsername,
    decryptedPassword
  )
}

export default updateAccountsPassword
