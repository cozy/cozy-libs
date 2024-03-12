import React from 'react'

import { useClient } from 'cozy-client'
import Fade from 'cozy-ui/transpiled/react/Fade'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/ListItemSecondaryAction'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { GroupRecipientPermissions } from './GroupRecipientPermissions'
import { FADE_IN_DURATION } from '../../helpers/recipients'
import { GroupAvatar } from '../Avatar/GroupAvatar'

const GroupRecipient = props => {
  const { name, members, fadeIn } = props
  const { t } = useI18n()
  const client = useClient()

  const nbMember = members.length
  const nbMemberReady = members.filter(
    member => !['revoked', 'mail-not-sent'].includes(member.status)
  ).length
  const isCurrentInstanceInsideMembers = members.some(
    member => member.instance === client.options.uri
  )

  return (
    <Fade in timeout={fadeIn ? FADE_IN_DURATION : 0}>
      <ListItem disableGutters>
        <ListItemIcon>
          <GroupAvatar size="small" />
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography className="u-ellipsis" variant="body1">
              {name}
            </Typography>
          }
          secondary={
            t('GroupRecipient.secondary', { nbMember, nbMemberReady }) +
            (isCurrentInstanceInsideMembers
              ? ` (${t('GroupRecipient.secondary_you')})`
              : '')
          }
        />
        <ListItemSecondaryAction>
          <GroupRecipientPermissions {...props} />
        </ListItemSecondaryAction>
      </ListItem>
    </Fade>
  )
}

export { GroupRecipient }
