import React from 'react'

import Avatar from 'cozy-ui/transpiled/react/Avatar'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ToTheCloudIcon from 'cozy-ui/transpiled/react/Icons/ToTheCloud'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { getInitials, getDisplayName } from '../../models'

const GroupRecipientDetailWithAccess = ({ withAccess }) => {
  const { t } = useI18n()

  return (
    <div>
      <Typography variant="subtitle2">
        {t('GroupRecipientDetail.withAccess.title')}
      </Typography>
      <List>
        {withAccess.map(recipient => {
          const name = getDisplayName(recipient)

          return (
            <ListItem disableGutters key={recipient.index}>
              <ListItemIcon>
                <Avatar text={getInitials(recipient)} textId={name} />
              </ListItemIcon>
              <ListItemText
                primary={name}
                secondary={
                  recipient.instance ? (
                    <div className="u-flex u-flex-items-center">
                      <Icon
                        icon={ToTheCloudIcon}
                        size={10}
                        style={{
                          marginRight: '0.25rem'
                        }}
                      />
                      {recipient.instance}
                    </div>
                  ) : null
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
