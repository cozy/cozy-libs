import PropTypes from 'prop-types'
import React from 'react'

import List from 'cozy-ui/transpiled/react/List'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import LinkRecipient from './Recipient/LinkRecipient'
import OwnerRecipient from './Recipient/OwnerRecipient'
import Recipient from './Recipient/Recipient'
import { usePrevious } from '../helpers/hooks'
import { filterAndReworkRecipients } from '../helpers/recipients'

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
  recipientsToBeConfirmed = [],
  document,
  documentType,
  onRevoke,
  className,
  onRevokeSelf,
  verifyRecipient,
  link,
  permissions,
  onUpdateShareLinkPermissions,
  onRevokeLink
}) => {
  const previousLink = usePrevious(link)
  const previousRecipients = usePrevious(recipients)

  const linkHasBeenJustCreated = link && previousLink === null

  const recipientsToDisplay = filterAndReworkRecipients(
    recipients,
    previousRecipients
  )

  return (
    <div className={className}>
      <RecipientWaitingForConfirmationAlert
        recipientsToBeConfirmed={recipientsToBeConfirmed}
      />
      <List disablePadding>
        {link && (
          <LinkRecipient
            document={document}
            documentType={documentType}
            onRevoke={onRevoke}
            onRevokeSelf={onRevokeSelf}
            link={link}
            permissions={permissions}
            onChangePermissions={onUpdateShareLinkPermissions}
            onDisable={onRevokeLink}
            fadeIn={linkHasBeenJustCreated}
          />
        )}

        <OwnerRecipient recipients={recipients} />

        {recipientsToDisplay.map(recipient => {
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
              verifyRecipient={verifyRecipient}
              fadeIn={recipient.hasBeenJustAdded}
            />
          )
        })}
      </List>
    </div>
  )
}

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
  verifyRecipient: PropTypes.func
}
export default WhoHasAccess
