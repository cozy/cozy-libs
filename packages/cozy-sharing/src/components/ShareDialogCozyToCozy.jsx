import React from 'react'
import { FixedDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import { default as DumbShareByLink } from './ShareByLink'
import { default as DumbShareByEmail } from './ShareByEmail'
import WhoHasAccess from './WhoHasAccess'

import cx from 'classnames'
import styles from '../share.styl'
const ShareDialogCozyToCozy = ({
  contacts,
  createContact,
  document,
  documentType,
  groups,
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
  showShareByEmail,
  showShareByLink,
  showShareOnlyByLink,
  showWhoHasAccess
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
              contacts={contacts}
              createContact={createContact}
              currentRecipients={recipients}
              document={document}
              documentType={documentType}
              groups={groups}
              needsContactsPermission={needsContactsPermission}
              onShare={onShare}
              sharing={sharing}
              sharingDesc={sharingDesc}
            />
          )}
          {showWhoHasAccess && (
            <WhoHasAccess
              className={'u-mt-1'}
              document={document}
              documentType={documentType}
              isOwner={isOwner}
              onRevoke={onRevoke}
              onRevokeSelf={onRevokeSelf}
              recipients={recipients}
            />
          )}
        </div>
      }
      actions={
        showShareByLink ? (
          <DumbShareByLink
            checked={link !== null}
            document={document}
            documentType={documentType}
            link={link}
            onChangePermissions={onUpdateShareLinkPermissions}
            onDisable={onRevokeLink}
            onEnable={onShareByLink}
            permissions={permissions}
          />
        ) : null
      }
    />
  )
}

export default ShareDialogCozyToCozy
