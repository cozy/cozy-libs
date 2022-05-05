import React, { useMemo, useState } from 'react'
import uniqBy from 'lodash/uniqBy'

import { isQueryLoading, useQueryAll, models } from 'cozy-client'
import Empty from 'cozy-ui/transpiled/react/Empty'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import Box from 'cozy-ui/transpiled/react/Box'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import ThemesFilter from '../ThemesFilter'
import SearchInput from '../SearchInput'
import PaperGroup from '../Papers/PaperGroup'
import FeaturedPlaceholdersList from '../Placeholders/FeaturedPlaceholdersList'
import { usePapersDefinitions } from '../Hooks/usePapersDefinitions'
import { buildFilesQueryByLabels } from '../../helpers/queries'
import { getFeaturedPlaceholders } from '../../helpers/findPlaceholders'
import HomeCloud from '../../assets/icons/HomeCloud.svg'
import { useScannerI18n } from '../Hooks/useScannerI18n'
import { filterPapersByThemeAndSearchValue } from './helpers'

const {
  themes: { themesList }
} = models.document

const Home = () => {
  const [searchValue, setSearchValue] = useState('')
  const [selectedTheme, setSelectedTheme] = useState('')
  const { t } = useI18n()
  const scannerT = useScannerI18n()
  const { papersDefinitions } = usePapersDefinitions()
  const labels = papersDefinitions.map(paper => paper.label)
  const filesQueryByLabels = buildFilesQueryByLabels(labels)

  const { data: filesByLabels, ...queryResult } = useQueryAll(
    filesQueryByLabels.definition,
    filesQueryByLabels.options
  )

  const isLoading = isQueryLoading(queryResult) || queryResult.hasMore

  const allPapersByCategories = useMemo(
    () => uniqBy(filesByLabels, 'metadata.qualification.label'),
    [filesByLabels]
  )

  const filteredPapers = filterPapersByThemeAndSearchValue({
    files: allPapersByCategories,
    theme: selectedTheme,
    search: searchValue,
    scannerT
  })

  const featuredPlaceholders = useMemo(
    () =>
      getFeaturedPlaceholders({
        papersDefinitions,
        files: filesByLabels,
        selectedTheme
      }),
    [papersDefinitions, filesByLabels, selectedTheme]
  )

  const handleThemeSelection = nextValue => {
    setSelectedTheme(oldValue => (nextValue === oldValue ? '' : nextValue))
  }

  if (isLoading) {
    return (
      <Spinner
        size="xxlarge"
        className="u-flex u-flex-justify-center u-mt-2 u-h-5"
      />
    )
  }

  return (
    <>
      <div className="u-flex u-flex-column-s u-mv-1 u-ph-1">
        <Box className="u-flex u-flex-items-center u-mb-half-s" flex="1 1 auto">
          <SearchInput setSearchValue={setSearchValue} />
        </Box>
        <Box className="u-flex u-flex-justify-center" flexWrap="wrap">
          <ThemesFilter
            items={themesList}
            selectedTheme={selectedTheme}
            handleThemeSelection={handleThemeSelection}
          />
        </Box>
      </div>
      {allPapersByCategories.length === 0 ? (
        <Empty
          icon={HomeCloud}
          iconSize={'large'}
          title={t('Home.Empty.title')}
          text={t('Home.Empty.text')}
          className={'u-ph-1'}
        />
      ) : (
        <PaperGroup allPapersByCategories={filteredPapers} />
      )}
      <FeaturedPlaceholdersList featuredPlaceholders={featuredPlaceholders} />
    </>
  )
}

export default Home
