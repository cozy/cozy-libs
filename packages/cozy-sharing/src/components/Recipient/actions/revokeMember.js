import React, { forwardRef } from 'react'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import TrashIcon from 'cozy-ui/transpiled/react/Icons/Trash'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Typography from 'cozy-ui/transpiled/react/Typography'

const revokeMember = ({ t, isOwner, isSharedDrive, handleRevocation }) => {
  const revokeType = isOwner ? 'revoke' : 'revokeSelf'
  const title = t(`RevokeMemberItem.${revokeType}.title`)
  const desc =
    isOwner && isSharedDrive
      ? t(`RevokeMemberItem.revoke.sharedDriveDesc`)
      : t(`RevokeMemberItem.${revokeType}.desc`)

  const icon = TrashIcon

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
export { revokeMember }
