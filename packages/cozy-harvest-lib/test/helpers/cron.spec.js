import { fromFrequency, fromKonnector, toFrequency } from 'helpers/cron'

describe('Cron helpers', () => {
  describe('fromFrequency', () => {
    const options = {
      dayOfMonth: 25,
      dayOfWeek: 4,
      hours: 14,
      minutes: 15
    }

    it('creates default cron (weekly)', () => {
      expect(fromFrequency()).toEqual('0 0 0 * * 1')
    })

    it('creates weekly cron', () => {
      expect(fromFrequency('weekly', options)).toEqual('0 15 14 * * 4')
    })

    it('creates monthly cron', () => {
      expect(fromFrequency('monthly', options)).toEqual('0 15 14 25 * *')
    })

    it('creates daily cron', () => {
      expect(fromFrequency('daily', options)).toEqual('0 15 14 * * *')
    })

    it('creates hourly cron', () => {
      expect(fromFrequency('hourly', options)).toEqual('0 15 * * * *')
    })
  })

  describe('fromKonnector', () => {
    const randomDayTimeMock = jest.fn()

    beforeEach(() => {
      randomDayTimeMock.mockImplementation((min, max) => ({
        hours: max - 1,
        minutes: 59
      }))
    })

    afterEach(() => {
      randomDayTimeMock.mockReset()
    })

    it('returns expected default cron', () => {
      const konnector = {}
      const date = new Date('2019-02-07T14:12:00')
      expect(fromKonnector(konnector, date, randomDayTimeMock)).toEqual(
        `0 59 4 * * 4`
      )
    })

    it('returns expected monthly cron', () => {
      const konnector = {
        frequency: 'monthly'
      }
      const date = new Date('2019-02-07T14:12:00')
      expect(fromKonnector(konnector, date, randomDayTimeMock)).toEqual(
        `0 59 4 7 * *`
      )
    })

    it('returns expected cron with time interval', () => {
      const konnector = {
        time_interval: [0, 12]
      }
      const date = new Date('2019-02-07T14:12:00')
      expect(fromKonnector(konnector, date, randomDayTimeMock)).toEqual(
        `0 59 11 * * 4`
      )
    })
  })

  describe('toFrequency', () => {
    it('returns weekly', () => {
      expect(toFrequency('0 0 0 * * 1')).toEqual('weekly')
    })

    it('returns monthly', () => {
      expect(toFrequency('0 15 14 25 * *')).toEqual('monthly')
    })

    it('returns daily', () => {
      expect(toFrequency('0 15 14 * * *')).toEqual('daily')
    })

    it('returns hourly', () => {
      expect(toFrequency('0 15 * * * *')).toEqual('hourly')
    })

    it('returns null', () => {
      expect(toFrequency('0 * * * * *')).toBeNull()
    })
  })
})
