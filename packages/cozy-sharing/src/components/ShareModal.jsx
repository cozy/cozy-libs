import PropTypes from 'prop-types'
import React from 'react'

import flag from 'cozy-flags'

import ShareDialogCozyToCozy from './ShareDialogCozyToCozy'
import ShareDialogOnlyByLink from './ShareDialogOnlyByLink'

export const ShareModal = ({
  autoOpenShareRestriction,
  createContact,
  document,
  documentType = 'Document',
  hasSharedChild,
  hasSharedParent,
  isOwner,
  link,
  onClose,
  onRevoke,
  onRevokeSelf,
  onShare,
  permissions,
  recipients,
  sharing,
  sharingDesc,
  showGenerateLinkButton,
  twoStepsConfirmationMethods,
  canManageMembers = true
}) => {
  const shareDialogOnlyByLink =
    !canManageMembers ||
    flag('cozy.hide-sharing-cozy-to-cozy') ||
    documentType === 'Albums'

  const showShareByEmail = !hasSharedParent && !hasSharedChild
  const showShareByLink = documentType !== 'Organizations'
  const showShareOnlyByLink = hasSharedParent || hasSharedChild
  const showWhoHasAccess = documentType !== 'Albums'

  return shareDialogOnlyByLink ? (
    <ShareDialogOnlyByLink
      isOwner={isOwner}
      onRevoke={onRevoke}
      onRevokeSelf={onRevokeSelf}
      recipients={recipients}
      document={document}
      documentType={documentType}
      link={link}
      onClose={onClose}
      permissions={permissions}
      showGenerateLinkButton={showGenerateLinkButton}
      autoOpenShareRestriction={autoOpenShareRestriction}
      canManageMembers={canManageMembers}
    />
  ) : (
    <ShareDialogCozyToCozy
      createContact={createContact}
      document={document}
      documentType={documentType}
      hasSharedParent={hasSharedParent}
      isOwner={isOwner}
      link={link}
      onClose={onClose}
      onRevoke={onRevoke}
      onRevokeSelf={onRevokeSelf}
      onShare={onShare}
      permissions={permissions}
      recipients={recipients}
      sharing={sharing}
      sharingDesc={sharingDesc}
      showShareByEmail={showShareByEmail}
      showShareByLink={showShareByLink}
      showShareOnlyByLink={showShareOnlyByLink}
      showWhoHasAccess={showWhoHasAccess}
      showGenerateLinkButton={showGenerateLinkButton}
      autoOpenShareRestriction={autoOpenShareRestriction}
      twoStepsConfirmationMethods={twoStepsConfirmationMethods}
    />
  )
}

ShareModal.propTypes = {
  autoOpenShareRestriction: PropTypes.bool,
  createContact: PropTypes.func.isRequired,
  document: PropTypes.object.isRequired,
  documentType: PropTypes.string,
  hasSharedChild: PropTypes.bool,
  hasSharedParent: PropTypes.bool,
  isOwner: PropTypes.bool,
  link: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onRevoke: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired,
  permissions: PropTypes.array.isRequired,
  recipients: PropTypes.array.isRequired,
  sharingDesc: PropTypes.string,
  showGenerateLinkButton: PropTypes.bool,
  canManageMembers: PropTypes.bool,
  twoStepsConfirmationMethods: PropTypes.shape({
    getRecipientsToBeConfirmed: PropTypes.func,
    confirmRecipient: PropTypes.func,
    rejectRecipient: PropTypes.func,
    recipientConfirmationDialogContent: PropTypes.func
  })
}

export default ShareModal
