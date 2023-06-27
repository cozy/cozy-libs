import flag from 'cozy-flags'

import { computeMaxPapers } from './helpers'

jest.mock('cozy-flags')

describe('PapersPaywall helpers', () => {
  describe('computeMaxPapers', () => {
    it('should return infinity when there no flag set', () => {
      flag.mockReturnValue(null)
      expect(computeMaxPapers()).toBe(Infinity)
    })

    it('should return flag value if flag set', () => {
      flag.mockReturnValue(3)
      expect(computeMaxPapers()).toBe(3)
    })

    it('should return default case if flag infinity', () => {
      flag.mockReturnValue(-1)
      expect(computeMaxPapers()).toBe(Infinity)
    })
  })
})
