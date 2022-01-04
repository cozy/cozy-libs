import React from 'react'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import cx from 'classnames'
import { default as DumbShareByLink } from './ShareByLink'
import { default as DumbShareByEmail } from './ShareByEmail'
import WhoHasAccess from './WhoHasAccess'

import styles from '../share.styl'

import ShareDialogTwoStepsConfirmationContainer from './ShareDialogTwoStepsConfirmationContainer'

/**
 * Displays the sharing interface that can be used when ShareDialogCozyToCozy is in sharing state
 */
const SharingContent = ({
  contacts,
  createContact,
  document,
  documentType,
  groups,
  hasSharedParent,
  isOwner,
  needsContactsPermission,
  onRevoke,
  onRevokeSelf,
  onShare,
  recipients,
  sharing,
  sharingDesc,
  showShareByEmail,
  showShareOnlyByLink,
  showWhoHasAccess,
  recipientsToBeConfirmed,
  verifyRecipient
}) => {
  const { t } = useI18n()

  return (
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
          className="u-mt-1"
          document={document}
          documentType={documentType}
          isOwner={isOwner}
          onRevoke={onRevoke}
          onRevokeSelf={onRevokeSelf}
          recipients={recipients}
          recipientsToBeConfirmed={recipientsToBeConfirmed}
          verifyRecipient={verifyRecipient}
        />
      )}
    </div>
  )
}

/**
 * Displays the dialog's title that can be used when ShareDialogCozyToCozy is in sharing state
 */
const SharingTitleFunction = ({ documentType, document }) =>
  function SharingTitle() {
    const { t } = useI18n()

    const title = t(`${documentType}.share.title`, {
      name: document.name || document.attributes?.name
    })

    return title
  }

/**
 * Displays a sharing dialog that allows to share a document between multiple Cozy users
 */
const ShareDialogCozyToCozy = ({
  showShareByLink,
  documentType,
  document,
  ...props
}) => (
  <ShareDialogTwoStepsConfirmationContainer
    {...props}
    documentType={documentType}
    document={document}
    dialogContentOnShare={SharingContent}
    dialogActionsOnShare={showShareByLink ? DumbShareByLink : null}
    dialogTitleOnShare={SharingTitleFunction({ documentType, document })}
  />
)

export default ShareDialogCozyToCozy
