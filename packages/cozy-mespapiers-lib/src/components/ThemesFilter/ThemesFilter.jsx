import React from 'react'

import CircleButton from 'cozy-ui/transpiled/react/CircleButton'
import Icon from 'cozy-ui/transpiled/react/Icon'

import { useThemeLabel } from './useThemeLabel'
import { getThemesList } from '../../helpers/themes'

const FilterButton = ({ item, isSelected, onClick }) => {
  const label = useThemeLabel(item.label)

  return (
    <CircleButton
      label={label}
      variant={isSelected ? 'active' : 'default'}
      onClick={onClick}
      data-testid="ThemesFilter"
    >
      <Icon icon={item.icon} />
    </CircleButton>
  )
}

const ThemesFilter = ({ selectedTheme, handleThemeSelection }) => {
  const items = getThemesList()

  return (
    <>
      {items.map(item => (
        <FilterButton
          key={item.id}
          item={item}
          isSelected={selectedTheme.id === item.id}
          onClick={() => handleThemeSelection(item)}
        />
      ))}
    </>
  )
}

export default ThemesFilter
