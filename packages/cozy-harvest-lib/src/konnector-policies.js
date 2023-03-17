import logger from './logger'
import { konnectorPolicy as biWebViewPolicy } from './policies/biWebView'
import { konnectorPolicy as biKonnectorPolicy } from './policies/budget-insight'
import { konnectorPolicy as cliskPolicy } from './policies/clisk'

const defaultKonnectorPolicy = {
  accountContainsAuth: true,
  saveInVault: true,
  onAccountCreation: null,
  // eslint-disable-next-line no-unused-vars
  match: konnector => true,
  name: 'default',
  fetchExtraOAuthUrlParams: null,
  refreshContracts: null,
  needsTriggerLaunch: true,
  needsAccountAndTriggerCreation: true,
  onLaunch: null,
  isRunnable: () => true
}

const policies = [
  cliskPolicy,
  biWebViewPolicy,
  biKonnectorPolicy,
  defaultKonnectorPolicy
].filter(Boolean)

logger.info('Available konnector policies', policies)

/**
 * Find the konnector policy corresponding to the given konnector
 *
 * @param {KonnectorManifest} konnector
 * @returns {KonnectorPolicy}
 */
export const findKonnectorPolicy = konnector =>
  policies.find(policy => policy.match(konnector))
