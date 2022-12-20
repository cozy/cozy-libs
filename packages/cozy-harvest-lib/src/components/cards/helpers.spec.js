import get from 'lodash/get'
import MockDate from 'mockdate'

import enLocales from '../../locales/en.json'
import { makeLabel } from './helpers'

const t = x => get(enLocales, x)
const f = x => x

describe('makeLabel', () => {
  describe('it should return "Data recovery…"', () => {
    it('when running is true', () => {
      const res = makeLabel({
        t,
        f,
        running: true,
        expectingTriggerLaunch: false,
        lastSuccessDate: '2021'
      })

      expect(res).toBe('Data recovery…')
    })

    it('when runggin and expectingTriggerLaunch are true', () => {
      const res = makeLabel({
        t,
        f,
        running: true,
        expectingTriggerLaunch: true,
        lastSuccessDate: '2021'
      })

      expect(res).toBe('Data recovery…')
    })

    it('when expectingTriggerLaunch is true', () => {
      const res = makeLabel({
        t,
        f,
        running: false,
        expectingTriggerLaunch: true,
        lastSuccessDate: '2021'
      })

      expect(res).toBe('Data recovery…')
    })

    it('when lastSuccessDate is null', () => {
      const res = makeLabel({
        t,
        f,
        running: true,
        expectingTriggerLaunch: true,
        lastSuccessDate: null
      })

      expect(res).toBe('Data recovery…')
    })
  })

  describe('when running and expectingTriggerLaunch are false', () => {
    beforeEach(() => {
      MockDate.set('2020-12-25T12:00:00.000Z')
    })
    afterEach(() => {
      MockDate.reset()
    })

    it('should return "Sync. ago..." if lastSuccessDate is defined and > 5 minutes', () => {
      const res = makeLabel({
        t,
        f,
        running: false,
        expectingTriggerLaunch: false,
        lastSuccessDate: '2020-12-25T11:55:00.000Z'
      })

      expect(res).toContain(
        `${t('card.launchTrigger.lastSync.afterSomeTimes')}`
      )
    })

    it('should return "Sync. just now" if lastSuccessDate is defined and < 5 minutes', () => {
      const res = makeLabel({
        t,
        f,
        running: false,
        expectingTriggerLaunch: false,
        lastSuccessDate: '2020-12-25T11:55:01.000Z'
      })

      expect(res).toBe(`${t('card.launchTrigger.lastSync.justNow')}`)
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
