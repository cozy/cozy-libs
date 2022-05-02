import React, { useMemo, useState } from 'react'
import uniqBy from 'lodash/uniqBy'

import { isQueryLoading, useQueryAll, models } from 'cozy-client'
import Empty from 'cozy-ui/transpiled/react/Empty'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import ThemesFilter from '../ThemesFilter'
import PaperGroup from '../Papers/PaperGroup'
import FeaturedPlaceholdersList from '../Placeholders/FeaturedPlaceholdersList'
import { usePapersDefinitions } from '../Hooks/usePapersDefinitions'
import { buildFilesQueryByLabels } from '../../helpers/queries'
import { getFeaturedPlaceholders } from '../../helpers/findPlaceholders'
import HomeCloud from '../../assets/icons/HomeCloud.svg'
import { filterPapersByTheme } from './helpers'

const {
  themes: { themesList }
} = models.document

const Home = () => {
  const [selectedTheme, setSelectedTheme] = useState('')
  const { t } = useI18n()
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

  const filteredPapersByTheme = filterPapersByTheme(
    allPapersByCategories,
    selectedTheme
  )

  const featuredPlaceholders = useMemo(
    () => getFeaturedPlaceholders(papersDefinitions, filesByLabels),
    [papersDefinitions, filesByLabels]
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
      <ThemesFilter
        items={themesList}
        selectedTheme={selectedTheme}
        handleThemeSelection={handleThemeSelection}
      />
      {allPapersByCategories.length === 0 ? (
        <Empty
          icon={HomeCloud}
          iconSize={'large'}
          title={t('Home.Empty.title')}
          text={t('Home.Empty.text')}
          className={'u-ph-1'}
        />
      ) : (
        <PaperGroup allPapersByCategories={filteredPapersByTheme} />
      )}
      <FeaturedPlaceholdersList featuredPlaceholders={featuredPlaceholders} />
    </>
  )
}

export default Home
