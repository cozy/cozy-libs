/* global cozy */
import PropTypes from 'prop-types'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import UIBarTitle from 'cozy-ui/transpiled/react/BarTitle'
import CozyTheme from 'cozy-ui/transpiled/react/CozyTheme'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'

import { getCurrentFileTheme } from './helpers'
import { useMultiSelection } from '../Hooks/useMultiSelection'
import { useScannerI18n } from '../Hooks/useScannerI18n'

const PapersListToolbar = ({ selectedThemeLabel, fileCount }) => {
  const { BarLeft, BarCenter } = cozy.bar
  const params = useParams()
  const navigate = useNavigate()
  const { isMultiSelectionActive } = useMultiSelection()
  const scannerT = useScannerI18n()

  const currentFileTheme = getCurrentFileTheme(params, selectedThemeLabel)
  const themeLabel = scannerT(`items.${currentFileTheme}`, {
    smart_count: fileCount
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
        {/* Need to repeat the theme since the bar is in another react portal */}
        <CozyTheme variant="normal">
          <UIBarTitle>{themeLabel}</UIBarTitle>
        </CozyTheme>
      </BarCenter>
    </>
  )
}

PapersListToolbar.propTypes = {
  selectedThemeLabel: PropTypes.string
}

export default PapersListToolbar
