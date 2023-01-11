import React from 'react'
import PropTypes from 'prop-types'
import { useClient, useQuery, hasQueryBeenLoaded } from 'cozy-client'
import Recipient from './Recipient/Recipient'
import LinkRecipient from './Recipient/LinkRecipient'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import List from 'cozy-ui/transpiled/react/MuiCozyTheme/List'
import { buildInstanceSettingsQuery } from '../queries/queries'

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
  const client = useClient()

  const instanceSettingsQuery = buildInstanceSettingsQuery()
  const instanceSettingsResult = useQuery(
    instanceSettingsQuery.definition,
    instanceSettingsQuery.options
  )

  const public_name = instanceSettingsResult?.data?.attributes?.public_name

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
          />
        )}

        {hasQueryBeenLoaded(instanceSettingsResult) && (
          <Recipient
            isOwner={true}
            status="owner"
            instance={client.options.uri}
            public_name={public_name}
          />
        )}

        {recipients
          .filter(recipient => recipient.status !== 'owner')
          .map(recipient => {
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
