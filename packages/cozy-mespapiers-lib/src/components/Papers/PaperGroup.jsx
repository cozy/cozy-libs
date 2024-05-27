import PropTypes from 'prop-types'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import List from 'cozy-ui/transpiled/react/List'

import { CategoriesByPaper } from './CategoriesByPaper'
import KonnectorsCategories from './KonnectorsCategories'
import { useMultiSelection } from '../Hooks/useMultiSelection'

const PaperGroup = ({ papersByCategories, konnectors, selectedThemes }) => {
  const navigate = useNavigate()
  const { isMultiSelectionActive, setSelectedQualificationLabel } =
    useMultiSelection()

  const hasPapers = Object.keys(papersByCategories).length > 0

  const goPapersList = qualificationLabel => {
    if (isMultiSelectionActive) {
      setSelectedQualificationLabel(qualificationLabel)
    } else {
      navigate(`files/${qualificationLabel}`)
    }
  }

  return (
    <List>
      <CategoriesByPaper
        papersByCategories={papersByCategories}
        onClick={goPapersList}
      />
      <KonnectorsCategories
        hasPapers={hasPapers}
        konnectors={konnectors}
        selectedThemes={selectedThemes}
        onClick={goPapersList}
      />
    </List>
  )
}

PaperGroup.propTypes = {
  papersByCategories: PropTypes.object,
  konnectors: PropTypes.arrayOf(PropTypes.object),
  selectedThemes: PropTypes.arrayOf(PropTypes.object)
}

export default PaperGroup
