import get from 'lodash/get'
import MockDate from 'mockdate'

import { makeLabel } from './helpers'
import enLocales from '../../locales/en.json'

const t = x => get(enLocales, x)

describe('makeLabel', () => {
  describe('it should return "Data recovery…"', () => {
    it('when running is true', () => {
      const res = makeLabel({
        t,
        isRunning: true
      })

      expect(res).toBe('Data recovery…')
    })

    it('when lastSuccessDate is null', () => {
      const res = makeLabel({
        t,
        isRunning: true
      })

      expect(res).toBe('Data recovery…')
    })
  })

  describe('when isRunning', () => {
    beforeEach(() => {
      MockDate.set('2020-12-25T12:00:00.000Z')
    })
    afterEach(() => {
      MockDate.reset()
    })

    it('should return "Sync. ago..." if lastSuccessDate is defined and > 5 minutes', () => {
      const res = makeLabel({
        t,
        lang: 'fr',
        trigger: {
          current_state: { last_success: '2020-12-25T11:55:00.000Z' }
        },
        isRunning: false
      })

      expect(res).toContain(
        `${t('card.launchTrigger.lastSync.afterSomeTimes')}`
      )
    })

    it('should return "Sync. just now" if lastSuccessDate is defined and < 5 minutes', () => {
      const res = makeLabel({
        t,
        trigger: {
          current_state: { last_success: '2020-12-25T11:55:01.000Z' }
        },
        isRunning: false
      })

      expect(res).toBe(`${t('card.launchTrigger.lastSync.justNow')}`)
    })

    it('should return unknown if lastSuccessDate is null', () => {
      const res = makeLabel({
        t,
        trigger: {
          current_state: { last_success: null }
        },
        isRunning: false
      })

      expect(res).toBe('Last sync. unknown')
    })

    it('should return "Disconnected" if no trigger but a konnector', () => {
      const res = makeLabel({
        t,
        konnector: {},
        isRunning: false
      })

      expect(res).toBe('Disconnected')
    })
  })
})
