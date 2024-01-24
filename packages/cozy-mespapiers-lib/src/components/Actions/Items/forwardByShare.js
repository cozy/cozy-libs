import React, { forwardRef } from 'react'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

export const forwardByShare = ({ t, shareFiles }) => {
  const label = t('action.forwardByShare')
  const icon = 'attachment'

  return {
    name: 'forwardByShare',
    label,
    icon,
    disabled: docs => docs.length === 0,
    action: async docs => {
      const docsToShareIds = docs.map(doc => doc._id)
      await shareFiles(docsToShareIds)
    },
    Component:
      // eslint-disable-next-line react/display-name
      forwardRef((props, ref) => {
        return (
          <ActionsMenuItem {...props} ref={ref}>
            <ListItemIcon>
              <Icon icon={icon} />
            </ListItemIcon>
            <ListItemText primary={label} />
          </ActionsMenuItem>
        )
      })
  }
}
