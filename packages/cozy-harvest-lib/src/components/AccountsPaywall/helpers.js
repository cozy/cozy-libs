// @ts-check
// @ts-ignore
import flag from 'cozy-flags'

/**
 * @param {string} slug the slug of the konnector to check
 * @returns {number} the maximum accounts allowed for given konnector
 */
export function computeMaxAccountsByKonnector(slug) {
  const maxAccountsByKonnector = flag(`harvest.accounts.maxByKonnector.${slug}`)
  if (maxAccountsByKonnector !== null) {
    return maxAccountsByKonnector === -1 ? Infinity : maxAccountsByKonnector
  }
  const maxAccountsDefault = flag('harvest.accounts.maxByKonnector.default')
  if (maxAccountsDefault !== null) {
    return maxAccountsDefault === -1 ? Infinity : maxAccountsDefault
  }
  return Infinity
}

/**
 *
 * @param {string} slug the slug of the konnector to check
 * @param {number} nbAccounts the current number of account for the konnector to check
 * @returns {boolean} whether the number of accounts allowed for a given connector has been reached
 */
export function hasReachMaxAccountsByKonnector(slug, nbAccounts) {
  const maxAccounts = computeMaxAccountsByKonnector(slug)
  if (isFinite(maxAccounts) && nbAccounts >= maxAccounts) {
    return true
  }

  return false
}

/**
 * @returns {number} the maximum accounts allowed for all konnectors
 */
export function computeMaxAccounts() {
  const maxAccounts = flag('harvest.accounts.max')
  if (maxAccounts !== null) {
    return maxAccounts === -1 ? Infinity : maxAccounts
  }
  return Infinity
}

/**
 *
 * @param {number} nbAccounts the current number of account for the konnector to check
 * @returns {boolean} whether the number of accounts allowed for all konnectors has been reached
 */
export function hasReachMaxAccounts(nbAccounts) {
  const maxAccounts = computeMaxAccounts()
  if (isFinite(maxAccounts) && nbAccounts >= maxAccounts) {
    return true
  }

  return false
}
