import cx from 'classnames'
import React from 'react'
import { useI18n } from 'twake-i18n'

import List from 'cozy-ui/transpiled/react/List'
import Typography from 'cozy-ui/transpiled/react/Typography'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import MemberRecipient from './Recipient/MemberRecipient'
import ShareDialogTwoStepsConfirmationContainer from './ShareDialogTwoStepsConfirmationContainer'

/**
 * Displays the sharing interface that can be used when ConfirmTrustedRecipientsDialog is in sharing state
 */
const SharingContent = ({ recipientsToBeConfirmed, verifyRecipient }) => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()

  return (
    <>
      <Typography
        variant="body1"
        className={cx(
          'u-mb-half',
          isMobile ? 'u-ph-1 u-mt-1' : 'u-ph-2 u-mt-1-half'
        )}
      >
        {t(`ConfirmRecipientModal.intruction`)}
      </Typography>
      <List className={isMobile ? 'u-mb-half' : 'u-mb-1'}>
        {recipientsToBeConfirmed.map(recipientConfirmationData => {
          return (
            <MemberRecipient
              {...recipientConfirmationData}
              key={`key_r_${recipientConfirmationData.id}`}
              isOwner={false}
              recipientConfirmationData={recipientConfirmationData}
              verifyRecipient={verifyRecipient}
            />
          )
        })}
      </List>
    </>
  )
}

/**
 * Displays the dialog's title that can be used when ConfirmTrustedRecipientsDialog is in sharing state
 */
const SharingTitle = ({ recipientsToBeConfirmed }) => {
  const { t } = useI18n()

  const title = t(`ConfirmRecipientModal.title`, {
    smart_count: recipientsToBeConfirmed.length
  })

  return title
}

const ConfirmTrustedRecipientsDialog = ({ ...props }) => {
  return (
    <ShareDialogTwoStepsConfirmationContainer
      {...props}
      dialogContentOnShare={SharingContent}
      dialogActionsOnShare={null}
      dialogTitleOnShare={SharingTitle}
    />
  )
}

export default ConfirmTrustedRecipientsDialog
