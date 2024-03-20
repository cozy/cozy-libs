import React, { forwardRef } from 'react'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Radios from 'cozy-ui/transpiled/react/Radios'

const permission = ({ t, type }) => {
  const title = t(`Share.type.${type}`)

  return {
    name: 'permission',
    label: title,
    icon: null,
    action: null,
    Component: forwardRef(function RevokeItem(props, ref) {
      return (
        <ActionsMenuItem {...props} ref={ref} button={false}>
          <ListItemIcon>
            <Radios checked={true} />
          </ListItemIcon>
          <ListItemText primary={title} />
        </ActionsMenuItem>
      )
    })
  }
}
export { permission }
