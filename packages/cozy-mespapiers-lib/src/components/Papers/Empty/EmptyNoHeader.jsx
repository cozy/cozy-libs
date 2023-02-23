import React from 'react'
import PropTypes from 'prop-types'
import { useNavigate, useParams, useLocation } from 'react-router-dom'

import flag from 'cozy-flags'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import Empty from 'cozy-ui/transpiled/react/Empty'
import Button from 'cozy-ui/transpiled/react/Buttons'
import PapersIcon from 'cozy-ui/transpiled/react/Icons/Papers'

import { findPlaceholderByLabelAndCountry } from '../../../helpers/findPlaceholders'
import { useMultiSelection } from '../../Hooks/useMultiSelection'
import { usePapersDefinitions } from '../../Hooks/usePapersDefinitions'
import { getCurrentFileTheme } from '../helpers'
import HarvestBanner from '../HarvestBanner'
import styles from './styles.styl'

const makeCountrySearchParam = ({ papersDefinitions, params, search }) => {
  const country = new URLSearchParams(search).get('country')
  const paperDefinition = findPlaceholderByLabelAndCountry(
    papersDefinitions,
    params.fileTheme,
    country
  )[0]

  return paperDefinition.country ? `country=${paperDefinition.country}` : ''
}

const EmptyNoHeader = ({ connector, accounts }) => {
  const { t } = useI18n()
  const params = useParams()
  const { search, pathname } = useLocation()
  const navigate = useNavigate()
  const { selectedThemeLabel } = useMultiSelection()
  const { papersDefinitions } = usePapersDefinitions()

  const currentFileTheme = getCurrentFileTheme(params, selectedThemeLabel)
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
      {flag('harvest.inappconnectors.enabled') && (
        <HarvestBanner connector={connector} account={accounts?.[0]} />
      )}
      <Empty
        className={`${styles['emptyWithConnector']} u-ph-1`}
        icon={PapersIcon}
        iconSize="normal"
        title={t('Empty.connector.title')}
        text={t('Empty.connector.text', {
          connectorSlug: connector?.slug?.toUpperCase()
        })}
      >
        <Button label={t('Empty.connector.button')} onClick={handleClick} />
      </Empty>
    </>
  )
}

EmptyNoHeader.propTypes = {
  connector: PropTypes.object,
  accounts: PropTypes.array
}

export default EmptyNoHeader
