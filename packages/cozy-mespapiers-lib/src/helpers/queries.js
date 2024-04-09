import { Q, fetchPolicies } from 'cozy-client'

import {
  CONTACTS_DOCTYPE,
  FILES_DOCTYPE,
  SETTINGS_DOCTYPE,
  TRIGGERS_DOCTYPE,
  KONNECTORS_DOCTYPE,
  ACCOUNTS_DOCTYPE,
  APPS_REGISTRY_DOCTYPE
} from '../doctypes'

const defaultFetchPolicy = fetchPolicies.olderThan(86_400_000) // 24 hours

export const buildFilesQueryWithQualificationLabel = () => {
  const select = [
    'name',
    'mime',
    'referenced_by',
    'metadata.country',
    'metadata.datetime',
    'metadata.expirationDate',
    'metadata.noticePeriod',
    'metadata.qualification.label',
    'metadata.referencedDate',
    'metadata.number',
    'metadata.vehicle.licenseNumber',
    'metadata.vehicle.confidentialNumber',
    'metadata.contractType',
    'metadata.refTaxIncome',
    'metadata.netSocialAmount',
    'metadata.title',
    'metadata.version',
    'cozyMetadata.createdByApp',
    'created_at',
    'dir_id',
    'updated_at',
    'type',
    'trashed'
  ]

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
          },
          'cozyMetadata.createdByApp': { $exists: true }
        })
        .select(select)
        .limitBy(1000)
        .indexFields(['type', 'trashed']),
    options: {
      as: `${FILES_DOCTYPE}/metadata_qualification_label`,
      fetchPolicy: defaultFetchPolicy
    }
  }
}

export const buildFilesQueryByLabel = label => ({
  definition: () =>
    Q(FILES_DOCTYPE)
      .where({
        'metadata.qualification': {
          label: label
        }
      })
      .partialIndex({
        type: 'file',
        trashed: false,
        'cozyMetadata.createdByApp': { $exists: true }
      })
      .indexFields(['created_at', 'metadata.qualification'])
      .sortBy([{ created_at: 'desc' }]),
  options: {
    as: `${FILES_DOCTYPE}/${label}`,
    fetchPolicy: defaultFetchPolicy
  }
})

export const getAppSettings = {
  definition: () => Q(SETTINGS_DOCTYPE),
  options: {
    as: SETTINGS_DOCTYPE,
    fetchPolicy: fetchPolicies.noFetch()
  }
}

export const buildContactsQueryByIds = (ids = [], enabled = true) => ({
  definition: () => Q(CONTACTS_DOCTYPE).getByIds(ids),
  options: {
    as: `${CONTACTS_DOCTYPE}/${ids.join('')}`,
    fetchPolicy: defaultFetchPolicy,
    enabled
  }
})

// getById must have a thruty value, even if "enabled" is "false"
// cf: https://github.com/cozy/cozy-client/issues/961
export const buildFileQueryById = id => ({
  definition: Q(FILES_DOCTYPE).getById(id),
  options: {
    as: `${FILES_DOCTYPE}/${id}`,
    fetchPolicy: defaultFetchPolicy,
    singleDocData: true
  }
})

export const buildTriggersQueryByKonnectorSlug = (slug, enabled) => ({
  definition: () =>
    Q(TRIGGERS_DOCTYPE)
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

export const buildKonnectorsQueryById = (id, enabled = true) => ({
  definition: () => Q(KONNECTORS_DOCTYPE).getById(id),
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
  definition: () =>
    Q(KONNECTORS_DOCTYPE)
      .where({ qualification_labels: { $in: labels } })
      .indexFields(['qualification_labels']),
  options: {
    as: `${KONNECTORS_DOCTYPE}/qualificationLabels/${JSON.stringify(labels)}`,
    fetchPolicy: defaultFetchPolicy,
    enabled
  }
})

export const buildAccountsQueryBySlugs = (slugs, enabled = true) => ({
  definition: () =>
    Q(ACCOUNTS_DOCTYPE)
      .where({
        account_type: { $in: slugs }
      })
      .indexFields(['account_type']),
  options: {
    as: `${ACCOUNTS_DOCTYPE}/slugs/${JSON.stringify(slugs)}`,
    fetchPolicy: defaultFetchPolicy,
    enabled
  }
})

export const queryAccounts = {
  definition: () => Q(ACCOUNTS_DOCTYPE),
  options: {
    as: `accounts`,
    fetchPolicy: defaultFetchPolicy
  }
}

export const buildAppRegistryQueryBySlug = slug => {
  return {
    definition: () => Q(APPS_REGISTRY_DOCTYPE).getById(slug),
    options: {
      as: `${APPS_REGISTRY_DOCTYPE}/${slug}`,
      fetchPolicy: defaultFetchPolicy,
      singleDocData: true
    }
  }
}
