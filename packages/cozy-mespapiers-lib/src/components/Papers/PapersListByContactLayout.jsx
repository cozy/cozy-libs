import React from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'

import { useMultiSelection } from '../Hooks/useMultiSelection'
import PapersListToolbar from '../Papers/PapersListToolbar'
import { useScannerI18n } from '../Hooks/useScannerI18n'
import PapersListByContact from '../Papers/PapersListByContact'
import { Spinner } from 'cozy-ui/transpiled/react/Spinner'

const PapersListByContactLayout = ({
  currentFileTheme,
  paperslistByContact
}) => {
  const navigate = useNavigate()
  const { setIsMultiSelectionActive, isMultiSelectionActive } =
    useMultiSelection()
  const scannerT = useScannerI18n()
  const themeLabel = scannerT(`items.${currentFileTheme}`)

  return (
    <>
      {!isMultiSelectionActive && (
        <PapersListToolbar
          title={themeLabel}
          onBack={() => navigate('/paper')}
          onClose={() => setIsMultiSelectionActive(false)}
        />
      )}

      {paperslistByContact.length > 0 ? (
        <PapersListByContact paperslistByContact={paperslistByContact} />
      ) : (
        <Spinner
          size="xxlarge"
          className="u-flex u-flex-justify-center u-mt-2 u-h-5"
        />
      )}
    </>
  )
}

PapersListByContactLayout.propTypes = {
  currentFileTheme: PropTypes.string,
  paperslistByContact: PropTypes.array
}

export default PapersListByContactLayout
