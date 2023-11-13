import React, { forwardRef } from 'react'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import withLocales from '../../../locales/withLocales'

export const rename = () => {
  return {
    name: 'rename',
    action: (doc, { setIsRenaming }) => {
      setIsRenaming(true)
    },
    Component: withLocales(
      // eslint-disable-next-line react/display-name
      forwardRef((props, ref) => {
        const { t } = useI18n()

        return (
          <ActionsMenuItem {...props} ref={ref}>
            <ListItemIcon>
              <Icon icon="rename" />
            </ListItemIcon>
            <ListItemText primary={t('action.rename')} />
          </ActionsMenuItem>
        )
      })
    )
  }
}
