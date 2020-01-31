import get from 'lodash/get'
import { fetchAccountsForCipherId } from './utils'
import logger from '../logger'
import { deleteAccount } from '../connections/accounts.js'

const deleteAccounts = async (cozyClient, bitwardenCipherDocument) => {
  const bitwardenCipherId = get(bitwardenCipherDocument, '_id')

  logger.debug(`Fetching accounts for cipher ${bitwardenCipherId}`)
  const accounts = await fetchAccountsForCipherId(cozyClient, bitwardenCipherId)
  logger.debug(
    `Fetched ${accounts.length}accounts for cipher ${bitwardenCipherId}`
  )

  logger.debug('Deleting accounts')
  await Promise.all(
    accounts.data.map(account => deleteAccount(cozyClient, account))
  )
  logger.debug('Deleted accounts')
}

export default deleteAccounts
