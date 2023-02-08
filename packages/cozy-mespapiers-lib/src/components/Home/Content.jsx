import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import uniqBy from 'lodash/uniqBy'

import { models } from 'cozy-client'
import Empty from 'cozy-ui/transpiled/react/Empty'
import Box from 'cozy-ui/transpiled/react/Box'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import ThemesFilter from '../ThemesFilter'
import SearchInput from '../SearchInput'
import { buildFilesWithContacts } from '../Papers/helpers'
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

const {
  themes: { themesList }
} = models.document

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
  const { isMobile } = useBreakpoints()
  const { t } = useI18n()
  const scannerT = useScannerI18n()
  const { isMultiSelectionActive } = useMultiSelection()
  const { papersDefinitions } = usePapersDefinitions()
  const [isThemesFilterDisplayed, setIsThemesFilterDisplayed] = useState(
    !isMultiSelectionActive
  )

  const handleThemesFilterDisplayed = isDisplayed => {
    setIsThemesFilterDisplayed(isDisplayed)
  }

  const handleThemeSelection = nextValue => {
    setSelectedTheme(oldValue => (nextValue === oldValue ? '' : nextValue))
  }

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
