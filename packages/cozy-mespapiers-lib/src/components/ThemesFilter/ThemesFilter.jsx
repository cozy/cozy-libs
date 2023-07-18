import React from 'react'

import CircleButton from 'cozy-ui/transpiled/react/CircleButton'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'

import { makeLabel } from './helpers'
import { getThemesList } from '../../helpers/themes'
import { useScannerI18n } from '../Hooks/useScannerI18n'

const ThemesFilter = ({ selectedTheme, handleThemeSelection }) => {
  const scannerT = useScannerI18n()
  const { t } = useI18n()

  const items = getThemesList()

  return (
    <>
      {items.map(item => (
        <CircleButton
          key={item.id}
          label={makeLabel({ scannerT, t, label: `${item.label}` })}
          variant={selectedTheme.id === item.id ? 'active' : 'default'}
          onClick={() => handleThemeSelection(item)}
          data-testid="ThemesFilter"
        >
          <Icon icon={item.icon} />
        </CircleButton>
      ))}
    </>
  )
}

export default ThemesFilter
