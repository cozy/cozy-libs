import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import ListItemIcon from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon'

import withLocales from '../../../locales/withLocales'

export const createPaper = ({ hideActionsMenu }) => {
  return {
    name: 'createPaper',
    // eslint-disable-next-line no-unused-vars
    Component: withLocales(({ t, f, lang, ...props }) => {
      const navigate = useNavigate()
      const { pathname } = useLocation()

      return (
        <ActionsMenuItem
          {...props}
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
  }
}
