import React from 'react'
import get from 'lodash/get'

import CircleButton from 'cozy-ui/transpiled/react/CircleButton'
import Icon from 'cozy-ui/transpiled/react/Icon'
import PeopleIcon from 'cozy-ui/transpiled/react/Icons/People'
import TeamIcon from 'cozy-ui/transpiled/react/Icons/Team'
import CompanyIcon from 'cozy-ui/transpiled/react/Icons/Company'
import HeartIcon from 'cozy-ui/transpiled/react/Icons/Heart'
import HomeIcon from 'cozy-ui/transpiled/react/Icons/Home'
import CarIcon from 'cozy-ui/transpiled/react/Icons/Car'
import CompassIcon from 'cozy-ui/transpiled/react/Icons/Compass'
import BankIcon from 'cozy-ui/transpiled/react/Icons/Bank'
import BillIcon from 'cozy-ui/transpiled/react/Icons/Bill'
import Box from 'cozy-ui/transpiled/react/Box'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import { useScannerI18n } from '../Hooks/useScannerI18n'

import enLocale from '../../locales/en.json'

const itemIconToSvg = {
  people: PeopleIcon,
  team: TeamIcon,
  company: CompanyIcon,
  heart: HeartIcon,
  home: HomeIcon,
  car: CarIcon,
  compass: CompassIcon,
  bank: BankIcon,
  bill: BillIcon
}

const makeLabel = ({ scannerT, t, label }) => {
  const hasLocale = get(enLocale, `Scan.${label}`)
  return hasLocale ? t(`Scan.${label}`) : scannerT(label)
}

const ThemesFilter = ({ items, selectedTheme, handleThemeSelection }) => {
  const scannerT = useScannerI18n()
  const { t } = useI18n()

  return (
    <Box className="u-flex u-flex-justify-center u-mv-1" flexWrap="wrap">
      {items.map((item, index) => (
        <CircleButton
          key={index}
          label={makeLabel({ scannerT, t, label: `themes.${item.label}` })}
          variant={selectedTheme.id === item.id ? 'active' : 'default'}
          onClick={() => handleThemeSelection(item)}
        >
          <Icon icon={itemIconToSvg[item.icon]} />
        </CircleButton>
      ))}
    </Box>
  )
}

export default ThemesFilter
