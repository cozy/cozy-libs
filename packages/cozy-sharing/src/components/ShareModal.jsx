import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { translate } from 'cozy-ui/transpiled/react/I18n'

import Dialog, {
  DialogTitle,
  DialogActions
} from 'cozy-ui/transpiled/react/Dialog'
import DialogCloseButton from 'cozy-ui/transpiled/react/MuiCozyTheme/Dialog/DialogCloseButton'
import DialogContent from 'cozy-ui/transpiled/react/MuiCozyTheme/Dialog/DialogContent'
import Divider from 'cozy-ui/transpiled/react/MuiCozyTheme/Divider'
import MuiCozyTheme from 'cozy-ui/transpiled/react/MuiCozyTheme'

import styles from '../share.styl'

import { contactsResponseType, groupsResponseType } from '../propTypes'
import { default as DumbShareByLink } from './ShareByLink'
import { default as DumbShareByEmail } from './ShareByEmail'
import WhoHasAccess from './WhoHasAccess'

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
  t,
  sharing
}) => {
  return (
    <MuiCozyTheme>
      <Dialog
        open={true}
        onClose={onClose}
        PaperProps={{ className: 'u-pb-half' }}
        disableEnforceFocus
      >
        <DialogCloseButton onClick={onClose} />
        <DialogTitle>{t(`${documentType}.share.title`)}</DialogTitle>
        {(hasSharedParent || hasSharedChild) && (
          <div className={styles['share-byemail-onlybylink']}>
            {t(`${documentType}.share.shareByEmail.onlyByLink`, {
              type: t(
                `${documentType}.share.shareByEmail.type.${
                  document.type === 'directory' ? 'folder' : 'file'
                }`
              )
            })}{' '}
            <strong>
              {t(
                `${documentType}.share.shareByEmail.${
                  hasSharedParent ? 'hasSharedParent' : 'hasSharedChild'
                }`
              )}
            </strong>
          </div>
        )}
        <DialogContent className={cx(styles['share-modal-content'])}>
          {documentType !== 'Notes' &&
            documentType !== 'Albums' &&
            !hasSharedParent &&
            !hasSharedChild && (
              <DumbShareByEmail
                currentRecipients={recipients}
                document={document}
                documentType={documentType}
                sharingDesc={sharingDesc}
                contacts={contacts}
                groups={groups}
                createContact={createContact}
                onShare={onShare}
                needsContactsPermission={needsContactsPermission}
                sharing={sharing}
              />
            )}
          {documentType !== 'Albums' && (
            <WhoHasAccess
              className={'u-mt-1 u-mb-1 u-ov-auto'}
              isOwner={isOwner}
              recipients={recipients}
              document={document}
              documentType={documentType}
              onRevoke={onRevoke}
              onRevokeSelf={onRevokeSelf}
            />
          )}
        </DialogContent>
        <Divider />
        <DialogActions>
          <DumbShareByLink
            document={document}
            permissions={permissions}
            documentType={documentType}
            checked={link !== null}
            link={link}
            onEnable={onShareByLink}
            onDisable={onRevokeLink}
            onChangePermissions={onUpdateShareLinkPermissions}
          />
        </DialogActions>
      </Dialog>
    </MuiCozyTheme>
  )
}
export default translate()(ShareModal)
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
  onRevokeLink: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
}
