import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import ActionMenuItemWrapper from '../ActionMenuItemWrapper'

export const select = ({ hideActionsMenu, addMultiSelectionFile }) => {
  return {
    name: 'select',
    Component: function Select({ className, files }) {
      const { t } = useI18n()
      const history = useHistory()
      const { pathname } = useLocation()
      const selectFromFile = files.length === 1

      return (
        <ActionMenuItemWrapper
          className={className}
          icon={selectFromFile ? 'select-all' : 'paperplane'}
          onClick={() => {
            history.push({
              pathname: `/paper/multiselect`,
              search: `backgroundPath=${pathname}`
            })
            hideActionsMenu && hideActionsMenu()
            files.length > 0 &&
              addMultiSelectionFile &&
              addMultiSelectionFile(files[0])
          }}
        >
          {selectFromFile ? t('action.select') : t('action.forwardPapers')}
        </ActionMenuItemWrapper>
      )
    }
  }
}
