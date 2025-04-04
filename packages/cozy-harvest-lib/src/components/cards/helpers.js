// @ts-check
import {
  formatLocallyDistanceToNow,
  initFormat
} from 'cozy-ui/transpiled/react/providers/I18n/format'

import { isDisconnected } from '../../helpers/konnectors'
import { getLastSuccessDate } from '../../helpers/triggers'

const DEFAULT_TIME = 300_000 // To milliseconds (5 minutes)
/**
 *
 * @param {Date} date
 * @returns number
 */
const getDifferenceInMillisecondes = date => {
  return Date.now() - new Date(date).getTime()
}

/**
 * @param {object} options
 * @param {function} options.t - i18n function
 * @param {import('cozy-client/types/types').IOCozyKonnector} options.konnector - Associated Connector
 * @param {object} options.trigger - Associated trigger
 * @param {object} options.isRunning - If the connector is running
 * @param {string} options.lang - lang identifier ('fr', 'en')
 * @returns {string}
 */
export const makeLabel = ({ t, konnector, trigger, isRunning, lang }) => {
  if (lang) {
    // force current language for cozy-ui formatLocallyDistanceToNow
    initFormat(lang)(new Date(), 'yyyy-MM-dd HH:mm:ss')
  }
  const lastSuccessDate = getLastSuccessDate(trigger)
  if (isRunning) {
    return t('card.launchTrigger.lastSync.syncing')
  }

  if (lastSuccessDate) {
    if (getDifferenceInMillisecondes(lastSuccessDate) < DEFAULT_TIME) {
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
