import React from 'react'
import PropTypes from 'prop-types'

import { contactsResponseType, groupsResponseType } from '../propTypes'

import ShareDialogCozyToCozy from './ShareDialogCozyToCozy'
import ShareDialogOnlyByLink from './ShareDialogOnlyByLink'
export const ShareModal = ({
  document,
  isOwner,
  sharingDesc,
  contacts,
  groups,
  createContact,
  link,
  permissions,
  recipients,
  documentType = 'Document',
  needsContactsPermission,
  hasSharedParent,
  hasSharedChild,
  onClose,
  onShare,
  onRevoke,
  onShareByLink,
  onUpdateShareLinkPermissions,
  onRevokeLink,
  onRevokeSelf,
  sharing
}) => {
  const showShareByEmail =
    documentType !== 'Notes' &&
    documentType !== 'Albums' &&
    !hasSharedParent &&
    !hasSharedChild
  const showShareOnlyByLink = hasSharedParent || hasSharedChild
  const showWhoHasAccess = documentType !== 'Albums'

  return (
    <>
      {(documentType === 'Notes' || documentType === 'Albums') && (
        <ShareDialogOnlyByLink
          onClose={onClose}
          documentType={documentType}
          document={document}
          permissions={permissions}
          link={link}
          onShareByLink={onShareByLink}
          onRevokeLink={onRevokeLink}
          onUpdateShareLinkPermissions={onUpdateShareLinkPermissions}
        />
      )}
      {documentType !== 'Notes' && documentType !== 'Albums' && (
        <ShareDialogCozyToCozy
          onClose={onClose}
          documentType={documentType}
          document={document}
          permissions={permissions}
          link={link}
          onShareByLink={onShareByLink}
          onRevokeLink={onRevokeLink}
          onUpdateShareLinkPermissions={onUpdateShareLinkPermissions}
          showShareOnlyByLink={showShareOnlyByLink}
          showShareByEmail={showShareByEmail}
          hasSharedParent={hasSharedParent}
          recipients={recipients}
          sharingDesc={sharingDesc}
          contacts={contacts}
          groups={groups}
          createContact={createContact}
          onShare={onShare}
          needsContactsPermission={needsContactsPermission}
          sharing={sharing}
          showWhoHasAccess={showWhoHasAccess}
          isOwner={isOwner}
          onRevoke={onRevoke}
          onRevokeSelf={onRevokeSelf}
        />
      )}
    </>
  )
}

export default ShareModal

ShareModal.propTypes = {
  document: PropTypes.object.isRequired,
  permissions: PropTypes.array.isRequired,
  isOwner: PropTypes.bool,
  sharingDesc: PropTypes.string,
  contacts: contactsResponseType.isRequired,
  groups: groupsResponseType.isRequired,
  createContact: PropTypes.func.isRequired,
  recipients: PropTypes.array.isRequired,
  link: PropTypes.string.isRequired,
  documentType: PropTypes.string,
  needsContactsPermission: PropTypes.bool,
  hasSharedParent: PropTypes.bool,
  hasSharedChild: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired,
  onRevoke: PropTypes.func.isRequired,
  onShareByLink: PropTypes.func.isRequired,
  onUpdateShareLinkPermissions: PropTypes.func.isRequired,
  onRevokeLink: PropTypes.func.isRequired
}
