import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import ActionMenuItemWrapper from 'cozy-ui/transpiled/react/ActionMenu/ActionMenuItemWrapper'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import withLocales from '../../../locales/withLocales'

export const createPaper = ({ hideActionsMenu }) => {
  return {
    name: 'createPaper',
    Component: withLocales(({ className }) => {
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
    })
  }
}
