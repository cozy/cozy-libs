import PropTypes from 'prop-types'
import React, { useMemo, useState, useEffect } from 'react'

import ContentFlexsearch from './ContentFlexsearch'
import SearchHeader from './SearchHeader'
import { getFeaturedPlaceholders } from '../../helpers/findPlaceholders'
import { useMultiSelection } from '../Hooks/useMultiSelection'
import { usePapersDefinitions } from '../Hooks/usePapersDefinitions'
import FeaturedPlaceholdersList from '../Placeholders/FeaturedPlaceholdersList'
import { useSearch } from '../Search/SearchProvider'

const HomeLayout = ({ contacts, papers, konnectors }) => {
  const [selectedThemes, setSelectedThemes] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const { isMultiSelectionActive } = useMultiSelection()
  const { papersDefinitions } = usePapersDefinitions()
  const { addAllOnce } = useSearch()

  useEffect(() => {
    addAllOnce(papers.concat(contacts))
  }, [addAllOnce, contacts, papers])

  const featuredPlaceholders = useMemo(
    () =>
      getFeaturedPlaceholders({
        papersDefinitions,
        files: papers,
        selectedThemes
      }),
    [papersDefinitions, papers, selectedThemes]
  )

  return (
    <>
      {papers.length > 0 && (
        <SearchHeader
          selectedThemes={selectedThemes}
          setSelectedThemes={setSelectedThemes}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
      )}
      <ContentFlexsearch
        contacts={contacts}
        papers={papers}
        konnectors={konnectors}
        selectedThemes={selectedThemes}
        searchValue={searchValue}
      />
      {!isMultiSelectionActive && (
        <FeaturedPlaceholdersList featuredPlaceholders={featuredPlaceholders} />
      )}
    </>
  )
}

HomeLayout.propTypes = {
  contacts: PropTypes.array,
  papers: PropTypes.array,
  konnectors: PropTypes.array
}

export default HomeLayout
