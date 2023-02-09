import React from 'react'
import PropTypes from 'prop-types'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Empty from 'cozy-ui/transpiled/react/Empty'

import HomeCloud from '../../assets/icons/HomeCloud.svg'
import { buildFilesWithContacts } from '../Papers/helpers'
import { useScannerI18n } from '../Hooks/useScannerI18n'
import SearchResult from '../SearchResult/SearchResult'
import { filterPapersByThemeAndSearchValue } from './helpers'

const ResultForSearch = ({ contacts, papers, selectedTheme, searchValue }) => {
  const { t } = useI18n()
  const scannerT = useScannerI18n()

  const filesWithContacts = buildFilesWithContacts({
    files: papers,
    contacts,
    t
  })

  const filteredPapers = filterPapersByThemeAndSearchValue({
    files: filesWithContacts,
    theme: selectedTheme,
    search: searchValue,
    scannerT
  })

  if (filteredPapers.length === 0) {
    return (
      <Empty
        className="u-ph-1"
        icon={HomeCloud}
        iconSize="large"
        title={t('Search.empty.title')}
        text={t('Search.empty.text')}
      />
    )
  }

  return <SearchResult filteredPapers={filteredPapers} />
}

ResultForSearch.propTypes = {
  contacts: PropTypes.array,
  papers: PropTypes.array,
  selectedTheme: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  searchValue: PropTypes.string
}

export default ResultForSearch
