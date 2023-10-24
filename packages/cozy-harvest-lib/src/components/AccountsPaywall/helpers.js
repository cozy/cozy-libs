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
 * @typedef {Object} AccountCountByKonnector
 * @property {string} slug - Slug of the konnector
 * @property {number} count - Number of accounts for the konnector
 */

/**
 * @typedef {Object} KonnectorOffer
 * @property {string} slug - Slug of the konnector
 * @property {number} offer - Number of accounts offered for the konnector
 * @property {string} [expiresAt] - Date of expiration of the offer
 */

/**
 *
 * @param {AccountCountByKonnector[]} accounts the accounts to check
 * @param {KonnectorOffer[]} offers the offers to check
 * @returns {number} the number of accounts for all konnectors
 */
export function computeNbAccounts(accounts, offers = []) {
  const nbAccounts = accounts.reduce((acc, current) => {
    const offer = offers.find(offer => offer.slug === current.slug)

    if (
      offer &&
      (offer.expiresAt === undefined ||
        new Date(offer.expiresAt) < new Date(Date.now()))
    ) {
      const count = current.count - offer.offer
      return acc + Math.max(count, 0)
    }
    return acc + current.count
  }, 0)

  const generalOffer = offers.find(offer => offer.slug === '*')
  if (
    generalOffer &&
    (generalOffer.expiresAt === undefined ||
      new Date(generalOffer.expiresAt) < new Date(Date.now()))
  ) {
    return nbAccounts - generalOffer.offer
  } else {
    return nbAccounts
  }
}

/**
 *
 * @param {AccountCountByKonnector[]} accounts list of konnector accounts to check
 * @returns {boolean} whether the number of accounts allowed for all konnectors has been reached
 */
export function hasReachMaxAccounts(accounts) {
  const offers = flag('harvest.accounts.offers') || []

  const nbAccounts = computeNbAccounts(accounts, offers)

  const maxAccounts = computeMaxAccounts()
  if (isFinite(maxAccounts) && nbAccounts >= maxAccounts) {
    return true
  }

  return false
}
