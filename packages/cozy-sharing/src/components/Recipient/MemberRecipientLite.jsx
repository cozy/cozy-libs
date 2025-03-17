import PropTypes from 'prop-types'
import React from 'react'

import { useClient } from 'cozy-client'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import MemberRecipientStatus from './MemberRecipientStatus'
import { DEFAULT_DISPLAY_NAME } from '../../helpers/recipients'
import withLocales from '../../hoc/withLocales'
import { getDisplayName } from '../../models'
import { MemberAvatar } from '../Avatar/MemberAvatar'

const MemberRecipientLite = ({ recipient, isOwner, ...props }) => {
  const { t } = useI18n()
  const client = useClient()

  const recipientOwner = recipient.status === 'owner'
  const isMe =
    (isOwner && recipientOwner) || recipient.instance === client.options.uri

  return (
    <ListItem size="small" ellipsis>
      <ListItemIcon>
        <MemberAvatar size="m" recipient={recipient} {...props} />
      </ListItemIcon>
      <ListItemText
        primary={
          isMe
            ? t('Share.recipients.you')
            : getDisplayName(recipient, t(DEFAULT_DISPLAY_NAME))
        }
        secondary={
          <MemberRecipientStatus
            status={recipient.status}
            isMe={isMe}
            instance={recipient.instance}
            typographyProps={{ noWrap: true }}
          />
        }
      />
      <Typography className="u-flex-shrink-0" variant="body2">
        {recipientOwner
          ? t(`Share.status.${recipient.status}`).toLowerCase()
          : t(`Share.type.${recipient.type ?? 'one-way'}`).toLowerCase()}
      </Typography>
    </ListItem>
  )
}

MemberRecipientLite.propTypes = {
  recipient: PropTypes.object,
  isOwner: PropTypes.bool
}

export default withLocales(MemberRecipientLite)
