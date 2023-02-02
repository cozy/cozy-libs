import { formatLocallyDistanceToNow } from 'cozy-ui/transpiled/react/I18n/format'

import { getLastSuccessDate } from '../../helpers/triggers'
import { isDisconnected } from '../../helpers/konnectors'

const DEFAULT_TIME = 300_000 // To milliseconds (5 minutes)

const getDifferenceInMinutes = date => {
  return Date.now() - new Date(date).getTime()
}

/**
 * @param {object} options
 * @param {object} options.t - i18n function
 * @param {object} options.konnector - Associated Connector
 * @param {object} options.trigger - Associated trigger
 * @param {object} options.running - If the connector is running
 * @param {object} options.expectingTriggerLaunch - If the trigger is waiting to be launched
 * @param {object} options.lastSuccessDate - The last date when the trigger was successfully executed
 * @returns {string}
 */
export const makeLabel = ({
  t,
  konnector,
  trigger,
  running,
  expectingTriggerLaunch
}) => {
  const lastSuccessDate = getLastSuccessDate(trigger)

  if (running || expectingTriggerLaunch) {
    return t('card.launchTrigger.lastSync.syncing')
  }

  if (lastSuccessDate) {
    if (getDifferenceInMinutes(lastSuccessDate) < DEFAULT_TIME) {
      return t('card.launchTrigger.lastSync.justNow')
    }

    return t('card.launchTrigger.lastSync.afterSomeTimes', {
      times: formatLocallyDistanceToNow(lastSuccessDate)
    })
  }

  if (isDisconnected(konnector, trigger)) {
    return t('card.launchTrigger.lastSync.disconnected')
  }

  return t('card.launchTrigger.lastSync.unknown')
}
