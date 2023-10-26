import DateFns from 'date-fns'
import get from 'lodash/get'

import { toFrequency } from './cron'
import { KonnectorJobError } from './konnectors'

/**
 * Get error for a given trigger document
 * @param  {Object} trigger io.cozy.trigger as returned by stack
 * @return {KonnectorJobError}         [description]
 */
export const getKonnectorJobError = trigger => {
  const status = get(trigger, 'current_state.status')
  return status === 'errored'
    ? new KonnectorJobError(get(trigger, 'current_state.last_error'))
    : null
}

/**
 * Get last success date
 * @param  {Object} trigger io.cozy.trigger as returned by stack
 * @return {Date}        Last success date or null if the trigger has never been
 * launched.
 */
export const getLastSuccessDate = trigger => {
  const lastSuccessDate =
    !!trigger && !!trigger.current_state && trigger.current_state.last_success
  if (!lastSuccessDate) return null
  return DateFns.parse(lastSuccessDate)
}

export const getKonnectorSlug = trigger => get(trigger, 'message.konnector')

export const getKonnectorStatus = trigger =>
  get(trigger, 'current_state.status')

export const isKonnectorRunning = trigger =>
  getKonnectorStatus(trigger) === 'running'

/**
 * Get frenquency of a cron trigger, based on its arguments.
 * @param  {Object} trigger io.cozy.triggers as returned by stack
 * @return {String}         Frequency value, between 'monthly', 'weekly',
 * 'daily', 'hourly' or null.
 */
export const getFrequency = trigger => {
  if (!trigger || !trigger.type === '@cron') return null
  return toFrequency(trigger.arguments)
}

const helpers = {
  isKonnectorRunning,
  getKonnectorJobError,
  getFrequency,
  getKonnectorSlug,
  getKonnectorStatus,
  getLastSuccessDate
}

export default helpers
