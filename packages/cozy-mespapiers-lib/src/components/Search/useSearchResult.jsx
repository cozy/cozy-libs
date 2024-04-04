import { useState, useEffect } from 'react'

import { useSearch } from './SearchProvider'
import { useMultiSelection } from '../Hooks/useMultiSelection'

/**
 * @param {Object} params
 * @param {import('cozy-client/types/types').IOCozyFile[]} params.papers
 * @param {object[]} params.contacts
 * @param {string} params.searchValue
 * @param {import('cozy-client/types/types').Theme[]} params.selectedThemes
 * @returns {import('../../types').SearchResult} Result of the search
 */
const useSearchResult = ({ papers, contacts, searchValue, selectedThemes }) => {
  const { search } = useSearch()
  const { isMultiSelectionActive } = useMultiSelection()
  const [searchResult, setSearchResult] = useState({
    loading: true,
    hasResult: null,
    filteredDocs: null,
    firstSearchResultMatchingAttributes: null,
    showResultByGroup: false
  })

  useEffect(() => {
    setSearchResult(state => ({
      ...state,
      loading: true
    }))

    const asyncFn = async () => {
      const allDocs = papers.concat(contacts)
      const showResultByGroup = searchValue?.length === 0
      const docsToBeSearched =
        isMultiSelectionActive || showResultByGroup ? papers : allDocs

      const { filteredDocs, firstSearchResultMatchingAttributes } =
        await search({
          docs: docsToBeSearched,
          value: searchValue,
          tag: selectedThemes.map(selectedTheme => selectedTheme.label)
        })

      const hasResult = filteredDocs?.length > 0

      setSearchResult({
        loading: false,
        hasResult,
        filteredDocs,
        firstSearchResultMatchingAttributes,
        showResultByGroup
      })
    }

    asyncFn()
  }, [
    papers,
    contacts,
    search,
    searchValue,
    selectedThemes,
    isMultiSelectionActive
  ])

  return searchResult
}

export default useSearchResult
