import React from 'react'
import PropTypes from 'prop-types'

import ResultForSearch from './ResultForSearch'
import PaperGroup from '../Papers/PaperGroup'

const Content = ({
  contacts,
  papers,
  papersByCategories,
  selectedTheme,
  searchValue
}) => {
  const isSearching = searchValue.length > 0 || Boolean(selectedTheme)

  if (isSearching)
    return (
      <ResultForSearch
        contacts={contacts}
        papers={papers}
        selectedTheme={selectedTheme}
        searchValue={searchValue}
      />
    )

  return <PaperGroup papersByCategories={papersByCategories} />
}

Content.propTypes = {
  contacts: PropTypes.array,
  papers: PropTypes.array,
  papersByCategories: PropTypes.array,
  selectedTheme: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  searchValue: PropTypes.string
}

export default Content
