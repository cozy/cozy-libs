import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import ActionMenuItemWrapper from '../ActionMenuItemWrapper'
import { useMultiSelection } from '../../Hooks/useMultiSelection'

export const select = ({ hideActionsMenu }) => {
  return {
    name: 'select',
    Component: function Select({ className, files }) {
      const { t } = useI18n()
      const history = useHistory()
      const { pathname } = useLocation()
      const { addMultiSelectionFile } = useMultiSelection()

      return (
        <ActionMenuItemWrapper
          className={className}
          icon="select-all"
          onClick={() => {
            history.push({
              pathname: `/paper/multiselect`,
              search: `backgroundPath=${pathname}`
            })
            hideActionsMenu && hideActionsMenu()
            files.length > 0 && addMultiSelectionFile(files[0])
          }}
        >
          {files.length === 0 ? t('action.selectPapers') : t('action.select')}
        </ActionMenuItemWrapper>
      )
    }
  }
}
