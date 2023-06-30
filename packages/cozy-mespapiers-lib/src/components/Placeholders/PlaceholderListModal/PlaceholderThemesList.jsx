import PropTypes from 'prop-types'
import React from 'react'

import Icon from 'cozy-ui/transpiled/react/Icon'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon, { smallSize } from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

import { getThemesList } from '../../../helpers/themes'
import { useScannerI18n } from '../../Hooks/useScannerI18n'
import FileIcon from '../../Icons/FileIcon'

const PlaceholderThemesList = ({ setQualifByTheme }) => {
  const scannerT = useScannerI18n()
  const themesList = getThemesList()

  return (
    <List className="u-mv-half u-pv-0">
      {themesList.map(theme => {
        return (
          <ListItem
            button
            key={theme.id}
            onClick={() => setQualifByTheme(theme)}
          >
            <ListItemIcon>
              <FileIcon icon={theme.icon} />
            </ListItemIcon>
            <ListItemText primary={scannerT(`themes.${theme.label}`)} />
            <Icon
              icon="right"
              size={smallSize}
              color="var(--secondaryTextColor)"
            />
          </ListItem>
        )
      })}
    </List>
  )
}

PlaceholderThemesList.propTypes = {
  setQualifByTheme: PropTypes.func.isRequired
}

export default PlaceholderThemesList
