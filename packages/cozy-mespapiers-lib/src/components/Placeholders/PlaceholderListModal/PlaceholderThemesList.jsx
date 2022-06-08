import React from 'react'
import PropTypes from 'prop-types'

import { models } from 'cozy-client'
import IconStack from 'cozy-ui/transpiled/react/IconStack'
import Icon from 'cozy-ui/transpiled/react/Icon'
import List from 'cozy-ui/transpiled/react/MuiCozyTheme/List'
import ListItem from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem'
import ListItemIcon, {
  smallSize,
  largeSize
} from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
const {
  themes: { themesList }
} = models.document

import { useScannerI18n } from '../../Hooks/useScannerI18n'

const PlaceholderThemesList = ({ setQualifByTheme }) => {
  const scannerT = useScannerI18n()

  return (
    <List className="u-mv-half">
      {themesList.map(theme => {
        return (
          <ListItem
            button
            key={theme.id}
            onClick={() => setQualifByTheme(theme)}
          >
            <ListItemIcon>
              <IconStack
                backgroundIcon={
                  <Icon
                    icon="file-duotone"
                    color="var(--primaryColor)"
                    size={largeSize}
                  />
                }
                foregroundIcon={
                  <Icon
                    icon={theme.icon}
                    color="var(--primaryColor)"
                    size={smallSize}
                  />
                }
              />
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
