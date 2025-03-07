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
 * @typedef {Object} KonnectorOffer
 * @property {string} slug - Slug of the konnector
 * @property {number} credit - Number of account credits for the konnector
 * @property {string} startsAt - Offer start date
 * @property {string} [endsAt] - Offer end date
 */

/**
 * Compute the number of account credits for all konnectors
 * @returns {number} - Number of account credits for all konnectors
 */
export function computeGeneralOfferCredits() {
  /** @type {KonnectorOffer[]} */
  const offers = flag('harvest.accounts.offers.list') || []
  const generalOffers = offers.filter(offer => offer.slug === '*')

  return generalOffers.reduce((total, offer) => {
    const now = new Date()
    const startsAt = new Date(offer.startsAt)
    const endsAt = offer.endsAt ? new Date(offer.endsAt) : new Date()
    if (now >= startsAt && now <= endsAt) {
      return total + offer.credit
    }

    return total
  }, 0)
}

/**
 *
 * @param {number} nbAccounts the current number of account for all konnectors
 * @returns {boolean} whether the number of accounts allowed for all konnectors has been reached
 */
export function hasReachMaxAccounts(nbAccounts) {
  const generalOffer = computeGeneralOfferCredits()
  const maxAccounts = computeMaxAccounts()

  if (isFinite(maxAccounts) && nbAccounts >= maxAccounts + generalOffer) {
    return true
  }

  return false
}

/**
 * Compute the number of account credits for a konnector
 * @param {string} slug - Slug of the konnector
 * @param {import('cozy-client/types/types').IOCozyTrigger[]} accounts - List of accounts of the konnector
 * @returns
 */
export const computeRemainingOfferCreditsByKonnector = (
  slug,
  accounts = []
) => {
  /** @type {KonnectorOffer[]} */
  const offers = flag('harvest.accounts.offers.list') || []
  const offersForKonnector = offers.filter(offer => offer.slug === slug)

  if (offersForKonnector.length === 0) {
    return 0
  }

  let listOfAccounts = accounts.sort(
    (a, b) =>
      new Date(a.cozyMetadata.createdAt).getTime() -
      new Date(b.cozyMetadata.createdAt).getTime()
  )

  return offersForKonnector.reduce((acc, offer) => {
    const startsAt = new Date(offer.startsAt).getTime()
    const endsAt = offer.endsAt ? new Date(offer.endsAt).getTime() : undefined

    if (
      (endsAt !== undefined && endsAt < Date.now()) ||
      startsAt > Date.now()
    ) {
      return acc
    }

    let accountCreditAvailable = offer.credit || 0
    listOfAccounts = listOfAccounts.filter(account => {
      const accountDate = new Date(account.cozyMetadata.createdAt).getTime()

      if (
        accountCreditAvailable > 0 &&
        accountDate >= startsAt &&
        (!endsAt || endsAt >= accountDate)
      ) {
        accountCreditAvailable -= 1
        return false
      }
      return true
    })

    return acc + accountCreditAvailable
  }, 0)
}
