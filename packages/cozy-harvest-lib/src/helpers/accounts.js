import get from 'lodash/get'
import merge from 'lodash/merge'

import manifest from './manifest'

/**
 * Returns the label for the given account.
 * This label is by default the value for the identifier field.
 * If there is no value for this field, the label is the io.cozy.accounts
 * document id.
 * @param  {Object} account io.cozy.accounts documents
 * @return {string}         The label associated to this account.
 */
export const getLabel = account =>
  get(account, `auth.${account.identifier}`) || account._id

/**
 * Transforms AccountForm data to io.cozy.accounts document
 * @param  {object} konnector Konnector related to account
 * @param  {object} data      Data from AccountForm
 * @return {object}           io.cozy.accounts attributes
 */
export const build = (konnector, authData) => {
  // We are not at the final target for io.cozy.accounts.
  // For now we are just ensuring legacy
  return {
    auth: authData,
    account_type: konnector.slug,
    identifier: manifest.getIdentifier(konnector.fields)
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

export default {
  build,
  getLabel,
  mergeAuth
}
