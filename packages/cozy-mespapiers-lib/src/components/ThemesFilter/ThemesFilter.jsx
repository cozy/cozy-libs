import React from 'react'
import get from 'lodash/get'

import CircleButton from 'cozy-ui/transpiled/react/CircleButton'
import Icon from 'cozy-ui/transpiled/react/Icon'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import { useScannerI18n } from '../Hooks/useScannerI18n'

import enLocale from '../../locales/en.json'

const makeLabel = ({ scannerT, t, label }) => {
  const hasLocale = get(enLocale, `Scan.${label}`)
  return hasLocale ? t(`Scan.${label}`) : scannerT(label)
}

const ThemesFilter = ({ items, selectedTheme, handleThemeSelection }) => {
  const scannerT = useScannerI18n()
  const { t } = useI18n()

  return (
    <>
      {items.map(item => (
        <CircleButton
          key={item.id}
          label={makeLabel({ scannerT, t, label: `themes.${item.label}` })}
          variant={selectedTheme.id === item.id ? 'active' : 'default'}
          onClick={() => handleThemeSelection(item)}
        >
          <Icon icon={item.icon} />
        </CircleButton>
      ))}
    </>
  )
}

export default ThemesFilter
