import PropTypes from 'prop-types'
import React from 'react'

import { useClient, useQueryAll } from 'cozy-client'

import { useFetchDocumentPath } from '../../hooks/useFetchDocumentPath'
import { useSharingContext } from '../../hooks/useSharingContext'
import { Contact } from '../../models'
import {
  buildContactsQuery,
  buildContactGroupsQuery
} from '../../queries/queries'
import { default as DumbShareModal } from '../ShareModal'

export const EditableSharingModal = ({ document, ...rest }) => {
  const client = useClient()
  const documentPath = useFetchDocumentPath(client, document)

  const contactsQuery = buildContactsQuery()
  const contactsResult = useQueryAll(
    contactsQuery.definition,
    contactsQuery.options
  )

  const contactGroupsQuery = buildContactGroupsQuery()
  const contactGroupsResult = useQueryAll(
    contactGroupsQuery.definition,
    contactGroupsQuery.options
  )

  const {
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
  } = useSharingContext()

  return (
    <DumbShareModal
      contacts={contactsResult}
      contactGroups={contactGroupsResult}
      createContact={contact => client.create(Contact.doctype, contact)}
      document={document}
      documentType={documentType}
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
}

EditableSharingModal.propTypes = {
  document: PropTypes.object
}

export default EditableSharingModal
