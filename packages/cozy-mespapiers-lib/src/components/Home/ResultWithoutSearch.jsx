import React from 'react'
import PropTypes from 'prop-types'

import PaperGroup from '../Papers/PaperGroup'
import { useScannerI18n } from '../Hooks/useScannerI18n'
import { filterPapersByThemeAndSearchValue } from './helpers'

const ResultWithoutSearch = ({
  papersByCategories,
  selectedTheme,
  searchValue
}) => {
  const scannerT = useScannerI18n()

  const filteredPapers = filterPapersByThemeAndSearchValue({
    files: papersByCategories.map(file => ({ file })),
    theme: selectedTheme,
    search: searchValue,
    scannerT
  }).map(({ file }) => file)

  return <PaperGroup papersByCategories={filteredPapers} />
}

ResultWithoutSearch.propTypes = {
  papersByCategories: PropTypes.array,
  selectedTheme: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  searchValue: PropTypes.string
}

export default ResultWithoutSearch
