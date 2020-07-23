import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import flow from 'lodash/flow'
import { queryConnect, withClient, Q } from 'cozy-client'

import { Contact, Group } from '../models'
import { contactsResponseType, groupsResponseType } from '../propTypes'
import SharingContext from '../context'
import { getFilesPaths } from '../helpers/files'
import ContactsAndGroupsDataLoader from './ContactsAndGroupsDataLoader'
import { default as DumbShareModal } from './ShareModal'

const EditableSharingModal = ({
  client,
  contacts,
  document,
  groups,
  ...rest
}) => {
  const [documentPath, setDocumentPath] = useState(
    document.path ? document.path : null
  )
  useEffect(() => {
    ;(async () => {
      const path = await getFilesPaths(client, document._type, [document])
      setDocumentPath(path[0])
    })()
  })

  if (documentPath === null) return null

  return (
    <ContactsAndGroupsDataLoader contacts={contacts} groups={groups}>
      <SharingContext.Consumer>
        {({
          documentType,
          isOwner,
          getRecipients,
          getSharingLink,
          getDocumentPermissions,
          share,
          revoke,
          shareByLink,
          updateDocumentPermissions,
          revokeSharingLink,
          hasSharedParent,
          hasSharedChild,
          revokeSelf
        }) => {
          return (
            <DumbShareModal
              document={document}
              documentType={documentType}
              contacts={contacts}
              createContact={contact => client.create(Contact.doctype, contact)}
              groups={groups}
              recipients={getRecipients(document.id)}
              link={getSharingLink(document.id)}
              permissions={getDocumentPermissions(document.id)}
              isOwner={isOwner(document.id)}
              hasSharedParent={hasSharedParent(documentPath)}
              hasSharedChild={hasSharedChild(documentPath)}
              onShare={share}
              onRevoke={revoke}
              onShareByLink={shareByLink}
              onUpdateShareLinkPermissions={updateDocumentPermissions}
              onRevokeLink={revokeSharingLink}
              onRevokeSelf={revokeSelf}
              {...rest}
            />
          )
        }}
      </SharingContext.Consumer>
    </ContactsAndGroupsDataLoader>
  )
}

EditableSharingModal.propTypes = {
  client: PropTypes.object.isRequired,
  document: PropTypes.object,
  contacts: contactsResponseType.isRequired,
  groups: groupsResponseType.isRequired
}

const contactsQuery = () =>
  Q(Contact.doctype)
    .where({
      _id: {
        $gt: null
      },
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

const groupsQuery = () => Q(Group.doctype)

export default flow(
  queryConnect({
    contacts: {
      query: contactsQuery,
      as: 'contacts'
    },
    groups: {
      query: groupsQuery,
      as: 'groups'
    }
  }),
  withClient
)(EditableSharingModal)
