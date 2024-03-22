import React from 'react'

import Avatar from 'cozy-ui/transpiled/react/Avatar'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ForbiddenIcon from 'cozy-ui/transpiled/react/Icons/Forbidden'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { getInitials, getDisplayName } from '../../models'

const GroupRecipientDetailWithoutAccess = ({ withoutAccess }) => {
  const { t } = useI18n()

  return (
    <div>
      <Typography variant="subtitle2">
        {t('GroupRecipientDetail.withoutAccess.title')}
      </Typography>
      <List>
        {withoutAccess.map(recipient => {
          const icon = recipient.status === 'revoked' ? ForbiddenIcon : null
          const name = getDisplayName(recipient)

          return (
            <ListItem disableGutters key={recipient.index}>
              <ListItemIcon>
                <Avatar text={getInitials(recipient)} textId={name} />
              </ListItemIcon>
              <ListItemText
                primary={name}
                secondary={
                  <div className="u-flex u-flex-items-center">
                    {icon ? (
                      <Icon
                        icon={icon}
                        size={10}
                        style={{
                          marginRight: '0.25rem'
                        }}
                      />
                    ) : null}
                    {t(
                      `GroupRecipientDetail.withoutAccess.status.${recipient.status}`
                    )}
                  </div>
                }
              />
            </ListItem>
          )
        })}
      </List>
    </div>
  )
}

export { GroupRecipientDetailWithoutAccess }
