import { Q, fetchPolicies } from 'cozy-client'

import { Contact, Group } from '../models'

const DEFAULT_CACHE_TIMEOUT_QUERIES = 9 * 60 * 1000

const defaultFetchPolicy = fetchPolicies.olderThan(
  DEFAULT_CACHE_TIMEOUT_QUERIES
)

export const fetchApps = () => ({
  definition: Q('io.cozy.apps'),
  options: {
    as: 'io.cozy.apps',
    fetchPolicy: defaultFetchPolicy
  }
})

export const buildSharingsByIdQuery = sharingId => ({
  definition: Q('io.cozy.sharings').getById(sharingId),
  options: {
    as: `io.cozy.sharings/${sharingId}`,
    fetchPolicy: defaultFetchPolicy
  }
})

export const buildReachableContactsQuery = () => ({
  definition: Q(Contact.doctype)
    .where({
      _id: {
        $gt: null
      }
    })
    .partialIndex({
      trashed: {
        $or: [{ $eq: false }, { $exists: false }]
      },
      $or: [
        {
          cozy: {
            $not: {
              $size: 0
            }
          }
        },
        {
          email: {
            $not: {
              $size: 0
            }
          }
        }
      ]
    })
    .indexFields(['_id'])
    .limitBy(1000),
  options: {
    as: 'io.cozy.contacts/reachable'
  }
})

export const buildContactGroupsQuery = () => ({
  definition: Q(Group.doctype),
  options: {
    as: 'io.cozy.contacts.groups'
  }
})

export const buildInstanceSettingsQuery = () => ({
  definition: Q('io.cozy.settings').getById('io.cozy.settings.instance'),
  options: {
    as: 'io.cozy.settings/instance',
    singleDocData: true
  }
})
