import PropTypes from 'prop-types'
import React from 'react'

import { useClient } from 'cozy-client'

import { useFetchDocumentPath } from '../../hooks/useFetchDocumentPath'
import { useSharingContext } from '../../hooks/useSharingContext'
import { Contact } from '../../models'
import { ShareModal } from '../ShareModal'

export const EditableSharingModal = ({ document, ...rest }) => {
  const client = useClient()
  const documentPath = useFetchDocumentPath(client, document)

  const {
    documentType,
    getDocumentPermissions,
    getRecipients,
    getSharingForSelf,
    getSharingLink,
    hasSharedChild,
    hasSharedParent,
    isOwner,
    isSharedDrive,
    revoke,
    revokeSelf,
    share
  } = useSharingContext()

  return (
    <ShareModal
      createContact={contact => client.create(Contact.doctype, contact)}
      document={document}
      documentType={documentType}
      hasSharedChild={documentPath && hasSharedChild(documentPath)}
      hasSharedParent={documentPath && hasSharedParent(documentPath)}
      isOwner={isOwner(document._id)}
      isSharedDrive={isSharedDrive(document._id)}
      link={getSharingLink(document._id)}
      onRevoke={revoke}
      onRevokeSelf={revokeSelf}
      onShare={share}
      permissions={getDocumentPermissions(document._id)}
      recipients={getRecipients(document._id)}
      sharing={getSharingForSelf(document._id)}
      {...rest}
    />
  )
}

EditableSharingModal.propTypes = {
  document: PropTypes.object
}

export default EditableSharingModal
