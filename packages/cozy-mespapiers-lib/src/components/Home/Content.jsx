import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import uniqBy from 'lodash/uniqBy'

import Empty from 'cozy-ui/transpiled/react/Empty'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import { buildFilesWithContacts } from '../Papers/helpers'
import PaperGroup from '../Papers/PaperGroup'
import FeaturedPlaceholdersList from '../Placeholders/FeaturedPlaceholdersList'
import { usePapersDefinitions } from '../Hooks/usePapersDefinitions'
import { useScannerI18n } from '../Hooks/useScannerI18n'
import { useMultiSelection } from '../Hooks/useMultiSelection'
import { getFeaturedPlaceholders } from '../../helpers/findPlaceholders'
import HomeCloud from '../../assets/icons/HomeCloud.svg'
import SearchResult from '../SearchResult/SearchResult'
import { filterPapersByThemeAndSearchValue } from './helpers'
import HomeToolbar from './HomeToolbar'
import SearchHeader from './SearchHeader'

const Content = ({
  contacts,
  filesWithPapersDefinitionsLabels,
  isSearching,
  selectedTheme,
  setSelectedTheme,
  setSelectedThemeLabel,
  searchValue,
  setSearchValue
}) => {
  const { t } = useI18n()
  const scannerT = useScannerI18n()
  const { isMultiSelectionActive } = useMultiSelection()
  const { papersDefinitions } = usePapersDefinitions()

  const allPapersByCategories = useMemo(
    () =>
      uniqBy(filesWithPapersDefinitionsLabels, 'metadata.qualification.label'),
    [filesWithPapersDefinitionsLabels]
  )

  const filesWithContacts = isSearching
    ? buildFilesWithContacts({
        files: filesWithPapersDefinitionsLabels,
        contacts,
        t
      })
    : []

  const featuredPlaceholders = useMemo(
    () =>
      getFeaturedPlaceholders({
        papersDefinitions,
        files: filesWithPapersDefinitionsLabels,
        selectedTheme
      }),
    [papersDefinitions, filesWithPapersDefinitionsLabels, selectedTheme]
  )

  const filteredPapers = filterPapersByThemeAndSearchValue({
    files: isSearching
      ? filesWithContacts
      : allPapersByCategories.map(file => ({ file })),
    theme: selectedTheme,
    search: searchValue,
    scannerT
  }).map(({ file }) => file)

  return (
    <>
      {isMultiSelectionActive && <HomeToolbar />}
      <SearchHeader
        selectedTheme={selectedTheme}
        setSelectedTheme={setSelectedTheme}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
      />
      {allPapersByCategories.length > 0 ? (
        !isSearching ? (
          <PaperGroup
            allPapersByCategories={filteredPapers}
            setSelectedThemeLabel={setSelectedThemeLabel}
          />
        ) : (
          <SearchResult filteredPapers={filteredPapers} />
        )
      ) : (
        <Empty
          icon={HomeCloud}
          iconSize="large"
          title={t('Home.Empty.title')}
          text={t('Home.Empty.text')}
          className="u-ph-1"
        />
      )}
      {!isMultiSelectionActive && (
        <FeaturedPlaceholdersList featuredPlaceholders={featuredPlaceholders} />
      )}
    </>
  )
}

Content.propTypes = {
  contacts: PropTypes.array,
  filesWithPapersDefinitionsLabels: PropTypes.array,
  isSearching: PropTypes.bool,
  selectedTheme: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  setSelectedTheme: PropTypes.func,
  setSelectedThemeLabel: PropTypes.string,
  searchValue: PropTypes.string,
  setSearchValue: PropTypes.func
}

export default Content
