import { Q } from 'cozy-client'

import { Contact, Group } from '../models'

export const buildContactsQuery = () => ({
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
    as: 'io.cozy.contacts'
  }
})

export const buildGroupsQuery = () => ({
  definition: Q(Group.doctype),
  options: {
    as: 'io.cozy.contacts.groups'
  }
})
