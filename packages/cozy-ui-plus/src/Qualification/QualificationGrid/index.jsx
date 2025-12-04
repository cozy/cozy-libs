import PropTypes from 'prop-types'
import React, { Fragment, useState } from 'react'
import { useI18n } from 'twake-i18n'

import Grid from 'cozy-ui/transpiled/react/Grid'
import BankIcon from 'cozy-ui/transpiled/react/Icons/Bank'
import BillIcon from 'cozy-ui/transpiled/react/Icons/Bill'
import CarIcon from 'cozy-ui/transpiled/react/Icons/Car'
import ChessIcon from 'cozy-ui/transpiled/react/Icons/Chess'
import DotsIcon from 'cozy-ui/transpiled/react/Icons/Dots'
import HeartIcon from 'cozy-ui/transpiled/react/Icons/Heart'
import HomeIcon from 'cozy-ui/transpiled/react/Icons/Home'
import PeopleIcon from 'cozy-ui/transpiled/react/Icons/People'
import TeamIcon from 'cozy-ui/transpiled/react/Icons/Team'
import WorkIcon from 'cozy-ui/transpiled/react/Icons/Work'

import { getThemesList } from './helpers'
import QualificationItem from '../QualificationItem'
import withLocales from './locales/withLocales'

const IconByName = {
  people: PeopleIcon,
  team: TeamIcon,
  work: WorkIcon,
  heart: HeartIcon,
  home: HomeIcon,
  car: CarIcon,
  chess: ChessIcon,
  bank: BankIcon,
  bill: BillIcon,
  dots: DotsIcon
}

const QualificationGrid = ({ noUndefined, noOthers, noHealth, onClick }) => {
  const themesList = getThemesList(noHealth)
  const { t } = useI18n()
  const [selectedQualification, setSelectedQualification] = useState()

  const handleClick = theme => {
    onClick(theme?.label)
    setSelectedQualification(theme?.label)
  }

  return (
    <Grid container spacing={1}>
      {!noUndefined && (
        <Grid item xs={3} sm={2}>
          <QualificationItem
            label={t('themes.undefined')}
            isSelected={selectedQualification === undefined}
            onClick={() => handleClick()}
          />
        </Grid>
      )}
      {themesList.map((theme, index) => (
        <Fragment key={index}>
          {(!noOthers || theme.label !== 'others') && (
            <Grid item xs={3} sm={2}>
              <QualificationItem
                label={t(`themes.${theme.label}`)}
                icon={IconByName[theme.icon]}
                isSelected={theme.label === selectedQualification}
                onClick={() => handleClick(theme)}
              />
            </Grid>
          )}
        </Fragment>
      ))}
    </Grid>
  )
}

QualificationGrid.defaultProps = {
  noUndefined: false,
  noOthers: false,
  noHealth: false,
  onClick: () => {}
}

QualificationGrid.propTypes = {
  /** Remove `undefined` theme */
  noUndefined: PropTypes.bool,
  /** Remove `others` theme */
  noOthers: PropTypes.bool,
  /** Remove `health` theme */
  noHealth: PropTypes.bool,
  /** Triggered when an item is clicked */
  onClick: PropTypes.func
}

export default withLocales(QualificationGrid)
