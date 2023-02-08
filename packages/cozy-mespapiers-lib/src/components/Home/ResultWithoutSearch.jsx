import React from 'react'
import PropTypes from 'prop-types'

import PaperGroup from '../Papers/PaperGroup'
import { useScannerI18n } from '../Hooks/useScannerI18n'
import { filterPapersByThemeAndSearchValue } from './helpers'

const ResultWithoutSearch = ({
  allPapersByCategories,
  selectedTheme,
  searchValue,
  setSelectedThemeLabel
}) => {
  const scannerT = useScannerI18n()

  const filteredPapers = filterPapersByThemeAndSearchValue({
    files: allPapersByCategories.map(file => ({ file })),
    theme: selectedTheme,
    search: searchValue,
    scannerT
  }).map(({ file }) => file)

  return (
    <PaperGroup
      allPapersByCategories={filteredPapers}
      setSelectedThemeLabel={setSelectedThemeLabel}
    />
  )
}

ResultWithoutSearch.propTypes = {
  allPapersByCategories: PropTypes.array,
  selectedTheme: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  setSelectedThemeLabel: PropTypes.string,
  searchValue: PropTypes.string
}

export default ResultWithoutSearch
