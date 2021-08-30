import CozyClient, { Q } from 'cozy-client'

const DEFAULT_CACHE_TIMEOUT_QUERIES = 9 * 60 * 1000
const defaultFetchPolicy = CozyClient.fetchPolicies.olderThan(
  DEFAULT_CACHE_TIMEOUT_QUERIES
)

export const buildSharingsByIdQuery = sharingId => ({
  definition: Q('io.cozy.sharings').getById(sharingId),
  options: {
    as: `io.cozy.sharings/${sharingId}`,
    fetchPolicy: defaultFetchPolicy
  }
})
