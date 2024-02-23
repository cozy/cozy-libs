import PropTypes from 'prop-types'
import React from 'react'

import { useClient, useQueryAll } from 'cozy-client'

import SharingContext from '../../context'
import { Contact } from '../../models'
import { buildContactsQuery, buildGroupsQuery } from '../../queries/queries'
import { default as DumbShareModal } from '../ShareModal'
import { useFetchDocumentPath } from '../useFetchDocumentPath'

export const EditableSharingModal = ({ document, ...rest }) => {
  const client = useClient()
  const documentPath = useFetchDocumentPath(client, document)

  const contactsQuery = buildContactsQuery()
  const contactsResult = useQueryAll(
    contactsQuery.definition,
    contactsQuery.options
  )

  const groupsQuery = buildGroupsQuery()
  const groupsResult = useQueryAll(groupsQuery.definition, groupsQuery.options)

  return (
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
            contacts={contactsResult}
            createContact={contact => client.create(Contact.doctype, contact)}
            document={document}
            documentType={documentType}
            groups={groupsResult}
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
  )
}

EditableSharingModal.propTypes = {
  document: PropTypes.object
}

export default EditableSharingModal
