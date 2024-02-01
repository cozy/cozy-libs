import React, { forwardRef } from 'react'

import useFetchJSON from 'cozy-client/dist/hooks/useFetchJSON'
import { isMobile } from 'cozy-device-helper'
import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { copyToClipboard } from '../../../helpers/copyToClipboard'
import withLocales from '../../../locales/withLocales'

export const copyReminderContent = () => {
  return {
    name: 'copyReminderContent',
    action: async (docs, { client, noteContent, t, showAlert }) => {
      const data = isMobile()
        ? noteContent
        : await client.stackClient.fetchJSON(
            'GET',
            `/notes/${docs[0]._id}/text`
          )

      await copyToClipboard(data, { t, showAlert })
    },
    Component: withLocales(
      // eslint-disable-next-line react/display-name
      forwardRef(({ docs, onClick, ...props }, ref) => {
        const { t } = useI18n()
        const { data } = useFetchJSON('GET', `/notes/${docs[0]._id}/text`)

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
