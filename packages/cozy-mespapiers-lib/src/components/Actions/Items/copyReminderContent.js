import copy from 'copy-text-to-clipboard'
import React, { forwardRef } from 'react'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Alerter from 'cozy-ui/transpiled/react/deprecated/Alerter'

import withLocales from '../../../locales/withLocales'

export const copyReminderContent = () => {
  return {
    name: 'copyReminderContent',
    action: async (doc, { client }) => {
      try {
        const reminderContent = await client.stackClient.fetchJSON(
          'GET',
          `/notes/${doc._id}/text`
        )
        const hasCopied = copy(reminderContent)
        if (hasCopied) {
          Alerter.success('action.copyReminderContent.success')
        } else {
          Alerter.error('action.copyReminderContent.error')
        }
      } catch {
        Alerter.error('action.copyReminderContent.error')
      }
    },
    Component: withLocales(
      // eslint-disable-next-line react/display-name
      forwardRef((props, ref) => {
        const { t } = useI18n()

        return (
          <ActionsMenuItem {...props} ref={ref}>
            <ListItemIcon>
              <Icon icon="copy" />
            </ListItemIcon>
            <ListItemText primary={t('action.copyReminderContent.text')} />
          </ActionsMenuItem>
        )
      })
    )
  }
}
