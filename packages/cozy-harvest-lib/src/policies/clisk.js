// @ts-check
/**
 * Clisk specific policy
 */
import flag from 'cozy-flags'

import { KonnectorJobError } from '../helpers/konnectors'
import logger from '../logger'
import { ERROR_EVENT, LOGIN_SUCCESS_EVENT } from '../models/flowEvents'

/**
 * Check if the given konnector is a client side konnector
 * @param {import('cozy-client/types/types').KonnectorsDoctype} konnector - konnector object
 * @returns {Boolean}
 */
const isClisk = konnector => Boolean(konnector.clientSide)

/**
 * Get's the launcher in the current environment if any
 *
 * @returns {Object|null}
 */
export const getLauncher = () =>
  // @ts-ignore
  window?.cozy?.ClientConnectorLauncher ||
  window?.cozy?.ClientKonnectorLauncher ||
  null

function isRunnable() {
  return Boolean(getLauncher())
}

/**
 * start the launcher
 *
 * @param {Object} options - options object
 * @param {import('cozy-client/types/types').KonnectorsDoctype} options.konnector - konnector object
 * @param {import('cozy-client/types/types').AccountsDoctype} options.account - account object
 * @param {import('cozy-client/types/types').TriggersDoctype} options.trigger - trigger object
 * @param {import('../models/ConnectionFlow').ConnectionFlow} options.flow - ConnectionFlow object
 * @returns {Promise<StartLauncherResult | void>}
 */
async function onLaunch({ konnector, account, trigger, flow }) {
  const launcher = getLauncher()
  if (launcher) {
    // @ts-ignore
    logger.debug('Found a launcher', launcher)
  } else {
    // @ts-ignore
    logger.warn('Found no launcher')
  }
  if (launcher === 'react-native') {
    const result = await startLauncher({ konnector, account, trigger, flow })
    if (result?.errorMessage) {
      logger.debug(`Error from launcher ${result.errorMessage}`)
      flow.triggerEvent(ERROR_EVENT, new KonnectorJobError(result.errorMessage))
    }
    return result
  }
  return
}

/**
 * @typedef StartLauncherResult
 * @property {string} errorMessage - startLauncher errorMessage
 */

/**
 * Run the current clisk launcher with postMessage. Will wait for a return message the be sent to
 * resolve the promise
 *
 * @param {Object} options - options object
 * @param {import('cozy-client/types/types').KonnectorsDoctype} options.konnector - konnector object
 * @param {import('cozy-client/types/types').AccountsDoctype} options.account - account object
 * @param {import('cozy-client/types/types').TriggersDoctype} options.trigger - trigger object
 * @param {import('../models/ConnectionFlow').ConnectionFlow} options.flow - ConnectionFlow object
 * @returns {Promise<StartLauncherResult>}
 */
function startLauncher({ konnector, account, trigger, flow }) {
  return new Promise(resolve => {
    addMessageListener(rawData => {
      if (typeof rawData !== 'string') {
        return
      }

      const dataPayload = JSON.parse(rawData)

      if (
        dataPayload.type !== 'Clisk' ||
        (dataPayload.message !== 'launchResult' &&
          dataPayload.message !== LOGIN_SUCCESS_EVENT)
      ) {
        return
      }

      if (dataPayload.message === LOGIN_SUCCESS_EVENT) {
        flow.triggerEvent(LOGIN_SUCCESS_EVENT, dataPayload.param?.accountId)
        return
      }

      resolve(dataPayload.param)
    })
    // @ts-ignore ReactNativeWebview is injected by react-native launcher
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        message: 'startLauncher',
        value: {
          connector: konnector, // deprecated
          konnector,
          account,
          trigger,
          DEBUG: flag('debug') ? true : false
        }
      })
    )
  })
}

/**
 * Listens to postMessage event. Compatible with android and ios webviews
 *
 * @param {Function} callback - callback function
 */
function addMessageListener(callback) {
  // Android's WebView messaging interface
  window.document?.addEventListener?.('message', function (e) {
    callback(e.data)
  })
  // iOS's WebView messaging interface
  window?.addEventListener?.('message', function (e) {
    callback(e.data)
  })
}

export const konnectorPolicy = {
  match: isClisk,
  name: 'clisk',
  needsAccountAndTriggerCreation: false,
  needsTriggerLaunch: false,
  onLaunch,
  saveInVault: false,
  accountContainsAuth: false,
  onAccountCreation: null,
  fetchExtraOAuthUrlParams: null,
  refreshContracts: null,
  isRunnable,
  // ConnectionFlow always launches the konnector which will handle the error itself if any
  shouldLaunchRedirectToEdit: () => false,
  shouldLaunchDisplayOAuthWindow: () => false
}
