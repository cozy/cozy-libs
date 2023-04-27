import React from 'react'

import { useClient } from 'cozy-client'
import flag from 'cozy-flags'
import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import AppLinker from 'cozy-ui/transpiled/react/AppLinker'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import ListItemIcon from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon'

import Konnector from '../../../assets/icons/Konnectors.svg'
import { getStoreWebLinkByKonnector } from '../../../helpers/getStoreWebLinkByKonnector'
import withLocales from '../../../locales/withLocales'

export const importAuto = ({ paperDefinition }) => {
  return {
    name: 'importAuto',
    // eslint-disable-next-line no-unused-vars
    Component: withLocales(({ t, f, lang, ...props }) => {
      const client = useClient()

      const {
        konnectorCriteria: {
          category: konnectorCategory,
          name: konnectorName
        } = {},
        label
      } = paperDefinition

      return (
        <AppLinker
          app={{ slug: 'store' }}
          href={getStoreWebLinkByKonnector({
            client,
            konnectorName,
            konnectorCategory,
            redirectionPath: flag('harvest.inappconnectors.enabled')
              ? `/paper/files/${label}/harvest/${konnectorName || ''}`
              : undefined
          })}
        >
          {({ href }) => {
            return (
              <ActionsMenuItem
                component="a"
                href={href}
                {...(!flag('harvest.inappconnectors.enabled') && {
                  target: '_blank'
                })}
                {...props}
              >
                <ListItemIcon>
                  <Icon icon={Konnector} size={24} />
                </ListItemIcon>
                <ListItemText
                  primary={t('ImportDropdown.importAuto.title')}
                  secondary={t('ImportDropdown.importAuto.text')}
                  ellipsis={false}
                />
              </ActionsMenuItem>
            )
          }}
        </AppLinker>
      )
    })
  }
}
