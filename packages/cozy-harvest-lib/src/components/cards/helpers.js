import { formatLocallyDistanceToNow } from 'cozy-ui/transpiled/react/I18n/format'

const DEFAULT_TIME = 300_000 // To milliseconds (5 minutes)

const getDifferenceInMinutes = date => {
  return Date.now() - new Date(date).getTime()
}

/**
 * @param {object} options
 * @param {object} options.t - i18n function
 * @param {object} options.running - If the connector is running
 * @param {object} options.expectingTriggerLaunch - If the trigger is waiting to be launched
 * @param {object} options.lastSuccessDate - The last date when the trigger was successfully executed
 * @returns {string}
 */
export const makeLabel = ({
  t,
  running,
  expectingTriggerLaunch,
  lastSuccessDate
}) => {
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

  return t('card.launchTrigger.lastSync.unknown')
}
