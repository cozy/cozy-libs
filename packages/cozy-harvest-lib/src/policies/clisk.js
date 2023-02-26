// @ts-check
/**
 * CCC specific policy
 */

import logger from '../logger'

/**
 * Check if the given konnector is a client side connector
 * @param {import('cozy-client/types/types').KonnectorsDoctype} konnector - konnector object
 * @returns {Boolean}
 */
const isCCC = konnector => Boolean(konnector.clientSide)

/**
 * Get's the launcher in the current environment if any
 *
 * @returns {Object|null}
 */
export const getLauncher = () =>
  // @ts-ignore
  window?.cozy?.ClientConnectorLauncher || null

function isRunnable() {
  return Boolean(getLauncher())
}

/**
 * start the launcher
 *
 * @param {Object} options - options object
 * @param {import('cozy-client/types/types').KonnectorsDoctype} options.konnector - konnector object
 */
function onLaunch({ konnector, account, trigger }) {
  const launcher = getLauncher()
  if (launcher) {
    logger.debug('Found a launcher', launcher)
  } else {
    logger.warn('Found no launcher')
  }
  if (launcher === 'react-native') {
    // @ts-ignore ReactNativeWebview is injected by react-native launcher
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        message: 'startLauncher',
        value: {
          connector: konnector,
          account,
          trigger
        }
      })
    )
  }
}

export const konnectorPolicy = {
  match: isCCC,
  name: 'ccc',
  needsAccountAndTriggerCreation: false,
  needsTriggerLaunch: false,
  onLaunch,
  saveInVault: false,
  accountContainsAuth: false,
  onAccountCreation: null,
  fetchExtraOAuthUrlParams: null,
  refreshContracts: null,
  isRunnable
}
