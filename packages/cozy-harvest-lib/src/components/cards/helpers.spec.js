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
        running: true,
        expectingTriggerLaunch: false,
        isKonnectorRunnable: true
      })

      expect(res).toBe('Data recovery…')
    })

    it('when runggin and expectingTriggerLaunch are true', () => {
      const res = makeLabel({
        t,
        running: true,
        expectingTriggerLaunch: true,
        isKonnectorRunnable: true
      })

      expect(res).toBe('Data recovery…')
    })

    it('when expectingTriggerLaunch is true', () => {
      const res = makeLabel({
        t,
        running: false,
        expectingTriggerLaunch: true,
        isKonnectorRunnable: true
      })

      expect(res).toBe('Data recovery…')
    })

    it('when lastSuccessDate is null', () => {
      const res = makeLabel({
        t,
        running: true,
        expectingTriggerLaunch: true,
        isKonnectorRunnable: true
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
        trigger: {
          current_state: { last_success: '2020-12-25T11:55:00.000Z' }
        },
        running: false,
        expectingTriggerLaunch: false,
        isKonnectorRunnable: true
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
        running: false,
        expectingTriggerLaunch: false,
        isKonnectorRunnable: true
      })

      expect(res).toBe(`${t('card.launchTrigger.lastSync.justNow')}`)
    })

    it('should return "Unknown" if lastSuccessDate is null', () => {
      const res = makeLabel({
        t,
        trigger: {
          current_state: { last_success: null }
        },
        running: false,
        expectingTriggerLaunch: false,
        isKonnectorRunnable: true
      })

      expect(res).toBe('Unknown')
    })

    it('should return "Disconnected" if no trigger but a konnector', () => {
      const res = makeLabel({
        t,
        konnector: {},
        running: false,
        expectingTriggerLaunch: false,
        isKonnectorRunnable: true
      })

      expect(res).toBe('Disconnected')
    })
  })

  describe('not runnable konnector', () => {
    it('should display the message when not runnable', () => {
      const t = x => x

      const res = makeLabel({
        t,
        konnector: {
          name: 'foo'
        },
        running: false,
        expectingTriggerLaunch: false,
        isKonnectorRunnable: false
      })

      expect(res).toBe('accountForm.notClientSide')
    })
  })
})
