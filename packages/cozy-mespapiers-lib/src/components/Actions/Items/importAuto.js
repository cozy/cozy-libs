import React, { forwardRef } from 'react'

import { useClient } from 'cozy-client'
import flag from 'cozy-flags'
import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

import Konnector from '../../../assets/icons/Konnectors.svg'
import { getStoreWebLinkByKonnector } from '../../../helpers/getStoreWebLinkByKonnector'
import withLocales from '../../../locales/withLocales'

export const importAuto = ({ paperDefinition }) => {
  return {
    name: 'importAuto',
    Component: withLocales(
      // eslint-disable-next-line react/display-name
      forwardRef((props, ref) => {
        const client = useClient()
        const { t } = useI18n()

        const {
          konnectorCriteria: {
            category: konnectorCategory,
            name: konnectorName
          } = {},
          label
        } = paperDefinition

        const webLink = getStoreWebLinkByKonnector({
          client,
          konnectorName,
          konnectorCategory,
          redirectionPath: flag('harvest.inappconnectors.enabled')
            ? `/paper/files/${label}/harvest/${konnectorName || ''}`
            : undefined
        })

        return (
          <ActionsMenuItem
            {...props}
            ref={ref}
            component="a"
            href={webLink}
            {...(!flag('harvest.inappconnectors.enabled') && {
              target: '_blank'
            })}
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
      })
    )
  }
}
