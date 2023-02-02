import logger from './logger'
import { konnectorPolicy as biKonnectorPolicy } from './services/budget-insight'
import { konnectorPolicy as biWebViewPolicy } from './services/biWebView'
import { konnectorPolicy as cccPolicy } from './services/cccPolicy'

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
  cccPolicy,
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
export const findKonnectorPolicy = konnector => {
  const policy = policies.find(policy => policy.match(konnector))
  logger.info(`Using ${policy.name} konnector policy for ${konnector.slug}`)
  return policy
}
