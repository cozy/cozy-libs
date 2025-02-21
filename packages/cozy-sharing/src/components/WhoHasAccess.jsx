import PropTypes from 'prop-types'
import React from 'react'

import List from 'cozy-ui/transpiled/react/List'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import LinkRecipient from './Recipient/LinkRecipient'
import OwnerRecipient from './Recipient/OwnerRecipient'
import { RecipientList } from './Recipient/RecipientList'
import { usePrevious } from '../helpers/hooks'

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
  className,
  onRevoke,
  onRevokeSelf,
  onSetType,
  verifyRecipient,
  link,
  permissions
}) => {
  const previousLink = usePrevious(link)
  const linkHasBeenJustCreated = link && previousLink === null

  return (
    <div className={className}>
      <RecipientWaitingForConfirmationAlert
        recipientsToBeConfirmed={recipientsToBeConfirmed}
      />
      <List>
        {link && (
          <LinkRecipient
            document={document}
            documentType={documentType}
            onRevoke={onRevoke}
            onRevokeSelf={onRevokeSelf}
            link={link}
            permissions={permissions}
            fadeIn={linkHasBeenJustCreated}
          />
        )}

        <OwnerRecipient recipients={recipients} />

        <RecipientList
          recipients={recipients}
          recipientsToBeConfirmed={recipientsToBeConfirmed}
          isOwner={isOwner}
          document={document}
          documentType={documentType}
          onRevoke={onRevoke}
          onRevokeSelf={onRevokeSelf}
          onSetType={onSetType}
          verifyRecipient={verifyRecipient}
        />
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
