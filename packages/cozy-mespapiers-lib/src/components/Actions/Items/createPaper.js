import React, { forwardRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import withLocales from '../../../locales/withLocales'

export const createPaper = ({ hideActionsMenu }) => {
  return {
    name: 'createPaper',
    Component: withLocales(
      forwardRef((props, ref) => {
        const navigate = useNavigate()
        const { pathname } = useLocation()
        const { t } = useI18n()

        return (
          <ActionsMenuItem
            {...props}
            ref={ref}
            onClick={() => {
              navigate(`${pathname}/create`)
              hideActionsMenu && hideActionsMenu()
            }}
          >
            <ListItemIcon>
              <Icon icon="paper" />
            </ListItemIcon>
            <ListItemText primary={t('action.createPaper')} />
          </ActionsMenuItem>
        )
      })
    )
  }
}
