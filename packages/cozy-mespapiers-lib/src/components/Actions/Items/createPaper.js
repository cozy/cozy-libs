import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import ActionMenuItemWrapper from '../ActionMenuItemWrapper'

export const createPaper = ({ hideActionsMenu }) => {
  return {
    name: 'createPaper',
    Component: function CreatePaper({ className }) {
      const { t } = useI18n()
      const navigate = useNavigate()
      const { pathname } = useLocation()

      return (
        <ActionMenuItemWrapper
          className={className}
          icon="paper"
          onClick={() => {
            navigate(`${pathname}/create`)
            hideActionsMenu && hideActionsMenu()
          }}
        >
          {t('action.createPaper')}
        </ActionMenuItemWrapper>
      )
    }
  }
}
