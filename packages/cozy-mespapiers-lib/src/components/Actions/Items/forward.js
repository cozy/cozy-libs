import React from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import withLocales from '../../../locales/withLocales'
import ActionMenuItemWrapper from '../ActionMenuItemWrapper'
import { forwardFile } from '../utils'

export const forward = ({ client }) => {
  return {
    name: 'forward',
    action: (files, t) => forwardFile(client, files, t),
    Component: withLocales(({ onClick, className }) => {
      const { t } = useI18n()

      return (
        <ActionMenuItemWrapper
          className={className}
          icon="reply"
          onClick={onClick}
        >
          {t('action.forward')}
        </ActionMenuItemWrapper>
      )
    })
  }
}
