import React from 'react'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import ListItemIcon from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon'

import withLocales from '../../../locales/withLocales'

export const scanPicture = ({ paperDefinition, scanPictureOnclick }) => {
  return {
    name: 'scanPicture',
    action: scanPictureOnclick,
    // eslint-disable-next-line no-unused-vars
    Component: withLocales(({ t, f, lang, ...props }) => {
      const { acquisitionSteps } = paperDefinition

      const hasSteps = acquisitionSteps?.length > 0

      return (
        <ActionsMenuItem {...props} disabled={!hasSteps}>
          <ListItemIcon>
            <Icon icon="camera" size={16} />
          </ListItemIcon>
          <ListItemText
            primary={t('ImportDropdown.scanPicture.title')}
            secondary={t('ImportDropdown.scanPicture.text')}
          />
        </ActionsMenuItem>
      )
    })
  }
}
