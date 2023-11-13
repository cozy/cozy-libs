import copy from 'copy-text-to-clipboard'
import React, { forwardRef } from 'react'

import useFetchJSON from 'cozy-client/dist/hooks/useFetchJSON'
import { isMobile } from 'cozy-device-helper'
import log from 'cozy-logger'
import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Alerter from 'cozy-ui/transpiled/react/deprecated/Alerter'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import withLocales from '../../../locales/withLocales'

export const copyReminderContent = () => {
  return {
    name: 'copyReminderContent',
    action: async (doc, { client, noteContent }) => {
      const data = isMobile()
        ? noteContent
        : await client.stackClient.fetchJSON('GET', `/notes/${doc._id}/text`)

      try {
        const hasCopied = copy(data)

        if (hasCopied) {
          Alerter.success('action.copyReminderContent.success')
        } else {
          Alerter.error('action.copyReminderContent.error')
        }
      } catch (error) {
        Alerter.error('action.copyReminderContent.error')
        log(
          'error',
          `Error in 'copyReminderContent' when trying to copy to clipboard: ${error}`
        )
      }
    },
    Component: withLocales(
      // eslint-disable-next-line react/display-name
      forwardRef(({ doc, onClick, ...props }, ref) => {
        const { t } = useI18n()
        const { data } = useFetchJSON('GET', `/notes/${doc._id}/text`)

        return (
          <ActionsMenuItem
            {...props}
            ref={ref}
            onClick={() => onClick({ noteContent: data })}
          >
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
