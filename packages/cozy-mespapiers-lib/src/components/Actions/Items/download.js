import React from 'react'

import ActionMenuItemWrapper from 'cozy-ui/transpiled/react/ActionMenu/ActionMenuItemWrapper'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import withLocales from '../../../locales/withLocales'
import { downloadFiles } from '../utils'

export const download = ({ client }) => {
  return {
    name: 'download',
    action: files => downloadFiles(client, files),
    Component: withLocales(({ onClick, className }) => {
      const { t } = useI18n()

      return (
        <ActionMenuItemWrapper
          className={className}
          icon="download"
          onClick={onClick}
        >
          {t('action.download')}
        </ActionMenuItemWrapper>
      )
    })
  }
}
