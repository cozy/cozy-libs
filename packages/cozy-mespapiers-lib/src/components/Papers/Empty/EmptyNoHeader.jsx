import PropTypes from 'prop-types'
import React from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Empty from 'cozy-ui/transpiled/react/Empty'
import PapersIcon from 'cozy-ui/transpiled/react/Icons/Papers'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { makeCountrySearchParam } from './helpers'
import styles from './styles.styl'
import { useMultiSelection } from '../../Hooks/useMultiSelection'
import { usePapersDefinitions } from '../../Hooks/usePapersDefinitions'
import HarvestBanner from '../HarvestBanner'
import { getCurrentQualificationLabel } from '../helpers'

const EmptyNoHeader = ({ konnector, accounts }) => {
  const { t } = useI18n()
  const params = useParams()
  const { search, pathname } = useLocation()
  const navigate = useNavigate()
  const { selectedQualificationLabel } = useMultiSelection()
  const { papersDefinitions } = usePapersDefinitions()

  const currentFileTheme = getCurrentQualificationLabel(
    params,
    selectedQualificationLabel
  )
  const countrySearchParam = makeCountrySearchParam({
    papersDefinitions,
    params,
    search
  })

  const handleClick = () => {
    navigate({
      pathname: `${pathname}/create/${currentFileTheme}`,
      search: `${countrySearchParam}`
    })
  }

  return (
    <>
      <HarvestBanner konnector={konnector} account={accounts?.[0]} />

      <Empty
        className={`${styles['emptyWithKonnector']} u-ph-1`}
        icon={PapersIcon}
        iconSize="normal"
        title={t('Empty.konnector.title')}
        text={t('Empty.konnector.text', {
          konnectorName: konnector.name
        })}
        data-testid="EmptyNoHeader"
      >
        <Button label={t('Empty.konnector.button')} onClick={handleClick} />
      </Empty>
    </>
  )
}

EmptyNoHeader.propTypes = {
  konnector: PropTypes.object.isRequired,
  accounts: PropTypes.array
}

export default EmptyNoHeader
