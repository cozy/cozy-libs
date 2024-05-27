import { Q, fetchPolicies } from 'cozy-client'

import { FILES_DOCTYPE } from '../../doctypes'

const defaultFetchPolicy = fetchPolicies.olderThan(30 * 1000)

export const buildViewerFileQuery = fileId => ({
  definition: () => Q(FILES_DOCTYPE).getById(fileId).include(['bills']),
  options: {
    as: `buildViewerFileQuery/${fileId}`,
    fetchPolicy: defaultFetchPolicy
  }
})
