import React from 'react'
import PropTypes from 'prop-types'
import { queryConnect, useClient, Q } from 'cozy-client'

import { Contact, Group } from '../models'
import { contactsResponseType, groupsResponseType } from '../propTypes'
import SharingContext from '../context'
import ContactsAndGroupsDataLoader from './ContactsAndGroupsDataLoader'
import { default as DumbShareModal } from './ShareModal'
import { useFetchDocumentPath } from './useFetchDocumentPath'

export const EditableSharingModal = ({
  contacts,
  document,
  groups,
  ...rest
}) => {
  const client = useClient()
  const documentPath = useFetchDocumentPath(client, document)
  return (
    <ContactsAndGroupsDataLoader contacts={contacts} groups={groups}>
      <SharingContext.Consumer>
        {({
          documentType,
          getDocumentPermissions,
          getRecipients,
          getSharingForSelf,
          getSharingLink,
          hasSharedChild,
          hasSharedParent,
          isOwner,
          revoke,
          revokeSelf,
          revokeSharingLink,
          share,
          shareByLink,
          updateDocumentPermissions
        }) => {
          return (
            <DumbShareModal
              contacts={contacts}
              createContact={contact => client.create(Contact.doctype, contact)}
              document={document}
              documentType={documentType}
              groups={groups}
              hasSharedChild={documentPath && hasSharedChild(documentPath)}
              hasSharedParent={documentPath && hasSharedParent(documentPath)}
              isOwner={isOwner(document.id)}
              link={getSharingLink(document.id)}
              onRevoke={revoke}
              onRevokeLink={revokeSharingLink}
              onRevokeSelf={revokeSelf}
              onShare={share}
              onShareByLink={shareByLink}
              onUpdateShareLinkPermissions={updateDocumentPermissions}
              permissions={getDocumentPermissions(document.id)}
              recipients={getRecipients(document.id)}
              sharing={getSharingForSelf(document.id)}
              {...rest}
            />
          )
        }}
      </SharingContext.Consumer>
    </ContactsAndGroupsDataLoader>
  )
}

EditableSharingModal.propTypes = {
  contacts: contactsResponseType,
  document: PropTypes.object,
  groups: groupsResponseType
}

const contactsQuery = () =>
  Q(Contact.doctype)
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
    .limitBy(1000)

const groupsQuery = () => Q(Group.doctype)

export default queryConnect({
  contacts: {
    query: contactsQuery,
    as: 'contacts'
  },
  groups: {
    query: groupsQuery,
    as: 'groups'
  }
})(EditableSharingModal)
