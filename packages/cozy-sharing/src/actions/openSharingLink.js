import React, { forwardRef } from 'react'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

import { getIconWithlabel, openExternalLink } from '../helpers/sharings'

const makeComponent = (label, icon) => {
  const Component = forwardRef((props, ref) => {
    return (
      <ActionsMenuItem {...props} ref={ref}>
        <ListItemIcon>
          <Icon icon={icon} />
        </ListItemIcon>
        <ListItemText primary={label} />
      </ActionsMenuItem>
    )
  })
  Component.displayName = 'OpenSharingLink'

  return Component
}

export const openSharingLink = ({ t, isSharingShortcutCreated, link }) => {
  const { icon, label } = getIconWithlabel({
    link,
    isSharingShortcutCreated,
    t
  })

  return {
    name: 'openSharingLink',
    label,
    icon,
    action: () => {
      openExternalLink(link)
    },
    Component: makeComponent(label, icon)
  }
}
