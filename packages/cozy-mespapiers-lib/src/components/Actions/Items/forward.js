import React, { forwardRef } from 'react'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import withLocales from '../../../locales/withLocales'
import { forwardFile } from '../utils'

export const forward = () => {
  return {
    name: 'forward',
    action: (doc, { t, client }) => forwardFile(client, [doc], t),
    Component: withLocales(
      // eslint-disable-next-line react/display-name
      forwardRef((props, ref) => {
        const { t } = useI18n()

        return (
          <ActionsMenuItem {...props} ref={ref}>
            <ListItemIcon>
              <Icon icon="paperplane" />
            </ListItemIcon>
            <ListItemText primary={t('action.forward')} />
          </ActionsMenuItem>
        )
      })
    )
  }
}
