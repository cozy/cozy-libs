import React, { useMemo, useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import flag from 'cozy-flags'

import FeaturedPlaceholdersList from '../Placeholders/FeaturedPlaceholdersList'
import { usePapersDefinitions } from '../Hooks/usePapersDefinitions'
import { useMultiSelection } from '../Hooks/useMultiSelection'
import { getFeaturedPlaceholders } from '../../helpers/findPlaceholders'
import { useSearch } from '../Contexts/SearchProvider'
import HomeToolbar from './HomeToolbar'
import SearchHeader from './SearchHeader'
import Content from './Content'

const HomeLayout = ({ contacts, papers }) => {
  const [selectedTheme, setSelectedTheme] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const { isMultiSelectionActive } = useMultiSelection()
  const { papersDefinitions } = usePapersDefinitions()
  const { add } = useSearch()

  useEffect(() => {
    if (flag('mespapiers.flexsearch.enabled')) {
      add([...contacts, ...papers])
    }
  }, [add, contacts, papers])

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
  papers: PropTypes.array
}

export default HomeLayout
