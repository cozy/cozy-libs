import get from 'lodash/get'
import { KonnectorJobError } from './konnectors'

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

/**
 * Get error for a given trigger document
 * @param  {Object} trigger io.cozy.trigger as returned by stack
 * @return {KonnectorJobError}         [description]
 */
export const getError = trigger => {
  const status = get(trigger, 'current_state.status')
  return status === 'errored'
    ? new KonnectorJobError(get(trigger, 'current_state.last_error'))
    : null
}

const helpers = {
  buildAttributes,
  getError
}

export default helpers
