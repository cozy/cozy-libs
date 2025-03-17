import PropTypes from 'prop-types'
import React from 'react'

import Fade from 'cozy-ui/transpiled/react/Fade'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Typography from 'cozy-ui/transpiled/react/Typography'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import SharedDriveRecipientPermissions from './SharedDriveRecipientPermissions'
import SharedDriveRecipientStatus from './SharedDriveRecipientStatus'
import {
  FADE_IN_DURATION,
  DEFAULT_DISPLAY_NAME
} from '../../helpers/recipients'
import { getDisplayName } from '../../models'
import { GroupAvatar } from '../Avatar/GroupAvatar'
import { MemberAvatar } from '../Avatar/MemberAvatar'

const SharedDriveRecipient = props => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()

  const { fadeIn, members, ...rest } = props

  const defaultDisplayName = t(DEFAULT_DISPLAY_NAME)
  const name = getDisplayName(rest, defaultDisplayName)

  return (
    <Fade in timeout={fadeIn ? FADE_IN_DURATION : 0}>
      <ListItem gutters={isMobile ? 'default' : 'double'} size="small">
        <ListItemIcon>
          {members ? (
            <GroupAvatar size="m" />
          ) : (
            <MemberAvatar size="m" recipient={props} />
          )}
        </ListItemIcon>
        <ListItemText
          primary={<Typography variant="body1">{name}</Typography>}
          secondary={<SharedDriveRecipientStatus {...props} />}
        />
        <SharedDriveRecipientPermissions
          {...props}
          className="u-flex-shrink-0"
        />
      </ListItem>
    </Fade>
  )
}

SharedDriveRecipient.propTypes = {
  instance: PropTypes.string,
  isOwner: PropTypes.bool,
  status: PropTypes.string,
  recipientConfirmationData: PropTypes.object,
  verifyRecipient: PropTypes.func
}

export default SharedDriveRecipient
