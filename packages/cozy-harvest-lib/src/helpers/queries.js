import CozyClient, { Q } from 'cozy-client'

const DEFAULT_CACHE_TIMEOUT_QUERIES = 10 * 60 * 1000
const defaultFetchPolicy = CozyClient.fetchPolicies.olderThan(
  DEFAULT_CACHE_TIMEOUT_QUERIES
)

export const buildKonnectorQueryBySlug = slug => {
  const query = {
    definition: () =>
      Q('io.cozy.konnectors').getById(`io.cozy.konnectors/${slug}`),
    options: {
      as: `io.cozy.konnectors/${slug}`,
      fetchPolicy: defaultFetchPolicy
    }
  }
  return { definition: query.definition(), options: query.options }
}

export const buildAppsRegistryQueryBySlug = slug => {
  const query = {
    definition: () => Q('io.cozy.apps_registry').getById(`${slug}`),
    options: {
      as: `io.cozy.apps_registry/${slug}`,
      fetchPolicy: defaultFetchPolicy
    }
  }
  return { definition: query.definition(), options: query.options }
}

export const buildAccountQuery = accountId => ({
  definition: Q('io.cozy.accounts').getById(accountId),
  options: {
    as: `io.cozy.accounts/${accountId}`,
    fetchPolicy: defaultFetchPolicy
  }
})
/**
 *
 * @param {string} accountId
 * @param {import('cozy-client/types/types').IOCozyKonnector} konnector
 * @returns
 */
export const buildTriggersQuery = (accountId, konnector) => ({
  definition: Q('io.cozy.triggers').where({
    type: konnector.clientSide ? '@client' : '@cron',
    'message.account': accountId,
    'message.konnector': konnector.slug
  }),
  options: {
    as: `triggers-${konnector.slug}-${accountId}`,
    fetchPolicy: defaultFetchPolicy
  }
})

export const buildTriggersByIdQuery = id => ({
  definition: Q('io.cozy.triggers').getById(id),
  options: {
    as: `io.cozy.triggers/${id}`,
    fetchPolicy: defaultFetchPolicy
  }
})

export const buildAppsByIdQuery = appSlug => ({
  definition: Q('io.cozy.apps').getById(`io.cozy.apps/${appSlug}`),
  options: {
    as: `io.cozy.apps/${appSlug}`,
    fetchPolicy: defaultFetchPolicy,
    singleDocData: true
  }
})

export const buildCountTriggersQuery = () => ({
  definition: Q('io.cozy.triggers')
    .where({ $or: [{ worker: 'client' }, { worker: 'konnector' }] })
    .indexFields(['worker']),
  options: {
    as: 'io.cozy.triggers/by_worker_client_konnector',
    fetchPolicy: defaultFetchPolicy
  }
})
