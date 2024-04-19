import React, { forwardRef } from 'react'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

import withLocales from '../../../locales/withLocales'
import { downloadFiles } from '../utils'

export const download = ({ t, showAlert }) => {
  const label = t('action.download')
  const icon = 'download'

  return {
    name: 'download',
    label,
    icon,
    disabled: docs => docs.length === 0,
    action: (docs, { client }) =>
      downloadFiles({ client, files: docs, showAlert, t }),
    Component: withLocales(
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
    )
  }
}
