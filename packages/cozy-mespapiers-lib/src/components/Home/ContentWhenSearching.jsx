import PropTypes from 'prop-types'
import React, { useMemo } from 'react'

import Empty from 'cozy-ui/transpiled/react/Empty'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

import { makePapersGroupByQualificationLabel } from './helpers'
import SearchEmpty from '../../assets/icons/SearchEmpty.svg'
import { useMultiSelection } from '../Hooks/useMultiSelection'
import PaperGroup from '../Papers/PaperGroup'
import useSearchResult from '../Search/useSearchResult'
import FlexsearchResult from '../SearchResult/FlexsearchResult'

const ContentWhenSearching = ({
  papers,
  contacts,
  konnectors,
  searchValue,
  selectedTheme
}) => {
  const { t } = useI18n()
  const { isMultiSelectionActive } = useMultiSelection()

  const allDocs = useMemo(() => papers.concat(contacts), [papers, contacts])
  const showResultByGroup = searchValue?.length === 0
  const docsToBeSearched =
    isMultiSelectionActive || showResultByGroup ? papers : allDocs

  const {
    pending,
    hasResult,
    filteredDocs,
    firstSearchResultMatchingAttributes
  } = useSearchResult({
    docsToBeSearched,
    searchValue,
    selectedTheme
  })

  if (pending) {
    return (
      <Spinner
        size="xxlarge"
        className="u-flex u-flex-justify-center u-mt-2 u-h-5"
      />
    )
  }

  if (!hasResult) {
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

  if (showResultByGroup) {
    const papersByCategories = makePapersGroupByQualificationLabel(filteredDocs)

    return (
      <PaperGroup
        papersByCategories={papersByCategories}
        konnectors={konnectors}
        selectedTheme={selectedTheme}
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

ContentWhenSearching.propTypes = {
  contacts: PropTypes.array,
  papers: PropTypes.array,
  konnectors: PropTypes.array,
  selectedTheme: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  searchValue: PropTypes.string
}

export default ContentWhenSearching
