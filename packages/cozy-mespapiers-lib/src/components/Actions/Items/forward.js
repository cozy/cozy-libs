import React, { forwardRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import withLocales from '../../../locales/withLocales'

export const forward = () => {
  return {
    name: 'forward',
    Component: withLocales(
      // eslint-disable-next-line react/display-name
      forwardRef((props, ref) => {
        const { t } = useI18n()
        const navigate = useNavigate()
        const { pathname } = useLocation()

        return (
          <ActionsMenuItem
            {...props}
            ref={ref}
            onClick={() => {
              props.onClick()
              navigate(`${pathname}/forward/${props.docs[0]._id}`)
            }}
          >
            <ListItemIcon>
              <Icon icon="reply" />
            </ListItemIcon>
            <ListItemText primary={t('action.forward')} />
          </ActionsMenuItem>
        )
      })
    )
  }
}
