import { Q, fetchPolicies } from 'cozy-client'

import { DOCTYPE_CONTACTS, DOCTYPE_GROUPS } from '../models'

const DEFAULT_CACHE_TIMEOUT_QUERIES = 9 * 60 * 1000

const defaultFetchPolicy = fetchPolicies.olderThan(
  DEFAULT_CACHE_TIMEOUT_QUERIES
)

export const buildSharingsByIdQuery = sharingId => ({
  definition: Q('io.cozy.sharings').getById(sharingId),
  options: {
    as: `io.cozy.sharings/${sharingId}`,
    fetchPolicy: defaultFetchPolicy
  }
})

export const buildReachableContactsQuery = ({ inGroups } = {}) => ({
  definition: Q(DOCTYPE_CONTACTS)
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
      ],
      ...(inGroups && { 'relationships.groups.data': { $exists: true } })
    })
    .indexFields(['_id'])
    .limitBy(1000),
  options: {
    as: inGroups
      ? 'io.cozy.contacts/reachable-with-groups'
      : 'io.cozy.contacts/reachable'
  }
})

export const buildContactGroupsQuery = () => ({
  definition: Q(DOCTYPE_GROUPS),
  options: {
    as: `io.cozy.contacts.groups`,
    fetchPolicy: defaultFetchPolicy
  }
})

export const buildUnreachableContactsWithGroupsQuery = () => ({
  definition: Q(DOCTYPE_CONTACTS)
    .where({
      _id: {
        $gt: null
      }
    })
    .partialIndex({
      trashed: {
        $or: [{ $eq: false }, { $exists: false }]
      },
      cozy: {
        $size: 0
      },
      email: {
        $size: 0
      },
      'relationships.groups.data': {
        $exists: true
      }
    })
    .indexFields(['_id'])
    .limitBy(1000),
  options: {
    as: 'io.cozy.contacts/unreachable-with-groups',
    fetchPolicy: defaultFetchPolicy
  }
})

export const buildInstanceSettingsQuery = () => ({
  definition: Q('io.cozy.settings').getById('io.cozy.settings.instance'),
  options: {
    as: 'io.cozy.settings/instance',
    singleDocData: true
  }
})
