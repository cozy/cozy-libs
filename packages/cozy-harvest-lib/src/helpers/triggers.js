import DateFns from 'date-fns'
import get from 'lodash/get'

import { KonnectorJobError } from './konnectors'
import { toFrequency } from './cron'

const DEFAULT_CRON = '0 0 0 * * 0' // Once a week, sunday at midnight

/**
 * Build trigger attributes given konnector and account
 * @param  {object} konnector
 * @param  {object} account
 * @return {object} created trigger
 */
export const buildAttributes = ({
  account,
  cron = DEFAULT_CRON,
  folder,
  konnector
}) => {
  const message = {
    account: account._id,
    konnector: konnector.slug
  }

  if (folder) {
    message['folder_to_save'] = folder._id
  }

  return {
    type: '@cron',
    arguments: cron,
    worker: 'konnector',
    message
  }
}

export const getAccountId = trigger => {
  return get(trigger, 'message.account')
}

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
  buildAttributes,
  getAccountId,
  getKonnectorJobError,
  getFrequency,
  getKonnectorSlug,
  getLastSuccessDate
}

export default helpers
