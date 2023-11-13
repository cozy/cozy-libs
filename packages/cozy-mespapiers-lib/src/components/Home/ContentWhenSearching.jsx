import PropTypes from 'prop-types'
import React from 'react'

import Empty from 'cozy-ui/transpiled/react/Empty'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
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
  selectedTheme
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
    selectedTheme
  })

  if (loading) {
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
