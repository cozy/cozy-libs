import React from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import withLocales from '../../../locales/withLocales'
import ActionMenuItemWrapper from '../ActionMenuItemWrapper'

export const renameDefaultActions = () => {
  return {
    name: 'rename',
    Component: withLocales(({ onClick, className }) => {
      const { t } = useI18n()

      return (
        <ActionMenuItemWrapper
          className={className}
          icon="rename"
          onClick={onClick}
        >
          {t('action.rename')}
        </ActionMenuItemWrapper>
      )
    })
  }
}