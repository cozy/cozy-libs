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

export const buildAccountQuery = ({ slug, sourceAccountIdentifier }) => ({
  definition: Q('io.cozy.accounts').where({
    account_type: slug,
    'cozyMetadata.sourceAccountIdentifier': sourceAccountIdentifier
  }),
  options: {
    as: `io.cozy.accounts/account_type/${slug}/sourceAccountIdentifier/${sourceAccountIdentifier}`,
    fetchPolicy: defaultFetchPolicy
  }
})

/**
 *  Build an account query for the given konnector.
 * ("getById" throws an error even if the query is not enabled)
 * @param {string} accountId - io.cozy.accounts document's id
 * @returns {object} - a query spec
 */
export const buildAccountQueryById = accountId => {
  return {
    definition: () => Q('io.cozy.accounts').getById(accountId),
    options: {
      as: `io.cozy.accounts/${accountId}`,
      fetchPolicy: defaultFetchPolicy,
      singleDocData: true
    }
  }
}

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
    .where({
      _id: { $gt: null }
    })
    .partialIndex({
      worker: { $in: ['konnector', 'client'] }
    })
    .indexFields(['_id']),
  options: {
    as: 'io.cozy.triggers/by_worker_client_konnector',
    fetchPolicy: defaultFetchPolicy
  }
})

export const buildAppsRegistryMaintenance = () => ({
  definition: Q('io.cozy.apps_registry').getById('maintenance'),
  options: {
    as: 'io.cozy.apps_registry/maintenance',
    fetchPolicy: defaultFetchPolicy
  }
})

export const buildAppsRegistryBySlug = slug => ({
  definition: Q('io.cozy.apps_registry').getById(slug),
  options: {
    as: `io.cozy.apps_registry/${slug}`,
    fetchPolicy: defaultFetchPolicy,
    singleDocData: true
  }
})
