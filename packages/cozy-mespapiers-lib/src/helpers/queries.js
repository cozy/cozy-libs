import { Q, fetchPolicies } from 'cozy-client'
import flag from 'cozy-flags'

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
  const select = [
    'name',
    'referenced_by',
    'metadata.country',
    'metadata.datetime',
    'metadata.expirationDate',
    'metadata.noticePeriod',
    'metadata.qualification.label',
    'metadata.referencedDate',
    'metadata.number',
    'metadata.contractType',
    'metadata.refTaxIncome',
    'cozyMetadata.uploadedBy',
    'created_at',
    'dir_id',
    'updated_at',
    'type',
    'trashed'
  ]
  if (!flag('mespapiers.migrated.metadata')) {
    select.push(
      'metadata.ibanNumber',
      'metadata.passportNumber',
      'metadata.vinNumber',
      'metadata.cardNumber',
      'metadata.cafFileNumber'
    )
  }

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
          'cozyMetadata.uploadedBy': { $exists: true }
        })
        .select(select)
        .limitBy(1000),
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
        'cozyMetadata.uploadedBy': { $exists: true }
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

export const buildContactsQuery = (enabled = true) => ({
  definition: () =>
    Q(CONTACTS_DOCTYPE)
      .where({
        // `where` should be removed when https://github.com/cozy/cozy-client/issues/1216 fixed
        _id: {
          $gt: null
        }
      })
      .select([
        '_id',
        'name',
        'displayName',
        'fullname',
        'email',
        'phone',
        'address',
        'birthday',
        'birthcity',
        'company',
        'jobTitle'
      ])
      .limitBy(1000),
  options: {
    as: CONTACTS_DOCTYPE,
    fetchPolicy: defaultFetchPolicy,
    enabled
  }
})

export const buildFilesQueryById = id => ({
  definition: () => Q(FILES_DOCTYPE).getById(id),
  options: {
    as: `${FILES_DOCTYPE}/${id}`,
    fetchPolicy: defaultFetchPolicy
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

export const buildKonnectorsQueryByQualificationLabel = label => ({
  definition: () =>
    Q(KONNECTORS_DOCTYPE)
      .where({ qualification_labels: { $in: [label] } })
      .indexFields(['qualification_labels']),
  options: {
    as: `${KONNECTORS_DOCTYPE}/qualificationLabel/${label}`,
    fetchPolicy: defaultFetchPolicy
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
