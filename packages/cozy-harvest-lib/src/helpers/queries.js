import CozyClient, { Q } from 'cozy-client'

const DEFAULT_CACHE_TIMEOUT_QUERIES = 9 * 60 * 1000
const defaultFetchPolicy = CozyClient.fetchPolicies.olderThan(
  DEFAULT_CACHE_TIMEOUT_QUERIES
)

export const buildKonnectorQuery = slug => ({
  definition: () =>
    Q('io.cozy.konnectors').getById(`io.cozy.konnectors/${slug}`),
  options: {
    as: `konnector-${slug}`,
    fetchPolicy: defaultFetchPolicy
  }
})
