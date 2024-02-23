import React, { forwardRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import withLocales from '../../../locales/withLocales'

export const editContact = ({ setShowActionMenu }) => {
  return {
    name: 'editContact',
    Component: withLocales(
      forwardRef((props, ref) => {
        const { t } = useI18n()
        const navigate = useNavigate()
        const { pathname } = useLocation()

        return (
          <ActionsMenuItem
            {...props}
            ref={ref}
            onClick={() => {
              navigate(`${pathname}/editcontact/${props.docs[0]._id}`)
              setShowActionMenu && setShowActionMenu(false)
            }}
          >
            <ListItemIcon>
              <Icon icon="people" />
            </ListItemIcon>
            <ListItemText primary={t('action.editContact')} />
          </ActionsMenuItem>
        )
      })
    )
  }
}
