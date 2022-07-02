import React from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import { downloadFiles } from '../utils'
import ActionMenuItemWrapper from '../ActionMenuItemWrapper'

export const download = ({ client }) => {
  return {
    name: 'download',
    action: files => downloadFiles(client, files),
    Component: function Download({ onClick, className }) {
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
    }
  }
}
