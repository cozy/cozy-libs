import React, { forwardRef } from 'react'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

import withLocales from '../../../locales/withLocales'
import DeleteConfirm from '../DeleteConfirm'

export const trash = ({ t, pushComponent, popComponent }) => {
  const label = t('action.trash')
  const icon = 'trash'

  return {
    name: 'trash',
    label,
    icon,
    disabled: docs => docs.length === 0,
    action: (docs, { isLast }) =>
      pushComponent(
        <DeleteConfirm files={docs} isLast={isLast} onClose={popComponent} />
      ),
    Component: withLocales(
      // eslint-disable-next-line react/display-name
      forwardRef((props, ref) => {
        return (
          <ActionsMenuItem {...props} ref={ref}>
            <ListItemIcon>
              <Icon icon={icon} color="var(--errorColor)" />
            </ListItemIcon>
            <ListItemText
              primary={label}
              primaryTypographyProps={{ color: 'error' }}
            />
          </ActionsMenuItem>
        )
      })
    )
  }
}
