/* eslint-env jest */
import { randomDayTime } from 'helpers/daytime'

describe('daytime library', () => {
  describe('randomDayTime', () => {
    it('throws error on inconsistent start hour', () => {
      expect(() => randomDayTime(-1, 12)).toThrow(
        'interval must be inside [0, 24]'
      )
    })

    it('throws error on inconsistent end hour', () => {
      expect(() => randomDayTime(2, 26)).toThrow(
        'interval must be inside [0, 24]'
      )
    })

    it('throws error when randomize is null', () => {
      expect(() => randomDayTime(0, 1, null)).toThrow(
        'Parameter randomize must be a function'
      )
    })

    it('throws error when randomize is not a function', () => {
      expect(() => randomDayTime(0, 1, 2)).toThrow(
        'Parameter randomize must be a function'
      )
    })

    it('returns expected hours/minutes values', () => {
      const randomizeStub = jest.fn().mockReturnValueOnce(10.58)

      const result = randomDayTime(0, 24, randomizeStub)

      expect(result).toEqual({
        hours: 10,
        minutes: 34
      })
    })

    it('returns defaut hours/minutes with no parameter', () => {
      // Test based on random function, not sure if it is a good idea, but it
      // makes code 100% covered.
      const result = randomDayTime()

      expect(result.hours).toBe(0)

      expect(result.minutes).toBeGreaterThanOrEqual(0)
      expect(result.minutes).toBeLessThanOrEqual(59)
    })

    it('returns valid hours/minutes with default randomize function', () => {
      // Test based on random function, not sure if it is a good idea, but it
      // makes code 100% covered.
      const result = randomDayTime(19, 21)

      expect(result.hours).toBeGreaterThanOrEqual(19)
      expect(result.hours).toBeLessThanOrEqual(20)

      expect(result.minutes).toBeGreaterThanOrEqual(0)
      expect(result.minutes).toBeLessThanOrEqual(59)
    })

    it('throw error on incorrect minimal hour', () => {
      const randomizeStub = jest.fn().mockReturnValueOnce(-1)

      expect(() => randomDayTime(0, 24, randomizeStub)).toThrow(
        'randomize function returns invalid hour value'
      )
    })

    it('throws error on incorrect maximal hour', () => {
      const randomizeStub = jest.fn().mockReturnValueOnce(24)

      expect(() => randomDayTime(0, 24, randomizeStub)).toThrow(
        'randomize function returns invalid hour value'
      )
    })
  })
})
