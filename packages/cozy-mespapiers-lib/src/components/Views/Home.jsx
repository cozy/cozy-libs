import React, { useMemo } from 'react'

import { isQueryLoading, useQueryAll } from 'cozy-client'

import HomeSkeletons from './HomeSkeletons'
import {
  makePapers,
  makeQualificationLabelWithoutFiles,
  makeKonnectorsAndQualificationLabelWithoutFiles
} from './helpers'
import {
  buildContactsQuery,
  buildFilesQueryWithQualificationLabel,
  buildKonnectorsQueryByQualificationLabels
} from '../../helpers/queries'
import HomeLayout from '../Home/HomeLayout'
import { usePapersDefinitions } from '../Hooks/usePapersDefinitions'

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

  const contactsQuery = buildContactsQuery(!isLoadingFiles)
  const { data: contacts, ...contactQueryResult } = useQueryAll(
    contactsQuery.definition,
    contactsQuery.options
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
    return <HomeSkeletons withFabs data-testid="HomeSkeletons" />
  }

  const konnectorsAndQualificationLabelWithoutFiles =
    makeKonnectorsAndQualificationLabelWithoutFiles(
      konnectors,
      qualificationLabelWithoutFiles
    )

  return (
    <HomeLayout
      contacts={contacts}
      papers={papers}
      konnectors={konnectorsAndQualificationLabelWithoutFiles}
    />
  )
}

export default Home
