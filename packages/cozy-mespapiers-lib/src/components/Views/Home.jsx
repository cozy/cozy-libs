import React, { useMemo } from 'react'

import { isQueryLoading, useQueryAll } from 'cozy-client'
import flag from 'cozy-flags'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

import {
  makePapers,
  makeQualificationLabelWithoutFiles,
  makeKonnectorsAndQualificationLabelWithoutFiles
} from './helpers'
import {
  buildContactsQueryByIds,
  buildContactsQuery,
  buildFilesQueryWithQualificationLabel,
  buildKonnectorsQueryByQualificationLabels
} from '../../helpers/queries'
import HomeLayout from '../Home/HomeLayout'
import { usePapersDefinitions } from '../Hooks/usePapersDefinitions'
import { getContactsRefIdsByFiles } from '../Papers/helpers'

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

  const contactIds = flag('mespapiers.flexsearch.enabled')
    ? null
    : getContactsRefIdsByFiles(papers)
  const contactsQuery = flag('mespapiers.flexsearch.enabled')
    ? buildContactsQuery(!isLoadingFiles)
    : buildContactsQueryByIds(contactIds, !isLoadingFiles)
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
    return (
      <Spinner
        size="xxlarge"
        className="u-flex u-flex-justify-center u-mt-2 u-h-5"
      />
    )
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
