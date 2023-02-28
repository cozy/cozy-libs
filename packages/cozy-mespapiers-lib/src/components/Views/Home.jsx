import React, { useMemo } from 'react'

import { isQueryLoading, useQueryAll } from 'cozy-client'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

import {
  buildContactsQueryByIds,
  buildFilesQueryWithQualificationLabel,
  buildKonnectorsQueryByQualificationLabels
} from '../../helpers/queries'
import { getContactsRefIdsByFiles } from '../Papers/helpers'
import { usePapersDefinitions } from '../Hooks/usePapersDefinitions'
import HomeLayout from '../Home/HomeLayout'
import { makePapers, makeQualificationLabelWithoutFiles } from './helpers'

const Home = () => {
  const { papersDefinitions } = usePapersDefinitions()

  const papersDefinitionsLabels = useMemo(
    () => papersDefinitions.map(paperDefinition => paperDefinition.label),
    [papersDefinitions]
  )

  const filesQueryByLabels = buildFilesQueryWithQualificationLabel()
  const { data: filesWithQualificationLabel, ...queryResult } = useQueryAll(
    filesQueryByLabels.definition,
    filesQueryByLabels.options
  )
  const isLoadingFiles = isQueryLoading(queryResult) || queryResult.hasMore

  const papers = useMemo(
    () => makePapers(papersDefinitionsLabels, filesWithQualificationLabel),
    [papersDefinitionsLabels, filesWithQualificationLabel]
  )

  const contactIds = getContactsRefIdsByFiles(papers)
  const contactsQueryByIds = buildContactsQueryByIds(contactIds)
  const { data: contacts, ...contactQueryResult } = useQueryAll(
    contactsQueryByIds.definition,
    {
      ...contactsQueryByIds.options,
      enabled: !isLoadingFiles
    }
  )
  const isLoadingContacts =
    isQueryLoading(contactQueryResult) || contactQueryResult.hasMore

  const qualificationLabelWithoutFiles = useMemo(
    () => makeQualificationLabelWithoutFiles(papersDefinitionsLabels, papers),
    [papersDefinitionsLabels, papers]
  )
  const konnectorsQueryByQualificationLabels =
    buildKonnectorsQueryByQualificationLabels(qualificationLabelWithoutFiles)
  const { data: konnectors, ...konnectorsQueryResult } = useQueryAll(
    konnectorsQueryByQualificationLabels.definition,
    konnectorsQueryByQualificationLabels.options
  )
  const isLoadingKonnectors =
    isQueryLoading(konnectorsQueryResult) || konnectorsQueryResult.hasMore

  if (isLoadingFiles || isLoadingContacts || isLoadingKonnectors) {
    return (
      <Spinner
        size="xxlarge"
        className="u-flex u-flex-justify-center u-mt-2 u-h-5"
      />
    )
  }

  return (
    <HomeLayout contacts={contacts} papers={papers} konnectors={konnectors} />
  )
}

export default Home
