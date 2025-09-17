import React from 'react'

import { GroupRecipient } from './GroupRecipient'
import MemberRecipient from './MemberRecipient'
import { usePrevious } from '../../helpers/hooks'
import { filterAndReworkRecipients } from '../../helpers/recipients'
import SharedDriveRecipient from '../SharedDrive/SharedDriveRecipient'

const RecipientList = ({
  recipients,
  recipientsToBeConfirmed,
  isOwner,
  isSharedDrive,
  document,
  documentType,
  onRevoke,
  onRevokeSelf,
  onSetType,
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

    const isSharedDriveRecipient = recipient?.index
      ?.toString()
      .startsWith('virtual-shared-drive')

    if (isSharedDriveRecipient) {
      return (
        <SharedDriveRecipient
          {...recipient}
          key={recipient.index}
          onRevoke={onRevoke}
          onSetType={onSetType}
          fadeIn={recipient.hasBeenJustAdded}
        />
      )
    }

    const isGroupRecipient = recipient.members
    if (isGroupRecipient) {
      return (
        <GroupRecipient
          {...recipient}
          isOwner={isOwner}
          key={recipient.index}
          document={document}
          documentType={documentType}
          onRevoke={onRevoke}
          onRevokeSelf={onRevokeSelf}
          fadeIn={recipient.hasBeenJustAdded}
        />
      )
    }

    return (
      <MemberRecipient
        {...recipient}
        key={recipient.index}
        isOwner={isOwner}
        isSharedDrive={isSharedDrive}
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
