import React, { forwardRef } from 'react'

import { generateWebLink, useClient } from 'cozy-client'
import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

import withLocales from '../../../locales/withLocales'

export const select = ({ hideActionsMenu, addMultiSelectionFile }) => {
  return {
    name: 'select',
    action: doc => {
      hideActionsMenu && hideActionsMenu()
      doc && addMultiSelectionFile && addMultiSelectionFile(doc)
    },
    Component: withLocales(
      // eslint-disable-next-line react/display-name
      forwardRef((props, ref) => {
        const { t } = useI18n()
        const client = useClient()

        const webLink = generateWebLink({
          slug: 'mespapiers',
          cozyUrl: client.getStackClient().uri,
          subDomainType: client.getInstanceOptions().subdomain,
          pathname: '/',
          hash: '/paper/multiselect'
        })

        return (
          <ActionsMenuItem {...props} ref={ref} component="a" href={webLink}>
            <ListItemIcon>
              <Icon icon="select-all" />
            </ListItemIcon>
            <ListItemText primary={t('action.select')} />
          </ActionsMenuItem>
        )
      })
    )
  }
}
