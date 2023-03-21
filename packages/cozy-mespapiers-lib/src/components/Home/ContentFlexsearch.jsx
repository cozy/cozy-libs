import uniqBy from 'lodash/uniqBy'
import PropTypes from 'prop-types'
import React, { useMemo } from 'react'

import Empty from 'cozy-ui/transpiled/react/Empty'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import HomeCloud from '../../assets/icons/HomeCloud.svg'
import SearchEmpty from '../../assets/icons/SearchEmpty.svg'
import { useMultiSelection } from '../Hooks/useMultiSelection'
import PaperGroup from '../Papers/PaperGroup'
import { useSearch } from '../Search/SearchProvider'
import FlexsearchResult from '../SearchResult/FlexsearchResult'

const ContentFlexsearch = ({
  contacts,
  papers,
  konnectors,
  selectedTheme,
  searchValue
}) => {
  const { t } = useI18n()
  const { search } = useSearch()
  const { isMultiSelectionActive } = useMultiSelection()

  const isSearching = searchValue.length > 0 || Boolean(selectedTheme)
  const showListByGroup = searchValue?.length === 0
  const allDocs = useMemo(() => papers.concat(contacts), [papers, contacts])
  const docsToBeSearched = isMultiSelectionActive ? papers : allDocs
  const papersByCategories = useMemo(
    () => uniqBy(papers, 'metadata.qualification.label'),
    [papers]
  )
  const { filteredDocs, firstSearchResultMatchingAttributes } = isSearching
    ? search({
        docs: docsToBeSearched,
        value: searchValue,
        tag: selectedTheme?.label
      })
    : {}

  const hasDocs = allDocs?.length > 0
  const hasSearchResult = filteredDocs?.length > 0

  if (!hasDocs && !isSearching) {
    return (
      <Empty
        className="u-ph-1"
        icon={HomeCloud}
        iconSize="large"
        title={t('Home.Empty.title')}
        text={t('Home.Empty.text')}
      />
    )
  }

  if (!hasSearchResult && isSearching) {
    return (
      <Empty
        className="u-ph-1"
        icon={SearchEmpty}
        iconSize="large"
        title={t('Search.empty.title')}
        text={t('Search.empty.text')}
      />
    )
  }

  if (showListByGroup) {
    return (
      <PaperGroup
        papersByCategories={papersByCategories}
        konnectors={konnectors}
      />
    )
  }

  return (
    <FlexsearchResult
      filteredDocs={filteredDocs}
      firstSearchResultMatchingAttributes={firstSearchResultMatchingAttributes}
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
