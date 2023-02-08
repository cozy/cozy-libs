import React from 'react'
import PropTypes from 'prop-types'

import ResultForSearch from './ResultForSearch'
import ResultWithoutSearch from './ResultWithoutSearch'

const Content = ({
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
      <ResultForSearch
        contacts={contacts}
        filesWithPapersDefinitionsLabels={filesWithPapersDefinitionsLabels}
        selectedTheme={selectedTheme}
        searchValue={searchValue}
      />
    )

  return (
    <ResultWithoutSearch
      allPapersByCategories={allPapersByCategories}
      selectedTheme={selectedTheme}
      searchValue={searchValue}
      setSelectedThemeLabel={setSelectedThemeLabel}
    />
  )
}

Content.propTypes = {
  contacts: PropTypes.array,
  isSearching: PropTypes.bool,
  selectedTheme: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  searchValue: PropTypes.string,
  filesWithPapersDefinitionsLabels: PropTypes.array,
  allPapersByCategories: PropTypes.array,
  setSelectedThemeLabel: PropTypes.string
}

export default Content
