import React, { forwardRef } from 'react'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import ListItemIcon from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon'

import withLocales from '../../../locales/withLocales'

export const rename = ({ setPaperBeingRenamedId }) => {
  return {
    name: 'renameWithOwnAction',
    action: doc => {
      setPaperBeingRenamedId(doc._id)
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
