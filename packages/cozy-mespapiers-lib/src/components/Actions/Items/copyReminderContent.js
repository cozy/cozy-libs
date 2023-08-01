import copy from 'copy-text-to-clipboard'
import React, { useRef } from 'react'

import useFetchJSON from 'cozy-client/dist/hooks/useFetchJSON'
import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Alerter from 'cozy-ui/transpiled/react/deprecated/Alerter'
import useEventListener from 'cozy-ui/transpiled/react/hooks/useEventListener'

import withLocales from '../../../locales/withLocales'

export const copyReminderContent = () => {
  return {
    name: 'copyReminderContent',
    Component: withLocales(({ doc, ...props }) => {
      const { t } = useI18n()
      const elRef = useRef()
      const { data } = useFetchJSON('GET', `/notes/${doc._id}/text`)

      useEventListener(elRef.current, 'click', () => {
        const hasCopied = copy(data)

        if (hasCopied) {
          Alerter.success('action.copyReminderContent.success')
        } else {
          Alerter.error('action.copyReminderContent.error')
        }
      })

      return (
        <ActionsMenuItem {...props} ref={elRef}>
          <ListItemIcon>
            <Icon icon="copy" />
          </ListItemIcon>
          <ListItemText primary={t('action.copyReminderContent.text')} />
        </ActionsMenuItem>
      )
    })
  }
}
