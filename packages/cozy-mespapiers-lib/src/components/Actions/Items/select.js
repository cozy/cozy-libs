import React, { forwardRef } from 'react'

import { generateWebLink, useClient } from 'cozy-client'
import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import withLocales from '../../../locales/withLocales'

export const select = ({ hideActionsMenu, addMultiSelectionFile }) => {
  return {
    name: 'select',
    action: docs => {
      hideActionsMenu && hideActionsMenu()
      docs.length > 0 && addMultiSelectionFile && addMultiSelectionFile(docs[0])
    },
    Component: withLocales(
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
