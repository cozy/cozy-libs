import PropTypes from 'prop-types'
import React from 'react'

import { useClient } from 'cozy-client'
import Fade from 'cozy-ui/transpiled/react/Fade'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Typography from 'cozy-ui/transpiled/react/Typography'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import MemberRecipientPermissions from './MemberRecipientPermissions'
import MemberRecipientStatus from './MemberRecipientStatus'
import RecipientConfirm from './RecipientConfirm'
import {
  FADE_IN_DURATION,
  DEFAULT_DISPLAY_NAME
} from '../../helpers/recipients'
import { getDisplayName } from '../../models'
import { MemberAvatar } from '../Avatar/MemberAvatar'

const MemberRecipient = props => {
  const { t } = useI18n()
  const client = useClient()
  const { isMobile } = useBreakpoints()

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
    />
  ) : (
    <MemberRecipientPermissions {...props} className="u-flex-shrink-0" />
  )

  return (
    <Fade in timeout={fadeIn ? FADE_IN_DURATION : 0}>
      <ListItem gutters={isMobile ? 'default' : 'double'} size="small">
        <ListItemIcon>
          <MemberAvatar size="small" recipient={props} />
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography variant="body1">
              {isMe ? t('Share.recipients.you') : name}
            </Typography>
          }
          secondary={
            <MemberRecipientStatus
              status={status}
              isMe={isMe}
              instance={instance}
            />
          }
        />
        {RightPart}
      </ListItem>
    </Fade>
  )
}

MemberRecipient.propTypes = {
  instance: PropTypes.string,
  isOwner: PropTypes.bool,
  status: PropTypes.string,
  recipientConfirmationData: PropTypes.object,
  verifyRecipient: PropTypes.func
}

export default MemberRecipient
