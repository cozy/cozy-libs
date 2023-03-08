import PropTypes from 'prop-types'
import React, { useMemo, useState, useEffect } from 'react'

import flag from 'cozy-flags'

import Content from './Content'
import HomeToolbar from './HomeToolbar'
import SearchHeader from './SearchHeader'
import { getFeaturedPlaceholders } from '../../helpers/findPlaceholders'
import { useMultiSelection } from '../Hooks/useMultiSelection'
import { usePapersDefinitions } from '../Hooks/usePapersDefinitions'
import FeaturedPlaceholdersList from '../Placeholders/FeaturedPlaceholdersList'
import { useSearch } from '../Search/SearchProvider'

const HomeLayout = ({ contacts, papers, konnectors }) => {
  const [selectedTheme, setSelectedTheme] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const { isMultiSelectionActive } = useMultiSelection()
  const { papersDefinitions } = usePapersDefinitions()
  const { addAllOnce } = useSearch()

  useEffect(() => {
    if (flag('mespapiers.flexsearch.enabled')) {
      addAllOnce([...contacts, ...papers])
    }
  }, [addAllOnce, contacts, papers])

  const featuredPlaceholders = useMemo(
    () =>
      getFeaturedPlaceholders({
        papersDefinitions,
        files: papers,
        selectedTheme
      }),
    [papersDefinitions, papers, selectedTheme]
  )

  return (
    <>
      {isMultiSelectionActive && <HomeToolbar />}
      <SearchHeader
        selectedTheme={selectedTheme}
        setSelectedTheme={setSelectedTheme}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
      />
      <Content
        contacts={contacts}
        papers={papers}
        konnectors={konnectors}
        selectedTheme={selectedTheme}
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
