import get from 'lodash/get'

import enLocales from '../../locales/en.json'
import { makeLabel } from './helpers'

const t = x => get(enLocales, x)
const f = x => x

describe('makeLabel', () => {
  describe('it should return "Running…"', () => {
    it('when running is true', () => {
      const res = makeLabel({
        t,
        f,
        running: true,
        expectingTriggerLaunch: false,
        lastSuccessDate: '2021'
      })

      expect(res).toBe('Running…')
    })

    it('when runggin and expectingTriggerLaunch are true', () => {
      const res = makeLabel({
        t,
        f,
        running: true,
        expectingTriggerLaunch: true,
        lastSuccessDate: '2021'
      })

      expect(res).toBe('Running…')
    })

    it('when expectingTriggerLaunch is true', () => {
      const res = makeLabel({
        t,
        f,
        running: false,
        expectingTriggerLaunch: true,
        lastSuccessDate: '2021'
      })

      expect(res).toBe('Running…')
    })

    it('when lastSuccessDate is null', () => {
      const res = makeLabel({
        t,
        f,
        running: true,
        expectingTriggerLaunch: true,
        lastSuccessDate: null
      })

      expect(res).toBe('Running…')
    })
  })

  describe('when running and expectingTriggerLaunch are false', () => {
    it('should return lastSuccessDate if defined', () => {
      const res = makeLabel({
        t,
        f,
        running: false,
        expectingTriggerLaunch: false,
        lastSuccessDate: '2021'
      })

      expect(res).toBe('2021')
    })

    it('should return "Unknown" if lastSuccessDate is null', () => {
      const res = makeLabel({
        t,
        f,
        running: false,
        expectingTriggerLaunch: false,
        lastSuccessDate: null
      })

      expect(res).toBe('Unknown')
    })
  })
})
