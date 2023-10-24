// @ts-check
// @ts-ignore
import flag from 'cozy-flags'

import {
  computeMaxAccountsByKonnector,
  hasReachMaxAccountsByKonnector,
  computeMaxAccounts,
  hasReachMaxAccounts,
  computeNbAccounts
} from './helpers'

jest.mock('cozy-flags')

/**
 * @param {Object} params
 * @param {number} [params.defaultValue] value return by default in maxByKonnector flag
 * @param {number} [params.idValue] value return for a specific konnector in maxByKonnector flag
 * @param {number} [params.maxValue] value return max flag
 * @returns { (flag:string) => number|null } return a function which take a flag name and returns its link number or null
 */
function getCurrentFlag({ defaultValue, idValue, maxValue } = {}) {
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
    return null
  }
}

describe('AccountsPaywall helpers', () => {
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
      const accounts = [
        { slug: 'konnector1', count: 3 },
        { slug: 'konnector2', count: 2 },
        { slug: 'konnector3', count: 1 }
      ]
      flag.mockImplementation(getCurrentFlag({ maxValue: 5 }))
      expect(hasReachMaxAccounts(accounts)).toBe(true)
    })

    it('should be false when current account number is below maximum', () => {
      const accounts = [
        { slug: 'konnector1', count: 1 },
        { slug: 'konnector2', count: 2 },
        { slug: 'konnector3', count: 1 }
      ]
      flag.mockImplementation(getCurrentFlag({ maxValue: 5 }))
      expect(hasReachMaxAccounts(accounts)).toBe(false)
    })

    it('should be false when there is no maximum', () => {
      const accounts = [
        { slug: 'konnector1', count: 3 },
        { slug: 'konnector2', count: 2 },
        { slug: 'konnector3', count: 1 }
      ]
      flag.mockImplementation(getCurrentFlag({ maxValue: -1 }))
      expect(hasReachMaxAccounts(accounts)).toBe(false)
    })
  })

  describe('computeNbAccounts', () => {
    it('should return 0 when given an empty array of accounts', () => {
      /**
       * @type {import("./helpers").AccountCountByKonnector[]}
       */
      const accounts = []
      /**
       * @type {import("./helpers").KonnectorOffer[]}
       */
      const offers = []
      const result = computeNbAccounts(accounts, offers)
      expect(result).toBe(0)
    })

    it('should return the sum of all account counts when no offers are available', () => {
      const accounts = [
        { slug: 'konnector1', count: 3 },
        { slug: 'konnector2', count: 2 },
        { slug: 'konnector3', count: 1 }
      ]
      /**
       * @type {import("./helpers").KonnectorOffer[]}
       */
      const offers = []
      const result = computeNbAccounts(accounts, offers)
      expect(result).toBe(6)
    })

    it('should subtract the offer count from the account count when an offer is available', () => {
      const accounts = [
        { slug: 'konnector1', count: 3 },
        { slug: 'konnector2', count: 2 },
        { slug: 'konnector3', count: 1 }
      ]
      const offers = [
        { slug: 'konnector1', offer: 1 },
        { slug: 'konnector2', offer: 2 }
      ]
      const result = computeNbAccounts(accounts, offers)
      expect(result).toBe(3)
    })

    it('should not subtract more than the account count when an offer is available', () => {
      const accounts = [
        { slug: 'konnector1', count: 3 },
        { slug: 'konnector2', count: 2 },
        { slug: 'konnector3', count: 1 }
      ]
      const offers = [
        { slug: 'konnector1', offer: 5 },
        { slug: 'konnector2', offer: 3 }
      ]
      const result = computeNbAccounts(accounts, offers)
      expect(result).toBe(1)
    })

    it('should ignore offers that do not have a matching konnector', () => {
      const accounts = [
        { slug: 'konnector1', count: 3 },
        { slug: 'konnector2', count: 2 },
        { slug: 'konnector3', count: 1 }
      ]
      const offers = [
        { slug: 'konnector4', offer: 1 },
        { slug: 'konnector5', offer: 2 }
      ]
      const result = computeNbAccounts(accounts, offers)
      expect(result).toBe(6)
    })

    it('should ignore offers that do not have a matching offer', () => {
      const accounts = [
        { slug: 'konnector1', count: 3 },
        { slug: 'konnector2', count: 2 },
        { slug: 'konnector3', count: 1 }
      ]
      const offers = [
        { slug: 'konnector4', offer: 1 },
        { slug: 'konnector5', offer: 2 }
      ]
      const result = computeNbAccounts(accounts, offers)
      expect(result).toBe(6)
    })

    it('should subtract offers whose expiration date is less than now', () => {
      jest
        .spyOn(global.Date, 'now')
        .mockImplementationOnce(() =>
          new Date('2024-01-01T11:01:58.135Z').valueOf()
        )

      const accounts = [
        { slug: 'konnector1', count: 3 },
        { slug: 'konnector2', count: 2 }
      ]
      const offers = [{ slug: 'konnector1', offer: 2, expiresAt: '2023-10-24' }]

      const result = computeNbAccounts(accounts, offers)
      expect(result).toBe(3)
    })

    it('should ignore offers whose expiration date has exceeded', () => {
      jest
        .spyOn(global.Date, 'now')
        .mockImplementationOnce(() =>
          new Date('2023-10-01T11:01:58.135Z').valueOf()
        )

      const accounts = [
        { slug: 'konnector1', count: 3 },
        { slug: 'konnector2', count: 2 }
      ]
      const offers = [{ slug: 'konnector1', offer: 2, expiresAt: '2023-10-24' }]

      const result = computeNbAccounts(accounts, offers)
      expect(result).toBe(5)
    })

    it('should subtract the joker offer from the total ', () => {
      const accounts = [
        { slug: 'konnector1', count: 3 },
        { slug: 'konnector2', count: 2 }
      ]
      const offers = [
        { slug: 'konnector1', offer: 2 },
        { slug: '*', offer: 1 }
      ]

      const result = computeNbAccounts(accounts, offers)
      expect(result).toBe(2)
    })

    it('should ignore the joker offer when  expiration date has exceeded', () => {
      jest
        .spyOn(global.Date, 'now')
        .mockImplementationOnce(() =>
          new Date('2023-10-01T11:01:58.135Z').valueOf()
        )

      const accounts = [
        { slug: 'konnector1', count: 3 },
        { slug: 'konnector2', count: 2 }
      ]
      const offers = [
        { slug: 'konnector1', offer: 2 },
        { slug: '*', offer: 1, expiresAt: '2023-10-24' }
      ]

      const result = computeNbAccounts(accounts, offers)
      expect(result).toBe(3)
    })
  })
})
