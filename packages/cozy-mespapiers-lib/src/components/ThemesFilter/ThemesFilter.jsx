import PropTypes from 'prop-types'
import React from 'react'

import CircleButton from 'cozy-ui/transpiled/react/CircleButton'
import Icon from 'cozy-ui/transpiled/react/Icon'

import { useThemeLabel } from './useThemeLabel'
import { getThemesList } from '../../helpers/themes'

const FilterButton = ({ theme, isSelected, onClick }) => {
  const label = useThemeLabel(theme.label)

  return (
    <CircleButton
      label={label}
      variant={isSelected ? 'active' : 'default'}
      onClick={onClick}
      data-testid="ThemesFilter"
    >
      <Icon icon={theme.icon} />
    </CircleButton>
  )
}

FilterButton.propTypes = {
  theme: PropTypes.object,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func
}

const ThemesFilter = ({ selectedThemes, handleThemeSelection }) => {
  const themes = getThemesList()

  return (
    <>
      {themes.map(theme => (
        <FilterButton
          key={theme.id}
          theme={theme}
          isSelected={selectedThemes.some(
            selectedTheme => selectedTheme.id === theme.id
          )}
          onClick={() => handleThemeSelection(theme)}
        />
      ))}
    </>
  )
}

ThemesFilter.propTypes = {
  selectedThemes: PropTypes.arrayOf(PropTypes.object),
  handleThemeSelection: PropTypes.func
}

export default ThemesFilter
