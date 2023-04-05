import { useState, useEffect } from 'react'

import { useSearch } from './SearchProvider'

const useSearchResult = ({ docsToBeSearched, searchValue, selectedTheme }) => {
  const { search } = useSearch()
  const [searchResult, setSearchResult] = useState({
    pending: true,
    hasResult: null,
    filteredDocs: null,
    firstSearchResultMatchingAttributes: null
  })

  useEffect(() => {
    const asyncFn = async () => {
      const { filteredDocs, firstSearchResultMatchingAttributes } =
        await search({
          docs: docsToBeSearched,
          value: searchValue,
          tag: selectedTheme?.label
        })

      const hasResult = filteredDocs?.length > 0

      setSearchResult({
        pending: false,
        hasResult,
        filteredDocs,
        firstSearchResultMatchingAttributes
      })
    }

    asyncFn()
  }, [docsToBeSearched, search, searchValue, selectedTheme])

  return searchResult
}

export default useSearchResult
