// @ts-check
// @ts-ignore
import flag from 'cozy-flags'

import {
  computeMaxAccountsByKonnector,
  hasReachMaxAccountsByKonnector,
  computeMaxAccounts,
  hasReachMaxAccounts
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
      flag.mockImplementation(getCurrentFlag({ maxValue: 5 }))
      expect(hasReachMaxAccounts(5)).toBe(true)
    })

    it('should be false when current account number is below maximum', () => {
      flag.mockImplementation(getCurrentFlag({ maxValue: 5 }))
      expect(hasReachMaxAccounts(4)).toBe(false)
    })

    it('should be false when there is no maximum', () => {
      flag.mockImplementation(getCurrentFlag({ maxValue: -1 }))
      expect(hasReachMaxAccounts(5)).toBe(false)
    })
  })
})
