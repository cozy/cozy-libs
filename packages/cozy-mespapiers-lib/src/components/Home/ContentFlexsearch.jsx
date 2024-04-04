import PropTypes from 'prop-types'
import React from 'react'

import ContentWhenNotSearching from './ContentWhenNotSearching'
import ContentWhenSearching from './ContentWhenSearching'

const ContentFlexsearch = ({
  contacts,
  papers,
  konnectors,
  selectedThemes,
  searchValue
}) => {
  const isSearching = searchValue.length > 0 || Boolean(selectedThemes.length)

  if (isSearching) {
    return (
      <ContentWhenSearching
        papers={papers}
        contacts={contacts}
        konnectors={konnectors}
        searchValue={searchValue}
        selectedThemes={selectedThemes}
      />
    )
  }

  return (
    <ContentWhenNotSearching
      papers={papers}
      contacts={contacts}
      konnectors={konnectors}
    />
  )
}

ContentFlexsearch.propTypes = {
  contacts: PropTypes.array,
  papers: PropTypes.array,
  konnectors: PropTypes.array,
  selectedThemes: PropTypes.arrayOf(PropTypes.object),
  searchValue: PropTypes.string
}

export default ContentFlexsearch
