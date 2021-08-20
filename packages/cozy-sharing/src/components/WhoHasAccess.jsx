import React from 'react'
import PropTypes from 'prop-types'
import Recipient from './Recipient'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

/**
 * Displays a warning if some contacts are waiting for confirmation of their sharing
 *
 * This may happen in two steps confirmation scenario like when sharing passwords
 */
const RecipientWaitingForConfirmationAlert = ({ recipientsToBeConfirmed }) => {
  const { t } = useI18n()

  if (recipientsToBeConfirmed.length > 0) {
    return t(`Share.twoStepsConfirmation.contactAreWaitingForConfirmation`, {
      smart_count: recipientsToBeConfirmed.length
    })
  }

  return null
}

const WhoHasAccess = ({
  isOwner = false,
  recipients,
  recipientsToBeConfirmed,
  document,
  documentType,
  onRevoke,
  className,
  onRevokeSelf,
  rejectRecipient,
  confirmRecipient
}) => (
  <div className={className}>
    <RecipientWaitingForConfirmationAlert
      recipientsToBeConfirmed={recipientsToBeConfirmed}
    />

    {recipients.map(recipient => {
      const recipientConfirmationData = recipientsToBeConfirmed.find(
        user => user.email === recipient.email
      )

      return (
        <Recipient
          {...recipient}
          key={`key_r_${recipient.index}`}
          isOwner={isOwner}
          document={document}
          documentType={documentType}
          onRevoke={onRevoke}
          onRevokeSelf={onRevokeSelf}
          recipientConfirmationData={recipientConfirmationData}
          rejectRecipient={rejectRecipient}
          confirmRecipient={confirmRecipient}
        />
      )
    })}
  </div>
)

WhoHasAccess.propTypes = {
  isOwner: PropTypes.bool,
  recipients: PropTypes.array.isRequired,
  recipientsToBeConfirmed: PropTypes.arrayOf(
    PropTypes.shape({
      email: PropTypes.string.isRequired
    })
  ),
  document: PropTypes.object.isRequired,
  documentType: PropTypes.string.isRequired,
  onRevoke: PropTypes.func.isRequired,
  onRevokeSelf: PropTypes.func,
  confirmRecipient: PropTypes.func,
  rejectRecipient: PropTypes.func
}
export default WhoHasAccess
