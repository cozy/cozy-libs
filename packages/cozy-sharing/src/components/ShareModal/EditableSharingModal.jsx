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
    revoke,
    revokeSelf,
    share
  } = useSharingContext()

  const shareFileRefId = hasSharedParent(document.path)
    ? document.dir_id
    : document._id
  const recipients = getRecipients(shareFileRefId)
  const permissions = getDocumentPermissions(shareFileRefId)
  const link = getSharingLink(shareFileRefId)
  const sharing = getSharingForSelf(shareFileRefId)
  const _isOwner = isOwner(shareFileRefId)

  return (
    <ShareModal
      createContact={contact => client.create(Contact.doctype, contact)}
      document={document}
      documentType={documentType}
      hasSharedChild={documentPath && hasSharedChild(documentPath)}
      hasSharedParent={documentPath && hasSharedParent(documentPath)}
      isOwner={_isOwner}
      link={link}
      onRevoke={revoke}
      onRevokeSelf={revokeSelf}
      onShare={share}
      permissions={permissions}
      recipients={recipients}
      sharing={sharing}
      {...rest}
    />
  )
}

EditableSharingModal.propTypes = {
  document: PropTypes.object
}

export default EditableSharingModal
