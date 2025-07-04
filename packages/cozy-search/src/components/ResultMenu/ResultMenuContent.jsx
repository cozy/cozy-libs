import React, { forwardRef } from 'react'

import { useDataProxy } from 'cozy-dataproxy-lib'
import List from 'cozy-ui/transpiled/react/List'
import ListItemSkeleton from 'cozy-ui/transpiled/react/Skeletons/ListItemSkeleton'

import NoResultItem from './NoResultItem'
import NotEnoughItem from './NotEnoughItem'
import ResultMenuItem from './ResultMenuItem'
import { useSearch } from '../Search/SearchProvider'

const SearchResult = ({ onClear }) => {
  const { isLoading, results, selectedIndex, searchValue } = useSearch()

  if (isLoading && !results?.length) {
    return (
      <>
        <ListItemSkeleton hasSecondary />
        <ListItemSkeleton hasSecondary />
        <ListItemSkeleton hasSecondary />
      </>
    )
  }

  if (!isLoading && !results?.length) {
    if (searchValue.length >= 3) {
      return <NoResultItem />
    } else {
      return <NotEnoughItem />
    }
  }

  return results.map((result, idx) => (
    <ResultMenuItem
      key={result.id || idx}
      icon={result.icon}
      slug={result.slug}
      url={result.url}
      primaryText={result.primary}
      secondaryText={result.secondary}
      secondaryUrl={result.secondaryUrl}
      query={searchValue}
      highlightQuery="true"
      selected={selectedIndex === idx}
      onClear={onClear}
    />
  ))
}

const ResultMenuContent = forwardRef(({ onClear }, ref) => {
  const { dataProxyServicesAvailable } = useDataProxy()

  return (
    <List ref={ref}>
      {dataProxyServicesAvailable && <SearchResult onClear={onClear} />}
    </List>
  )
})

ResultMenuContent.displayName = 'ResultMenuContent'

export default ResultMenuContent
