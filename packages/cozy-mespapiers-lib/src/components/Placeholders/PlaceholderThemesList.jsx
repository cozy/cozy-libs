import React, { useState, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'

import { models } from 'cozy-client'
import { FixedDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import IconStack from 'cozy-ui/transpiled/react/IconStack'
import Icon from 'cozy-ui/transpiled/react/Icon'
import FileDuotoneIcon from 'cozy-ui/transpiled/react/Icons/FileDuotone'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import List from 'cozy-ui/transpiled/react/MuiCozyTheme/List'
import ListItem from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem'
import ListItemIcon, {
  smallSize,
  largeSize
} from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import RightIcon from 'cozy-ui/transpiled/react/Icons/Right'
const {
  themes: { themesList }
} = models.document

import PlaceholdersList from '../Placeholders/PlaceholdersList'
import { useScannerI18n } from '../Hooks/useScannerI18n'

const PlaceholderThemesList = ({ title, onClose }) => {
  const { t } = useI18n()
  const scannerT = useScannerI18n()
  const defaultState = useMemo(
    () => ({
      onBack: false,
      currentQualifItems: [],
      qualificationLabel: ''
    }),
    []
  )
  const [state, setState] = useState(defaultState)

  const resetCurrentQualif = useCallback(() => {
    setState({ ...defaultState, onBack: true })
  }, [defaultState])

  const setQualifByTheme = useCallback(theme => {
    setState(prev => ({
      ...prev,
      currentQualifItems: theme.items,
      qualificationLabel: theme.label
    }))
  }, [])

  return state.currentQualifItems.length === 0 ? (
    <FixedDialog
      onClose={onClose}
      title={title}
      transitionDuration={state.onBack ? 0 : undefined}
      open={true}
      content={
        <List>
          {themesList.map((theme, idx) => {
            return (
              <ListItem
                button
                disableGutters
                key={idx}
                onClick={() => setQualifByTheme(theme)}
              >
                <ListItemIcon>
                  <IconStack
                    backgroundIcon={
                      <Icon
                        icon={FileDuotoneIcon}
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
                  icon={RightIcon}
                  size={smallSize}
                  color={'var(--secondaryTextColor)'}
                />
              </ListItem>
            )
          })}
        </List>
      }
    />
  ) : (
    <FixedDialog
      onClose={onClose}
      onBack={resetCurrentQualif}
      transitionDuration={0}
      title={t('PlaceholdersList.title', {
        name: ` - ${scannerT(`themes.${state.qualificationLabel}`)}`
      })}
      open={true}
      content={
        <PlaceholdersList currentQualifItems={state.currentQualifItems} />
      }
    />
  )
}

PlaceholderThemesList.propTypes = {
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired
}

export default PlaceholderThemesList
