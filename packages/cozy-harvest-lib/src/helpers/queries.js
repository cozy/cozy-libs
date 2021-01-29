import CozyClient, { Q } from 'cozy-client'

const DEFAULT_CACHE_TIMEOUT_QUERIES = 10 * 60 * 1000
const defaultFetchPolicy = CozyClient.fetchPolicies.olderThan(
  DEFAULT_CACHE_TIMEOUT_QUERIES
)

export const buildKonnectorQuery = (slug, source) => {
  const query = {
    definition: () =>
      Q('io.cozy.konnectors').getById(`io.cozy.konnectors/${slug}`),
    options: {
      as: `io.cozy.konnectors/${slug}-${source}`,
      fetchPolicy: defaultFetchPolicy
    }
  }
  const queryDef = query.definition()
  queryDef.sources = [source]

  return { definition: queryDef, options: query.options }
}

export const buildAccountQuery = accountId => ({
  definition: Q('io.cozy.accounts').getById(accountId),
  options: {
    as: `io.cozy.accounts/${accountId}`,
    fetchPolicy: defaultFetchPolicy
  }
})

export const buildTriggersQuery = (konnectorSlug, accountId) => ({
  definition: Q('io.cozy.triggers').where({
    type: '@cron',
    'message.account': accountId,
    'message.konnector': konnectorSlug
  }),
  options: {
    as: `triggers-${konnectorSlug}-${accountId}`,
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
