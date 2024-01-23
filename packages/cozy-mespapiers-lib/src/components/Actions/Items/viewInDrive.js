import React, { forwardRef } from 'react'

import { generateWebLink, useClient } from 'cozy-client'
import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import withLocales from '../../../locales/withLocales'

export const viewInDrive = () => {
  return {
    name: 'viewInDrive',
    Component: withLocales(
      // eslint-disable-next-line react/display-name
      forwardRef((props, ref) => {
        const { t } = useI18n()
        const client = useClient()

        const dirId = props.docs[0].dir_id

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
