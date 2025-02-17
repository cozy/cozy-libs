import cx from 'classnames'
import React from 'react'

import Typography from 'cozy-ui/transpiled/react/Typography'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { default as DumbShareByEmail } from './ShareByEmail'
import { default as DumbShareByLink } from './ShareByLink'
import ShareDialogTwoStepsConfirmationContainer from './ShareDialogTwoStepsConfirmationContainer'
import WhoHasAccess from './WhoHasAccess'
import styles from '../styles/share.styl'

/**
 * Displays the sharing interface that can be used when ShareDialogCozyToCozy is in sharing state
 */
const SharingContent = ({
  createContact,
  document,
  documentType,
  hasSharedParent,
  isOwner,
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
  verifyRecipient,
  link,
  permissions
}) => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()

  return (
    <div className={cx(styles['share-modal-content'])}>
      <div className={cx('u-pt-1-half', isMobile ? 'u-ph-1' : 'u-ph-2')}>
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
        <Typography variant="h6" className="u-mb-1-half">
          {t('Share.contacts.whoHasAccess')}
        </Typography>
        {showShareByEmail && (
          <DumbShareByEmail
            createContact={createContact}
            currentRecipients={recipients}
            document={document}
            documentType={documentType}
            onShare={onShare}
            sharing={sharing}
            sharingDesc={sharingDesc}
          />
        )}
      </div>
      {showWhoHasAccess && (
        <WhoHasAccess
          document={document}
          documentType={documentType}
          isOwner={isOwner}
          onRevoke={onRevoke}
          onRevokeSelf={onRevokeSelf}
          recipients={recipients}
          recipientsToBeConfirmed={recipientsToBeConfirmed}
          verifyRecipient={verifyRecipient}
          link={link}
          permissions={permissions}
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
}) => {
  return (
    <ShareDialogTwoStepsConfirmationContainer
      {...props}
      documentType={documentType}
      document={document}
      dialogContentOnShare={SharingContent}
      dialogActionsOnShare={showShareByLink ? DumbShareByLink : null}
      dialogTitleOnShare={SharingTitleFunction({ documentType, document })}
      disableGutters
    />
  )
}

export default ShareDialogCozyToCozy
