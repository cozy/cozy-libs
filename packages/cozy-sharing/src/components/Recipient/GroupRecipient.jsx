import React, { useState } from 'react'

import { useClient } from 'cozy-client'
import Fade from 'cozy-ui/transpiled/react/Fade'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/ListItemSecondaryAction'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { GroupRecipientDetail } from './GroupRecipientDetail'
import { GroupRecipientPermissions } from './GroupRecipientPermissions'
import { FADE_IN_DURATION } from '../../helpers/recipients'
import { GroupAvatar } from '../Avatar/GroupAvatar'

const GroupRecipient = props => {
  const { name, members, fadeIn, owner } = props
  const { t } = useI18n()
  const client = useClient()

  const [isDetailOpened, setDetailOpened] = useState(false)

  const nbMember = members.length
  const nbMemberReady = members.filter(
    member => !['revoked', 'mail-not-sent'].includes(member.status)
  ).length
  const isCurrentInstanceInsideMembers = members.some(
    member => member.instance === client.options.uri
  )

  const toogleDetailOpened = () => {
    setDetailOpened(!isDetailOpened)
  }

  const closeDetail = () => {
    setDetailOpened(false)
  }

  return (
    <>
      <Fade in timeout={fadeIn ? FADE_IN_DURATION : 0}>
        <ListItem disableGutters button onClick={toogleDetailOpened}>
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
      {isDetailOpened ? (
        <GroupRecipientDetail
          owner={owner}
          name={name}
          members={members}
          onClose={closeDetail}
        />
      ) : null}
    </>
  )
}

export { GroupRecipient }
