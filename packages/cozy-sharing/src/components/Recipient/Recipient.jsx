import PropTypes from 'prop-types'
import React from 'react'

import { useClient } from 'cozy-client'
import Fade from 'cozy-ui/transpiled/react/Fade'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Typography from 'cozy-ui/transpiled/react/Typography'

import RecipientAvatar from './RecipientAvatar'
import RecipientConfirm from './RecipientConfirm'
import RecipientPermissions from './RecipientPermissions'
import RecipientStatus from './RecipientStatus'
import { FADE_IN_DURATION } from '../../helpers/recipients'
import { getDisplayName } from '../../models'

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
    fadeIn,
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
    <Fade in timeout={fadeIn ? FADE_IN_DURATION : 0}>
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
    </Fade>
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
