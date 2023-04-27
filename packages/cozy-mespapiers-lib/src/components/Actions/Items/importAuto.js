import React from 'react'

import { useClient } from 'cozy-client'
import flag from 'cozy-flags'
import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import AppLinker from 'cozy-ui/transpiled/react/AppLinker'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import ListItemIcon from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon'

import Konnector from '../../../assets/icons/Konnectors.svg'
import { getStoreWebLinkByKonnector } from '../../../helpers/getStoreWebLinkByKonnector'
import withLocales from '../../../locales/withLocales'

export const importAuto = ({ paperDefinition }) => {
  return {
    name: 'importAuto',
    Component: withLocales(props => {
      const { t } = useI18n()
      const client = useClient()

      const {
        konnectorCriteria: {
          category: konnectorCategory,
          name: konnectorName
        } = {},
        label
      } = paperDefinition

      const handleClick = href => () =>
        window.open(
          href,
          flag('harvest.inappconnectors.enabled') ? undefined : '_blank'
        )

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
              <ActionsMenuItem {...props} onClick={handleClick(href)}>
                <ListItemIcon>
                  <Icon icon={Konnector} size={24} />
                </ListItemIcon>
                <ListItemText
                  primary={t('ImportDropdown.importAuto.title')}
                  secondary={t('ImportDropdown.importAuto.text')}
                />
              </ActionsMenuItem>
            )
          }}
        </AppLinker>
      )
    })
  }
}
