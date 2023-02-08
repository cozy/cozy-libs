import React from 'react'
import PropTypes from 'prop-types'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import { buildFilesWithContacts } from '../Papers/helpers'
import { useScannerI18n } from '../Hooks/useScannerI18n'
import SearchResult from '../SearchResult/SearchResult'
import { filterPapersByThemeAndSearchValue } from './helpers'

const HomeSearchResult = ({
  contacts,
  filesWithPapersDefinitionsLabels,
  selectedTheme,
  searchValue
}) => {
  const { t } = useI18n()
  const scannerT = useScannerI18n()

  const filesWithContacts = buildFilesWithContacts({
    files: filesWithPapersDefinitionsLabels,
    contacts,
    t
  })

  const filteredPapers = filterPapersByThemeAndSearchValue({
    files: filesWithContacts,
    theme: selectedTheme,
    search: searchValue,
    scannerT
  }).map(({ file }) => file)

  return <SearchResult filteredPapers={filteredPapers} />
}

HomeSearchResult.propTypes = {
  contacts: PropTypes.array,
  filesWithPapersDefinitionsLabels: PropTypes.array,
  selectedTheme: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  searchValue: PropTypes.string
}

export default HomeSearchResult
