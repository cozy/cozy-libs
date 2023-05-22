import { formatLocallyDistanceToNow } from 'cozy-ui/transpiled/react/I18n/format'

import { isDisconnected } from '../../helpers/konnectors'
import { getLastSuccessDate } from '../../helpers/triggers'

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
 * @param {object} options.isKonnectorRunnable - If the konnector is runnable
 * @returns {string}
 */
export const makeLabel = ({
  t,
  konnector,
  trigger,
  running,
  expectingTriggerLaunch,
  isInMaintenance,
  isKonnectorRunnable
}) => {
  const lastSuccessDate = getLastSuccessDate(trigger)
  if (!isKonnectorRunnable) {
    return t('accountForm.notClientSide', { name: konnector.name })
  }
  const mantenanceSuffix = isInMaintenance
    ? ` · ${t('konnectorBlock.inMaintenance')}`
    : ''

  if (running || expectingTriggerLaunch) {
    return `${t('card.launchTrigger.lastSync.syncing')}${mantenanceSuffix}`
  }

  if (lastSuccessDate) {
    if (getDifferenceInMinutes(lastSuccessDate) < DEFAULT_TIME) {
      return `${t('card.launchTrigger.lastSync.justNow')}${mantenanceSuffix}`
    }

    return `${t('card.launchTrigger.lastSync.afterSomeTimes', {
      times: formatLocallyDistanceToNow(lastSuccessDate)
    })}${mantenanceSuffix}`
  }

  if (isDisconnected(konnector, trigger)) {
    return t('card.launchTrigger.lastSync.disconnected')
  }

  return t('card.launchTrigger.lastSync.unknown')
}
