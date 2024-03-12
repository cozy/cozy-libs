import React, { forwardRef } from 'react'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ForbiddenIcon from 'cozy-ui/transpiled/react/Icons/Forbidden'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Typography from 'cozy-ui/transpiled/react/Typography'

const revokeGroup = ({ t, isOwner, handleRevocation }) => {
  const revokeType = isOwner ? 'revoke' : 'revokeSelf'
  const title = t(`RevokeGroupItem.${revokeType}.title`)
  const desc = t(`RevokeGroupItem.${revokeType}.desc`)

  const icon = ForbiddenIcon

  return {
    name: 'revokeMember',
    label: title,
    icon,
    action: () => {
      handleRevocation()
    },
    Component: forwardRef(function RevokeMemberItem(props, ref) {
      return (
        <ActionsMenuItem {...props} ref={ref}>
          <ListItemIcon>
            <Icon icon={icon} color="var(--errorColor)" />
          </ListItemIcon>
          <ListItemText
            primary={<Typography color="error">{title}</Typography>}
            secondary={desc}
          />
        </ActionsMenuItem>
      )
    })
  }
}
export { revokeGroup }
