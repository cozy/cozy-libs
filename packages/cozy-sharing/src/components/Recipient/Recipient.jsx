import React from 'react'
import PropTypes from 'prop-types'

import { useClient } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import ListItem from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

import { getDisplayName } from '../../models'
import RecipientConfirm from './RecipientConfirm'
import RecipientPermissions from './RecipientPermissions'
import RecipientAvatar from './RecipientAvatar'
import RecipientStatus from './RecipientStatus'

import Typography from 'cozy-ui/transpiled/react/Typography'

const DEFAULT_DISPLAY_NAME = 'Share.contacts.defaultDisplayName'

const Recipient = props => {
  const { t } = useI18n()
  const client = useClient()

  const {
    instance,
    isOwner,
    status,
    recipientConfirmationData,
    verifyRecipient,
    ...rest
  } = props

  const isMe =
    (isOwner && status === 'owner') || instance === client.options.uri
  const defaultDisplayName = t(DEFAULT_DISPLAY_NAME)
  const name = getDisplayName(rest, defaultDisplayName)

  const RightPart = recipientConfirmationData ? (
    <RecipientConfirm
      recipientConfirmationData={recipientConfirmationData}
      verifyRecipient={verifyRecipient}
    ></RecipientConfirm>
  ) : (
    <RecipientPermissions {...props} className="u-flex-shrink-0" />
  )

  return (
    <ListItem disableGutters>
      <ListItemIcon>
        <RecipientAvatar size="small" recipient={props} />
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography className="u-ellipsis" variant="body1">
            {isMe ? t('Share.recipients.you') : name}
          </Typography>
        }
        secondary={
          <RecipientStatus status={status} isMe={isMe} instance={instance} />
        }
      />
      {RightPart}
    </ListItem>
  )
}

Recipient.propTypes = {
  instance: PropTypes.string,
  isOwner: PropTypes.bool,
  status: PropTypes.string,
  recipientConfirmationData: PropTypes.object,
  verifyRecipient: PropTypes.func
}

export default Recipient
