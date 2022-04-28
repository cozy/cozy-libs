import React, { useMemo } from 'react'
import uniqBy from 'lodash/uniqBy'

import { isQueryLoading, useQuery } from 'cozy-client'
import Empty from 'cozy-ui/transpiled/react/Empty'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import PaperGroup from '../Papers/PaperGroup'
import FeaturedPlaceholdersList from '../Placeholders/FeaturedPlaceholdersList'
import { buildFilesQueryByLabels } from '../../helpers/queries'
import { usePapersDefinitions } from '../Hooks/usePapersDefinitions'
import { getFeaturedPlaceholders } from '../../helpers/findPlaceholders'
import HomeCloud from '../../assets/icons/HomeCloud.svg'

const Home = () => {
  const { t } = useI18n()
  const { papersDefinitions } = usePapersDefinitions()
  const labels = papersDefinitions.map(paper => paper.label)
  const filesQueryByLabels = buildFilesQueryByLabels(labels)

  const {
    data: filesByLabels,
    hasMore,
    fetchMore,
    ...queryResult
  } = useQuery(filesQueryByLabels.definition, filesQueryByLabels.options)

  const isLoading = isQueryLoading(queryResult) || hasMore

  const allPapersByCategories = useMemo(
    () => uniqBy(filesByLabels, 'metadata.qualification.label'),
    [filesByLabels]
  )

  const featuredPlaceholders = useMemo(
    () => getFeaturedPlaceholders(papersDefinitions, filesByLabels),
    [papersDefinitions, filesByLabels]
  )

  if (hasMore) fetchMore()

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
      {allPapersByCategories.length === 0 ? (
        <Empty
          icon={HomeCloud}
          iconSize={'large'}
          title={t('Home.Empty.title')}
          text={t('Home.Empty.text')}
          className={'u-ph-1'}
        />
      ) : (
        <PaperGroup allPapersByCategories={allPapersByCategories} />
      )}
      <FeaturedPlaceholdersList featuredPlaceholders={featuredPlaceholders} />
    </>
  )
}

export default Home
