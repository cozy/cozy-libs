import React from 'react'
import { FixedDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import { default as DumbShareByLink } from './ShareByLink'
import { default as DumbShareByEmail } from './ShareByEmail'
import WhoHasAccess from './WhoHasAccess'

import cx from 'classnames'
import styles from '../share.styl'
const ShareDialogCozyToCozy = ({
  onClose,
  documentType,
  document,
  permissions,
  link,
  onShareByLink,
  onRevokeLink,
  onUpdateShareLinkPermissions,
  showShareOnlyByLink,
  showShareByEmail,
  hasSharedParent,
  recipients,
  sharingDesc,
  contacts,
  groups,
  createContact,
  onShare,
  needsContactsPermission,
  sharing,
  showWhoHasAccess,
  isOwner,
  onRevoke,
  onRevokeSelf
}) => {
  const { t } = useI18n()
  return (
    <FixedDialog
      disableEnforceFocus
      open={true}
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
  )
}

export default ShareDialogCozyToCozy
