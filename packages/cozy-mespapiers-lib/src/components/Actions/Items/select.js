import React from 'react'
import { useHistory } from 'react-router-dom'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import ActionMenuItemWrapper from '../ActionMenuItemWrapper'

export const select = ({ hideActionsMenu }) => {
  return {
    Component: function Select({ className, files }) {
      const { t } = useI18n()
      const history = useHistory()

      return (
        <ActionMenuItemWrapper
          className={className}
          icon="select-all"
          onClick={() => {
            history.push({
              pathname: `/paper`
            })
            hideActionsMenu()
          }}
        >
          {files.length === 0 ? t('action.selectPapers') : t('action.select')}
        </ActionMenuItemWrapper>
      )
    }
  }
}
