// @ts-check
// @ts-ignore
import flag from 'cozy-flags'

import {
  computeMaxAccountsByKonnector,
  hasReachMaxAccountsByKonnector,
  computeMaxAccounts,
  hasReachMaxAccounts,
  computeGeneralOfferCredits,
  computeRemainingOfferCreditsByKonnector
} from './helpers'

jest.mock('cozy-flags')

/**
 * @param {Object} params
 * @param {number} [params.defaultValue] value return by default in maxByKonnector flag
 * @param {number} [params.idValue] value return for a specific konnector in maxByKonnector flag
 * @param {number} [params.maxValue] value return max flag
 * @param {import('./helpers').KonnectorOffer[]} [params.offers] value return for offers flag
 * @returns { (flag:string) => number|import('./helpers').KonnectorOffer[]|null } return a function which take a flag name and returns its link number or null
 */
function getCurrentFlag({ defaultValue, idValue, maxValue, offers } = {}) {
  return flag => {
    if (defaultValue && flag === 'harvest.accounts.maxByKonnector.default') {
      return defaultValue
    }

    if (idValue && flag === 'harvest.accounts.maxByKonnector.ameli') {
      return idValue
    }

    if (maxValue && flag === 'harvest.accounts.max') {
      return maxValue
    }

    if (offers && flag === 'harvest.accounts.offers.list') {
      return offers
    }
    return null
  }
}

