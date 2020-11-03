import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { FixedDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
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
  sharing
}) => {
  const { t } = useI18n()

  const showShareByEmail =
    documentType !== 'Notes' &&
    documentType !== 'Albums' &&
    !hasSharedParent &&
    !hasSharedChild
  const showShareOnlyByLink = hasSharedParent || hasSharedChild
  const showWhoHasAccess = documentType !== 'Albums'

  return (
    <MuiCozyTheme>
      <FixedDialog
        opened={true}
        onClose={onClose}
        title={t(`${documentType}.share.title`, { name: document.name })}
        content={
          <div className={cx(styles['share-modal-content'])}>
            {showShareOnlyByLink && (
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
            {showShareByEmail && (
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
            {showWhoHasAccess && (
              <WhoHasAccess
                className={'u-mt-1'}
                isOwner={isOwner}
                recipients={recipients}
                document={document}
                documentType={documentType}
                onRevoke={onRevoke}
                onRevokeSelf={onRevokeSelf}
              />
            )}
          </div>
        }
        actions={
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
        }
      />
    </MuiCozyTheme>
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
