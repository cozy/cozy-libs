import React from 'react'
import { useI18n } from 'twake-i18n'

import { useClient } from 'cozy-client'
import Avatar from 'cozy-ui/transpiled/react/Avatar'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Typography from 'cozy-ui/transpiled/react/Typography'

import MemberRecipientStatus from './MemberRecipientStatus'
import { getInitials, getDisplayName } from '../../models'

const GroupRecipientDetailWithAccess = ({ withAccess }) => {
  const { t } = useI18n()
  const client = useClient()

  return (
    <div>
      <Typography variant="subtitle2">
        {t('GroupRecipientDetail.withAccess.title')}
      </Typography>
      <List>
        {withAccess.map(recipient => {
          const name = getDisplayName(recipient)
          const isMe = recipient.instance === client.options.uri

          return (
            <ListItem disableGutters key={recipient.index} size="small">
              <ListItemIcon>
                <Avatar size="m">{getInitials(recipient)}</Avatar>
              </ListItemIcon>
              <ListItemText
                primary={name}
                secondary={
                  <MemberRecipientStatus
                    status={recipient.status}
                    isMe={isMe}
                    instance={recipient.instance}
                  />
                }
              />
            </ListItem>
          )
        })}
      </List>
    </div>
  )
}

export { GroupRecipientDetailWithAccess }
