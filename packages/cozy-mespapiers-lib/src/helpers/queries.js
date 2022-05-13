import { Q, fetchPolicies } from 'cozy-client'

import { CONTACTS_DOCTYPE, FILES_DOCTYPE, SETTINGS_DOCTYPE } from '../doctypes'

const defaultFetchPolicy = fetchPolicies.olderThan(30 * 1000)

export const buildFilesQueryByLabels = labels => {
  return {
    definition: () =>
      Q(FILES_DOCTYPE)
        .where({
          'metadata.qualification.label': {
            $in: labels
          }
        })
        .partialIndex({
          type: 'file',
          trashed: false
        })
        .indexFields(['metadata.qualification.label'])
        .select(['name', 'metadata.qualification.label'])
        .limitBy(1000),
    options: {
      as: `${FILES_DOCTYPE}/${JSON.stringify(labels)}`,
      fetchPolicy: defaultFetchPolicy
    }
  }
}

export const buildFilesQueryByLabel = label => ({
  definition: Q(FILES_DOCTYPE)
    .where({
      'metadata.qualification': {
        label: label
      }
    })
    .partialIndex({
      type: 'file',
      trashed: false
    })
    .indexFields(['created_at', 'metadata.qualification'])
    .sortBy([{ created_at: 'desc' }]),
  options: {
    as: `${FILES_DOCTYPE}/${label}`
  }
})

export const getOnboardingStatus = {
  definition: () => Q(SETTINGS_DOCTYPE),
  options: {
    as: `getOnboardingStatus`,
    fetchPolicy: fetchPolicies.noFetch()
  }
}

export const buildContactsQueryByIds = (ids = []) => ({
  definition: Q(CONTACTS_DOCTYPE).getByIds(ids),
  options: {
    as: `${CONTACTS_DOCTYPE}/${ids.join('')}`,
    fetchPolicy: defaultFetchPolicy
  }
})
