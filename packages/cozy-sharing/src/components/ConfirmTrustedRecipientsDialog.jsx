import React from 'react'

import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import MemberRecipient from './Recipient/MemberRecipient'
import ShareDialogTwoStepsConfirmationContainer from './ShareDialogTwoStepsConfirmationContainer'

/**
 * Displays the sharing interface that can be used when ConfirmTrustedRecipientsDialog is in sharing state
 */
const SharingContent = ({ recipientsToBeConfirmed, verifyRecipient }) => {
  const { t } = useI18n()

  return (
    <>
      <Typography variant="body1" className="u-mb-2">
        {t(`ConfirmRecipientModal.intruction`)}
      </Typography>

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
