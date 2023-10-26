/* eslint-env jest */

import { KonnectorJobError } from 'helpers/konnectors'
import { getKonnectorJobError, isKonnectorRunning } from 'helpers/triggers'

describe('Triggers Helper', () => {
  describe('getKonnectorJobError', () => {
    it('returns known KonnectorJobError', () => {
      const trigger = {
        current_state: {
          last_error: 'USER_ACTION_NEEDED.CHANGE_PASSWORD',
          status: 'errored'
        }
      }
      expect(getKonnectorJobError(trigger)).toEqual(
        new KonnectorJobError('USER_ACTION_NEEDED.CHANGE_PASSWORD')
      )
    })

    it('returns null', () => {
      const trigger = {
        current_state: {
          status: 'done'
        }
      }
      expect(getKonnectorJobError(trigger)).toBeNull()
    })
  })

  describe('konnector status', () => {
    it('should return true or false', () => {
      expect(isKonnectorRunning({ current_state: {} })).toBe(false)
      expect(isKonnectorRunning({ current_state: { status: 'running' } })).toBe(
        true
      )
      expect(isKonnectorRunning({ current_state: { status: 'idle' } })).toBe(
        false
      )
    })
  })
})
