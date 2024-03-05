import React from 'react'

import MemberRecipient from './MemberRecipient'
import { usePrevious } from '../../helpers/hooks'
import { filterAndReworkRecipients } from '../../helpers/recipients'

const RecipientList = ({
  recipients,
  recipientsToBeConfirmed,
  isOwner,
  document,
  documentType,
  onRevoke,
  onRevokeSelf,
  verifyRecipient
}) => {
  const previousRecipients = usePrevious(recipients)
  const recipientsToDisplay = filterAndReworkRecipients(
    recipients,
    previousRecipients
  )

  return recipientsToDisplay.map(recipient => {
    const recipientConfirmationData = recipientsToBeConfirmed.find(
      user => user.email === recipient.email
    )

    return (
      <MemberRecipient
        {...recipient}
        key={`key_r_${recipient.index}`}
        isOwner={isOwner}
        document={document}
        documentType={documentType}
        onRevoke={onRevoke}
        onRevokeSelf={onRevokeSelf}
        recipientConfirmationData={recipientConfirmationData}
        verifyRecipient={verifyRecipient}
        fadeIn={recipient.hasBeenJustAdded}
      />
    )
  })
}

export { RecipientList }
