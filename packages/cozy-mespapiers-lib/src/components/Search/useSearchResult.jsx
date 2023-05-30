import { useState, useEffect } from 'react'

import { useSearch } from './SearchProvider'
import { useMultiSelection } from '../Hooks/useMultiSelection'

const useSearchResult = ({ papers, contacts, searchValue, selectedTheme }) => {
  const { search } = useSearch()
  const { isMultiSelectionActive } = useMultiSelection()
  const [searchResult, setSearchResult] = useState({
    loading: true,
    hasResult: null,
    filteredDocs: null,
    firstSearchResultMatchingAttributes: null,
    showResultByGroup: null
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
          tag: selectedTheme?.label
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
    selectedTheme,
    isMultiSelectionActive
  ])

  return searchResult
}

export default useSearchResult
