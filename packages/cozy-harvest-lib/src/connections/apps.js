import CozyClient, { Q } from 'cozy-client'

export const appsConn = {
  query: Q('io.cozy.apps'),
  as: 'harvest-apps',
  fetchPolicy: CozyClient.fetchPolicies.olderThan(30 * 1000)
}
