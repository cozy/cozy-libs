import React from 'react'

import CircleButton from 'cozy-ui/transpiled/react/CircleButton'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'

import { getThemesList } from '../../helpers/themes'
import enLocale from '../../locales/en.json'
import { useScannerI18n } from '../Hooks/useScannerI18n'

const makeLabel = ({ scannerT, t, label }) => {
  const hasLocale = enLocale?.Scan?.themes?.[label]

  return hasLocale ? t(`Scan.themes.${label}`) : scannerT(`themes.${label}`)
}

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
