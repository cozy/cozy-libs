import merge from 'lodash/merge'

import Manifest from '../Manifest'

/**
 * Transforms AccountForm data to io.cozy.accounts attributes
 * @param  {object} konnector Konnector related to account
 * @param  {object} data      Data from AccountForm
 * @return {object}           io.cozy.accounts attributes
 */
export const prepareAccountData = (konnector, data) => {
  // We are not at the final target for io.cozy.accounts.
  // For now we are just ensuring legacy
  return {
    auth: data,
    account_type: konnector.slug,
    identifier: Manifest.getIdentifier(konnector.fields)
  }
}

/**
 * Merges existing io.cozy.accounts auth with Auth data from AccountForm
 * @param  {object} account   io.cozy.accounts document
 * @param  {object} data      Data from AccountForm
 * @return {object}           io.cozy.accounts attributes
 */
export const mergeAuth = (account, authData) => ({
  ...account,
  auth: merge(account.auth, authData)
})
