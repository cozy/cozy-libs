import React from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import ActionMenuItemWrapper from '../ActionMenuItemWrapper'

export const rename = ({ setPaperBeingRenamedId }) => {
  return {
    name: 'rename',
    action: files => setPaperBeingRenamedId(files[0].id),
    Component: function Open({ onClick, className }) {
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
    }
  }
}
