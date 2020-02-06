import flag from 'cozy-flags'
import logger from './logger'
import { konnectorPolicy as biKonnectorPolicy } from './services/budget-insight'

const defaultKonnectorPolicy = {
  accountContainsAuth: true,
  saveInVault: true,
  onAccountCreation: null,
  match: () => true,
  name: 'default'
}

const policies = [
  flag('bi-konnector-policy') ? biKonnectorPolicy : null,
  defaultKonnectorPolicy
].filter(Boolean)

logger.info('Available konnector policies', policies)

export const findKonnectorPolicy = konnector => {
  const policy = policies.find(policy => policy.match(konnector))
  logger.info(`Using ${policy.name} konnector policy for ${konnector.slug}`)
  return policy
}
