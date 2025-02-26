import React, { forwardRef } from 'react'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import TrashIcon from 'cozy-ui/transpiled/react/Icons/Trash'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Typography from 'cozy-ui/transpiled/react/Typography'

const makeComponent = title => {
  const Component = forwardRef((props, ref) => {
    return (
      <ActionsMenuItem {...props} ref={ref}>
        <ListItemIcon>
          <Icon icon={TrashIcon} color="var(--errorColor)" />
        </ListItemIcon>
        <ListItemText
          primary={<Typography color="error">{title}</Typography>}
        />
      </ActionsMenuItem>
    )
  })

  Component.displayName = 'RevokeSharedDriveMember'

  return Component
}

const revokeSharedDriveMember = ({ t, handleRevocation }) => {
  const title = t(`RevokeSharedDriveMemberItem.revoke.title`)

  return {
    name: 'revokeSharedDriveMember',
    label: title,
    action: () => {
      handleRevocation()
    },
    Component: makeComponent(title)
  }
}
export { revokeSharedDriveMember }
