import { Q, fetchPolicies } from 'cozy-client'

const defaultFetchPolicy = fetchPolicies.olderThan(30 * 1000)

export const buildViewerFileQuery = fileId => ({
  definition: () => Q('io.cozy.files').getById(fileId),
  options: {
    as: `buildViewerFileQuery/${fileId}`,
    fetchPolicy: defaultFetchPolicy
  }
})
