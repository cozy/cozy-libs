import { Q, fetchPolicies } from 'cozy-client'

import {
  CONTACTS_DOCTYPE,
  FILES_DOCTYPE,
  SETTINGS_DOCTYPE,
  TRIGGERS_DOCTYPE,
  KONNECTORS_DOCTYPE,
  ACCOUNTS_DOCTYPE
} from '../doctypes'

const defaultFetchPolicy = fetchPolicies.olderThan(86_400_000) // 24 hours

export const buildFilesQueryWithQualificationLabel = () => {
  return {
    definition: () =>
      Q(FILES_DOCTYPE)
        .where({
          type: 'file',
          trashed: false
        })
        .partialIndex({
          'metadata.qualification.label': {
            $exists: true
          }
        })
        .indexFields(['metadata.qualification.label'])
        .select([
          'name',
          'referenced_by',
          'metadata.country',
          'metadata.datetime',
          'metadata.expirationDate',
          'metadata.noticePeriod',
          'metadata.qualification.label',
          'metadata.referencedDate',
          'created_at',
          'updated_at',
          'type',
          'trashed'
        ])
        .limitBy(1000),
    options: {
      as: `${FILES_DOCTYPE}/metadata_qualification_label`,
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
    as: `${FILES_DOCTYPE}/${label}`,
    fetchPolicy: defaultFetchPolicy
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

export const buildFilesQueryById = id => ({
  definition: Q(FILES_DOCTYPE).getById(id),
  options: {
    as: `${FILES_DOCTYPE}/${id}`,
    fetchPolicy: defaultFetchPolicy
  }
})

export const buildTriggersQueryByConnectorSlug = (slug, enabled) => ({
  definition: Q(TRIGGERS_DOCTYPE)
    .where({
      'message.konnector': slug
    })
    .indexFields(['message.konnector']),
  options: {
    as: `${TRIGGERS_DOCTYPE}/slug/${slug}`,
    fetchPolicy: defaultFetchPolicy,
    enabled
  }
})

export const buildConnectorsQueryById = (id, enabled = true) => ({
  definition: Q(KONNECTORS_DOCTYPE).getById(id),
  options: {
    as: `${KONNECTORS_DOCTYPE}/id/${id}`,
    fetchPolicy: defaultFetchPolicy,
    enabled
  }
})

export const buildKonnectorsQueryByQualificationLabels = (
  labels,
  enabled = true
) => ({
  definition: Q(KONNECTORS_DOCTYPE)
    .where({ qualification_labels: { $in: labels } })
    .indexFields(['qualification_labels']),
  options: {
    as: `${KONNECTORS_DOCTYPE}/qualificationLabels/${JSON.stringify(labels)}`,
    fetchPolicy: defaultFetchPolicy,
    enabled
  }
})

export const buildConnectorsQueryByQualificationLabel = label => ({
  definition: Q(KONNECTORS_DOCTYPE)
    .where({ qualification_labels: { $in: [label] } })
    .indexFields(['qualification_labels']),
  options: {
    as: `${KONNECTORS_DOCTYPE}/qualificationLabel/${label}`,
    fetchPolicy: defaultFetchPolicy
  }
})

export const buildAccountsQueryBySlug = (slug, enabled = true) => ({
  definition: Q(ACCOUNTS_DOCTYPE)
    .where({
      account_type: slug
    })
    .indexFields(['account_type']),
  options: {
    as: `${ACCOUNTS_DOCTYPE}/slug/${slug}`,
    fetchPolicy: defaultFetchPolicy,
    enabled
  }
})

export const queryAccounts = {
  definition: Q(ACCOUNTS_DOCTYPE),
  options: {
    as: `accounts`,
    fetchPolicy: defaultFetchPolicy
  }
}
