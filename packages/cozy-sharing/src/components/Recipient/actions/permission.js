import React, { forwardRef } from 'react'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import EyeIcon from 'cozy-ui/transpiled/react/Icons/Eye'
import RenameIcon from 'cozy-ui/transpiled/react/Icons/Rename'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

const permission = ({ t, type }) => {
  const title = t(`Share.type.${type}`)
  const icon = type === 'two-way' ? RenameIcon : EyeIcon

  return {
    name: 'permission',
    label: title,
    icon,
    action: null,
    Component: forwardRef(function RevokeItem(props, ref) {
      return (
        <ActionsMenuItem {...props} ref={ref} button={false}>
          <ListItemIcon>
            <Icon icon={icon} />
          </ListItemIcon>
          <ListItemText primary={title} />
        </ActionsMenuItem>
      )
    })
  }
}
export { permission }
