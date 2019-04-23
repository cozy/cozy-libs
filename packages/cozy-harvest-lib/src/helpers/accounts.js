import get from 'lodash/get'
import merge from 'lodash/merge'

import manifest from './manifest'

const DEFAULT_TWOFA_CODE_PROVIDER_TYPE = 'default'

const TWOFA_NEEDED_STATUSES = {
  [DEFAULT_TWOFA_CODE_PROVIDER_TYPE]: 'TWOFA_NEEDED',
  email: 'TWOFA_NEEDED.EMAIL',
  sms: 'TWOFA_NEEDED.SMS'
}

/**
 * Return a boolean to know if the account is in a two fa code needed
 * status
 * @param  {String}  status Account two FA Status
 * @return {Boolean}
 */
export const isTwoFANeeded = status => {
  for (let s in TWOFA_NEEDED_STATUSES) {
    if (TWOFA_NEEDED_STATUSES[s] === status) {
      return true
    }
  }
  return false
}

/**
 * Return the status object key matching the status value
 * @param  {String} status Account document
 * @return {String}        Two FA Code providing type or default one if not known
 */
export const getTwoFACodeProvider = account => {
  if (!account || !account.state) return DEFAULT_TWOFA_CODE_PROVIDER_TYPE
  return Object.keys(TWOFA_NEEDED_STATUSES).find(
    s => TWOFA_NEEDED_STATUSES[s] === account.state
  )
}

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

/**
 * Update Two FA code from TwoFAForm into io.cozy.accounts document
 * @param  {object} account   io.cozy.accounts document
 * @param  {object} code      Code from TwoFAForm
 * @return {object}           io.cozy.accounts attributes
 */
export const updateTwoFaCode = (account, code) => ({
  ...account,
  twofa_code: code
})

export default {
  build,
  getLabel,
  getTwoFACodeProvider,
  mergeAuth,
  updateTwoFaCode,
  isTwoFANeeded
}
