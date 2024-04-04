import PropTypes from 'prop-types'
import React from 'react'

import Empty from 'cozy-ui/transpiled/react/Empty'
import ListSkeleton from 'cozy-ui/transpiled/react/Skeletons/ListSkeleton'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { makePapersGroupByQualificationLabel } from './helpers'
import SearchEmpty from '../../assets/icons/SearchEmpty.svg'
import PaperGroup from '../Papers/PaperGroup'
import useSearchResult from '../Search/useSearchResult'
import FlexsearchResult from '../SearchResult/FlexsearchResult'

const ContentWhenSearching = ({
  papers,
  contacts,
  konnectors,
  searchValue,
  selectedThemes
}) => {
  const { t } = useI18n()

  const {
    loading,
    hasResult,
    filteredDocs,
    firstSearchResultMatchingAttributes,
    showResultByGroup
  } = useSearchResult({
    papers,
    contacts,
    searchValue,
    selectedThemes
  })

  if (loading) {
    return <ListSkeleton count={6} />
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
        selectedThemes={selectedThemes}
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
  selectedThemes: PropTypes.arrayOf(PropTypes.object),
  searchValue: PropTypes.string
}

export default ContentWhenSearching
