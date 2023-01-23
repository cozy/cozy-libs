import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import uniqBy from 'lodash/uniqBy'

import { isQueryLoading, useQueryAll, models } from 'cozy-client'
import Empty from 'cozy-ui/transpiled/react/Empty'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import Box from 'cozy-ui/transpiled/react/Box'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import ThemesFilter from '../ThemesFilter'
import SearchInput from '../SearchInput'
import {
  buildContactsQueryByIds,
  buildFilesQueryWithQualificationLabel
} from '../../helpers/queries'
import {
  buildFilesWithContacts,
  getContactsRefIdsByFiles
} from '../Papers/helpers'
import PaperGroup from '../Papers/PaperGroup'
import FeaturedPlaceholdersList from '../Placeholders/FeaturedPlaceholdersList'
import { usePapersDefinitions } from '../Hooks/usePapersDefinitions'
import { useScannerI18n } from '../Hooks/useScannerI18n'
import { useMultiSelection } from '../Hooks/useMultiSelection'
import { getFeaturedPlaceholders } from '../../helpers/findPlaceholders'
import HomeCloud from '../../assets/icons/HomeCloud.svg'
import SearchResult from '../SearchResult/SearchResult'

import { filterPapersByThemeAndSearchValue } from '../Home/helpers'
import HomeToolbar from '../Home/HomeToolbar'
import FilterButton from '../Home/FilterButton'
import { Outlet } from 'react-router-dom'

const {
  themes: { themesList }
} = models.document

const Home = ({ setSelectedThemeLabel }) => {
  const { isMultiSelectionActive } = useMultiSelection()
  const { isMobile } = useBreakpoints()
  const [searchValue, setSearchValue] = useState('')
  const [isThemesFilterDisplayed, setIsThemesFilterDisplayed] = useState(
    !isMultiSelectionActive
  )
  const [selectedTheme, setSelectedTheme] = useState('')
  const { t } = useI18n()
  const scannerT = useScannerI18n()
  const { papersDefinitions } = usePapersDefinitions()

  const papersDefinitionsLabels = useMemo(
    () => papersDefinitions.map(paper => paper.label),
    [papersDefinitions]
  )
  const filesQueryByLabels = buildFilesQueryWithQualificationLabel()

  const { data: filesWithQualificationLabel, ...queryResult } = useQueryAll(
    filesQueryByLabels.definition,
    filesQueryByLabels.options
  )

  const filesWithPapersDefinitionsLabels = useMemo(
    () =>
      filesWithQualificationLabel?.filter(file =>
        papersDefinitionsLabels.includes(file?.metadata?.qualification?.label)
      ) || [],
    [filesWithQualificationLabel, papersDefinitionsLabels]
  )

  const isLoadingFiles = isQueryLoading(queryResult) || queryResult.hasMore
  const isSearching = searchValue.length > 0 || !!selectedTheme

  const allPapersByCategories = useMemo(
    () =>
      uniqBy(filesWithPapersDefinitionsLabels, 'metadata.qualification.label'),
    [filesWithPapersDefinitionsLabels]
  )

  const contactIds = getContactsRefIdsByFiles(filesWithPapersDefinitionsLabels)

  const contactsQueryByIds = buildContactsQueryByIds(contactIds)
  const { data: contacts, ...contactQueryResult } = useQueryAll(
    contactsQueryByIds.definition,
    {
      ...contactsQueryByIds.options,
      enabled: isSearching && !isLoadingFiles
    }
  )

  const isLoadingContacts =
    isQueryLoading(contactQueryResult) || contactQueryResult.hasMore

  const filesWithContacts =
    isSearching && !isLoadingFiles && !isLoadingContacts
      ? buildFilesWithContacts({
          files: filesWithPapersDefinitionsLabels,
          contacts,
          t
        })
      : []

  const filteredPapers = filterPapersByThemeAndSearchValue({
    files: isSearching
      ? filesWithContacts
      : allPapersByCategories.map(file => ({ file })),
    theme: selectedTheme,
    search: searchValue,
    scannerT
  }).map(({ file }) => file)

  const featuredPlaceholders = useMemo(
    () =>
      getFeaturedPlaceholders({
        papersDefinitions,
        files: filesWithPapersDefinitionsLabels,
        selectedTheme
      }),
    [papersDefinitions, filesWithPapersDefinitionsLabels, selectedTheme]
  )

  const handleThemeSelection = nextValue => {
    setSelectedTheme(oldValue => (nextValue === oldValue ? '' : nextValue))
  }

  const handleThemesFilterDisplayed = isDisplayed => {
    setIsThemesFilterDisplayed(isDisplayed)
  }

  if (isLoadingFiles || (isSearching && isLoadingContacts)) {
    return (
      <Spinner
        size="xxlarge"
        className="u-flex u-flex-justify-center u-mt-2 u-h-5"
      />
    )
  }

  return (
    <>
      {isMultiSelectionActive && <HomeToolbar />}

      <div className="u-flex u-flex-column-s u-mv-1 u-ph-half">
        <Box className="u-flex u-flex-items-center u-mb-half-s" flex="1 1 auto">
          <SearchInput
            value={searchValue}
            onChange={ev => setSearchValue(ev.target.value)}
            onFocus={() => handleThemesFilterDisplayed(false)}
          />
          {(!isThemesFilterDisplayed || isMobile) && (
            <FilterButton
              badge={{
                active: !isThemesFilterDisplayed,
                content: selectedTheme ? 1 : 0
              }}
              onClick={() => handleThemesFilterDisplayed(prev => !prev)}
            />
          )}
        </Box>
        <Box className="u-flex u-flex-justify-center" flexWrap="wrap">
          {isThemesFilterDisplayed && (
            <ThemesFilter
              items={themesList}
              selectedTheme={selectedTheme}
              handleThemeSelection={handleThemeSelection}
            />
          )}
        </Box>
      </div>

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

      <Outlet />
    </>
  )
}

Home.propTypes = {
  setSelectedThemeLabel: PropTypes.func
}

export default Home
