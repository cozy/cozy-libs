import PropTypes from 'prop-types'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { BarLeft, BarCenter } from 'cozy-bar'
import UIBarTitle from 'cozy-ui/transpiled/react/BarTitle'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'

import { getCurrentQualificationLabel } from './helpers'
import { useMultiSelection } from '../Hooks/useMultiSelection'
import { useScannerI18n } from '../Hooks/useScannerI18n'

const PapersListToolbar = ({ selectedQualificationLabel }) => {
  const params = useParams()
  const navigate = useNavigate()
  const { isMultiSelectionActive } = useMultiSelection()
  const scannerT = useScannerI18n()

  const currentQualificationLabel = getCurrentQualificationLabel(
    params,
    selectedQualificationLabel
  )
  const qualificationLabel = scannerT(`items.${currentQualificationLabel}`, {
    smart_count: 2 // We always want to have the plural here, unlike other places
  })
  const onBack = () => navigate('..')

  if (isMultiSelectionActive) {
    return null
  }

  return (
    <>
      <BarLeft>
        <div className="u-flex u-flex-items-center u-mr-half">
          <IconButton onClick={onBack}>
            <Icon icon="previous" />
          </IconButton>
        </div>
      </BarLeft>

      <BarCenter>
        <UIBarTitle>{qualificationLabel}</UIBarTitle>
      </BarCenter>
    </>
  )
}

PapersListToolbar.propTypes = {
  selectedQualificationLabel: PropTypes.string
}

export default PapersListToolbar
