import React, { forwardRef } from 'react'

import { generateWebLink, useClient } from 'cozy-client'
import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import ListItemIcon from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon'

import withLocales from '../../../locales/withLocales'

export const viewInDrive = () => {
  return {
    name: 'viewInDrive',
    Component: withLocales(
      // eslint-disable-next-line react/display-name
      forwardRef((props, ref) => {
        const { t } = useI18n()
        const client = useClient()

        const dirId = props.doc.dir_id

        const webLink = generateWebLink({
          slug: 'drive',
          cozyUrl: client.getStackClient().uri,
          subDomainType: client.getInstanceOptions().subdomain,
          pathname: '/',
          hash: `folder/${dirId}`
        })

        return (
          <ActionsMenuItem
            {...props}
            ref={ref}
            component="a"
            href={webLink}
            target="_blank"
          >
            <ListItemIcon>
              <Icon icon="folder" />
            </ListItemIcon>
            <ListItemText primary={t('action.viewInDrive')} />
          </ActionsMenuItem>
        )
      })
    )
  }
}
