import React from 'react'
import { useNavigate } from 'react-router-dom'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import withLocales from '../../../locales/withLocales'
import ActionMenuItemWrapper from '../ActionMenuItemWrapper'

export const select = ({ hideActionsMenu, addMultiSelectionFile }) => {
  return {
    name: 'select',
    Component: withLocales(({ className, files }) => {
      const { t } = useI18n()
      const navigate = useNavigate()
      const selectFromFile = files.length === 1

      return (
        <ActionMenuItemWrapper
          className={className}
          icon={selectFromFile ? 'select-all' : 'paperplane'}
          onClick={() => {
            navigate(`/paper/multiselect`)
            hideActionsMenu && hideActionsMenu()
            files.length > 0 &&
              addMultiSelectionFile &&
              addMultiSelectionFile(files[0])
          }}
        >
          {selectFromFile ? t('action.select') : t('action.forwardPapers')}
        </ActionMenuItemWrapper>
      )
    })
  }
}