describe('AccountsPaywall helpers', () => {
  const now = new Date()
  const past = (days = 1) =>
    new Date(now.getTime() - 1000 * 60 * 60 * (24 * days)).toISOString()
  const future = (days = 1) =>
    new Date(now.getTime() + 1000 * 60 * 60 * (24 * days)).toISOString()

  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(global.Date, 'now').mockImplementationOnce(() => now.getTime())
  })

  describe('computeMaxAccountsByKonnector', () => {
    it('should return nothing or infinity when there no flag set', () => {
      flag.mockImplementation(() => null)
      expect(computeMaxAccountsByKonnector('ameli')).toBe(Infinity)
    })

    it('should return default case if flag set', () => {
      flag.mockImplementation(getCurrentFlag({ defaultValue: 5 }))
      expect(computeMaxAccountsByKonnector('ameli')).toBe(5)
    })

    it('should return default case if flag infinity', () => {
      flag.mockImplementation(getCurrentFlag({ defaultValue: -1 }))
      expect(computeMaxAccountsByKonnector('ameli')).toBe(Infinity)
    })

    it('should return konnector specific case if flag set', () => {
      flag.mockImplementation(getCurrentFlag({ defaultValue: 5, idValue: 6 }))
      expect(computeMaxAccountsByKonnector('ameli')).toBe(6)
    })

    it('should return konnector specific case if flag set infinity', () => {
      flag.mockImplementation(getCurrentFlag({ defaultValue: 5, idValue: -1 }))
      expect(computeMaxAccountsByKonnector('ameli')).toBe(Infinity)
    })
  })

  describe('hasReachMaxAccountsByKonnector', () => {
    it('should be true when current account number is equal or upper maximum', () => {
      flag.mockImplementation(getCurrentFlag({ defaultValue: 5 }))
      expect(hasReachMaxAccountsByKonnector('ameli', 5)).toBe(true)
    })

    it('should be false when current account number is below maximum', () => {
      flag.mockImplementation(getCurrentFlag({ defaultValue: 5 }))
      expect(hasReachMaxAccountsByKonnector('ameli', 4)).toBe(false)
    })

    it('should be false when there is no maximum', () => {
      flag.mockImplementation(getCurrentFlag({ defaultValue: -1 }))
      expect(hasReachMaxAccountsByKonnector('ameli', 5)).toBe(false)
    })
  })

  describe('computeMaxAccounts', () => {
    it('should return nothing or infinity when there no flag set', () => {
      flag.mockImplementation(() => null)
      expect(computeMaxAccounts()).toBe(Infinity)
    })

    it('should return a number if harvest.accounts.max flag set', () => {
      flag.mockImplementation(getCurrentFlag({ maxValue: 5 }))
      expect(computeMaxAccounts()).toBe(5)
    })

    it('should return infinity if harvest.accounts.max flag is -1', () => {
      flag.mockImplementation(getCurrentFlag({ maxValue: -1 }))
      expect(computeMaxAccounts()).toBe(Infinity)
    })
  })

  describe('hasReachMaxAccounts', () => {
    it('should be true when current account number is equal or upper maximum', () => {
      flag.mockImplementation(getCurrentFlag({ maxValue: 5 }))
      expect(hasReachMaxAccounts(5)).toBe(true)
    })

    it('should be false when current account number is below maximum', () => {
      flag.mockImplementation(getCurrentFlag({ maxValue: 5 }))
      expect(hasReachMaxAccounts(4)).toBe(false)
    })

    it('should be false when there is no maximum', () => {
      flag.mockImplementation(getCurrentFlag({ maxValue: -1 }))
      expect(hasReachMaxAccounts(6)).toBe(false)
    })

    it('should be false when the general offer is greater than the maximum', () => {
      flag.mockImplementation(
        getCurrentFlag({
          maxValue: 4,
          offers: [{ slug: '*', credit: 3, startsAt: past() }]
        })
      )
      expect(hasReachMaxAccounts(4)).toBe(false)
    })
  })

  describe('computeRemainingOfferCreditsByKonnector', () => {
    it('should return 0 if there are no offers', () => {
      flag.mockReturnValue(null)
      const result = computeRemainingOfferCreditsByKonnector('test', [])
      expect(result).toBe(0)
    })

    it('should return 0 if the offer has expired', () => {
      flag.mockReturnValue([
        {
          slug: 'test',
          credit: 1,
          endsAt: past(2),
          startsAt: past(4)
        }
      ])
      const result = computeRemainingOfferCreditsByKonnector('test', [])
      expect(result).toBe(0)
    })

    it('should return 0 if the offer has not started', () => {
      flag.mockReturnValue([{ slug: 'test', credit: 2, startsAt: future() }])
      const accounts = []

      const result = computeRemainingOfferCreditsByKonnector('test', accounts)
      expect(result).toBe(0)
    })

    it('should return 1 if the account was created before the offer started', () => {
      flag.mockReturnValue([{ slug: 'test', credit: 1, startsAt: past(2) }])
      const accounts = [{ _id: 'a123', cozyMetadata: { createdAt: past(3) } }]

      const result = computeRemainingOfferCreditsByKonnector('test', accounts)
      expect(result).toBe(1)
    })

    it('should return 0 if there is an available offer but there is already created an account', () => {
      flag.mockReturnValue([{ slug: 'test', credit: 1, startsAt: past(2) }])
      const accounts = [{ _id: 'a123', cozyMetadata: { createdAt: past(1) } }]

      const result = computeRemainingOfferCreditsByKonnector('test', accounts)
      expect(result).toBe(0)
    })

    it('should return 2 if there are credits remaining, even if accounts have already been created', () => {
      flag.mockReturnValue([
        { slug: 'test', credit: 1, startsAt: past(2) },
        { slug: 'test', credit: 2, startsAt: past(2) },
        { slug: 'test', credit: 1, startsAt: past(3) },
        { slug: 'test', credit: 2, startsAt: past(2) },
        { slug: 'test', credit: 1, startsAt: past(3) }
      ])
      const accounts = [
        { _id: 'a123', cozyMetadata: { createdAt: past(2) } },
        { _id: 'b123', cozyMetadata: { createdAt: past(1) } },
        { _id: 'c123', cozyMetadata: { createdAt: past(2) } },
        { _id: 'd123', cozyMetadata: { createdAt: past(3) } },
        { _id: 'e123', cozyMetadata: { createdAt: past(2) } }
      ]
      const result = computeRemainingOfferCreditsByKonnector('test', accounts)
      expect(result).toBe(2)
    })
  })

  describe('computeGeneralOfferCredits', () => {
    it('should return 0 when no offers are available', () => {
      flag.mockReturnValue([])
      expect(computeGeneralOfferCredits()).toBe(0)
    })

    it('should return 0 when no general offers are available', () => {
      flag.mockReturnValue([{ slug: 'konnector1', credit: 1 }])
      expect(computeGeneralOfferCredits()).toBe(0)
    })

    it('should return the total credit of all valid general offers', () => {
      flag.mockReturnValue([
        { slug: '*', startsAt: past(), endsAt: future(), credit: 1 },
        { slug: '*', startsAt: past(), endsAt: future(), credit: 2 },
        { slug: '*', startsAt: future(), endsAt: future(), credit: 3 }, // not started yet
        { slug: '*', startsAt: past(), endsAt: past(), credit: 4 }, // already ended
        { slug: '*', startsAt: past(), credit: 2 } // never ends
      ])
      expect(computeGeneralOfferCredits()).toBe(5)
    })
  })
})
