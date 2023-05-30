import PropTypes from 'prop-types'
import React from 'react'

import ContentWhenNotSearching from './ContentWhenNotSearching'
import ContentWhenSearching from './ContentWhenSearching'

const ContentFlexsearch = ({
  contacts,
  papers,
  konnectors,
  selectedTheme,
  searchValue
}) => {
  const isSearching = searchValue.length > 0 || Boolean(selectedTheme)

  if (isSearching) {
    return (
      <ContentWhenSearching
        papers={papers}
        contacts={contacts}
        konnectors={konnectors}
        searchValue={searchValue}
        selectedTheme={selectedTheme}
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
  selectedTheme: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  searchValue: PropTypes.string
}

export default ContentFlexsearch
