import uniqBy from 'lodash/uniqBy'
import PropTypes from 'prop-types'
import React, { useMemo } from 'react'

import Empty from 'cozy-ui/transpiled/react/Empty'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import SearchEmpty from '../../assets/icons/SearchEmpty.svg'
import { useMultiSelection } from '../Hooks/useMultiSelection'
import PaperGroup from '../Papers/PaperGroup'
import { useSearch } from '../Search/SearchProvider'
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
  const { search } = useSearch()

  const allDocs = useMemo(() => papers.concat(contacts), [papers, contacts])
  const showResultByGroup = searchValue?.length === 0
  const docsToBeSearched =
    isMultiSelectionActive || showResultByGroup ? papers : allDocs

  const { filteredDocs, firstSearchResultMatchingAttributes } = search({
    docs: docsToBeSearched,
    value: searchValue,
    tag: selectedTheme?.label
  })
  const hasResult = filteredDocs?.length > 0
  const papersByCategories = useMemo(
    () => uniqBy(filteredDocs, 'metadata.qualification.label'),
    [filteredDocs]
  )

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

ContentWhenSearching.propTypes = {
  contacts: PropTypes.array,
  papers: PropTypes.array,
  konnectors: PropTypes.array,
  selectedTheme: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  searchValue: PropTypes.string
}

export default ContentWhenSearching
