import React from 'react'
import PropTypes from 'prop-types'

import { contactsResponseType, groupsResponseType } from '../propTypes'

import ShareDialogCozyToCozy from './ShareDialogCozyToCozy'
import ShareDialogOnlyByLink from './ShareDialogOnlyByLink'
export const ShareModal = ({
  contacts,
  createContact,
  document,
  documentType = 'Document',
  groups,
  hasSharedChild,
  hasSharedParent,
  isOwner,
  link,
  needsContactsPermission,
  onClose,
  onRevoke,
  onRevokeLink,
  onRevokeSelf,
  onShare,
  onShareByLink,
  onUpdateShareLinkPermissions,
  permissions,
  recipients,
  sharing,
  sharingDesc,
  twoStepsConfirmationMethods
}) => {
  const showShareByEmail =
    documentType !== 'Notes' &&
    documentType !== 'Albums' &&
    !hasSharedParent &&
    !hasSharedChild
  const showShareByLink = documentType !== 'Organizations'
  const showShareOnlyByLink = hasSharedParent || hasSharedChild
  const showWhoHasAccess = documentType !== 'Albums'

  return (
    <>
      {(documentType === 'Notes' || documentType === 'Albums') && (
        <ShareDialogOnlyByLink
          document={document}
          documentType={documentType}
          link={link}
          onClose={onClose}
          onRevokeLink={onRevokeLink}
          onShareByLink={onShareByLink}
          onUpdateShareLinkPermissions={onUpdateShareLinkPermissions}
          permissions={permissions}
        />
      )}
      {documentType !== 'Notes' && documentType !== 'Albums' && (
        <ShareDialogCozyToCozy
          contacts={contacts}
          createContact={createContact}
          document={document}
          documentType={documentType}
          groups={groups}
          hasSharedParent={hasSharedParent}
          isOwner={isOwner}
          link={link}
          needsContactsPermission={needsContactsPermission}
          onClose={onClose}
          onRevoke={onRevoke}
          onRevokeLink={onRevokeLink}
          onRevokeSelf={onRevokeSelf}
          onShare={onShare}
          onShareByLink={onShareByLink}
          onUpdateShareLinkPermissions={onUpdateShareLinkPermissions}
          permissions={permissions}
          recipients={recipients}
          sharing={sharing}
          sharingDesc={sharingDesc}
          showShareByEmail={showShareByEmail}
          showShareByLink={showShareByLink}
          showShareOnlyByLink={showShareOnlyByLink}
          showWhoHasAccess={showWhoHasAccess}
          twoStepsConfirmationMethods={twoStepsConfirmationMethods}
        />
      )}
    </>
  )
}

export default ShareModal

ShareModal.propTypes = {
  contacts: contactsResponseType.isRequired,
  createContact: PropTypes.func.isRequired,
  document: PropTypes.object.isRequired,
  documentType: PropTypes.string,
  groups: groupsResponseType.isRequired,
  hasSharedChild: PropTypes.bool,
  hasSharedParent: PropTypes.bool,
  isOwner: PropTypes.bool,
  link: PropTypes.string,
  needsContactsPermission: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onRevoke: PropTypes.func.isRequired,
  onRevokeLink: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired,
  onShareByLink: PropTypes.func.isRequired,
  onUpdateShareLinkPermissions: PropTypes.func.isRequired,
  permissions: PropTypes.array.isRequired,
  recipients: PropTypes.array.isRequired,
  sharingDesc: PropTypes.string,
  twoStepsConfirmationMethods: PropTypes.shape({
    getRecipientsToBeConfirmed: PropTypes.func,
    confirmRecipient: PropTypes.func,
    rejectRecipient: PropTypes.func,
    recipientConfirmationDialogContent: PropTypes.func
  })
}
