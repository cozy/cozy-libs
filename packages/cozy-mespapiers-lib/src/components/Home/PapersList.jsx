import React from 'react'
import PropTypes from 'prop-types'

import HomeSearchResult from './HomeSearchResult'
import Result from './Result'

const PapersList = ({
  contacts,
  isSearching,
  selectedTheme,
  searchValue,
  filesWithPapersDefinitionsLabels,
  allPapersByCategories,
  setSelectedThemeLabel
}) => {
  if (isSearching)
    return (
      <HomeSearchResult
        contacts={contacts}
        filesWithPapersDefinitionsLabels={filesWithPapersDefinitionsLabels}
        selectedTheme={selectedTheme}
        searchValue={searchValue}
      />
    )

  return (
    <Result
      allPapersByCategories={allPapersByCategories}
      selectedTheme={selectedTheme}
      searchValue={searchValue}
      setSelectedThemeLabel={setSelectedThemeLabel}
    />
  )
}

PapersList.propTypes = {
  contacts: PropTypes.array,
  isSearching: PropTypes.bool,
  selectedTheme: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  searchValue: PropTypes.string,
  filesWithPapersDefinitionsLabels: PropTypes.array,
  allPapersByCategories: PropTypes.array,
  setSelectedThemeLabel: PropTypes.string
}

export default PapersList
