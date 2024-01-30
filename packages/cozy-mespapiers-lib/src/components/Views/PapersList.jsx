import React from 'react'
import { useParams, Navigate } from 'react-router-dom'

import { isQueryLoading, useQueryAll, useQuery } from 'cozy-client'
import { getThemeByItem } from 'cozy-client/dist/models/document/documentTypeDataHelpers'
import flag from 'cozy-flags'
import ListSkeleton from 'cozy-ui/transpiled/react/Skeletons/ListSkeleton'

import { makeAccountsByFiles } from './helpers'
import {
  buildContactsQueryByIds,
  buildFilesQueryByLabel,
  buildKonnectorsQueryByQualificationLabel,
  buildAccountsQueryBySlugs
} from '../../helpers/queries'
import { useMultiSelection } from '../Hooks/useMultiSelection'
import Empty from '../Papers/Empty/Empty'
import PapersListByContact from '../Papers/PapersListByContact'
import PapersListToolbar from '../Papers/PapersListToolbar'
import {
  getContactsRefIdsByFiles,
  getCurrentQualificationLabel
} from '../Papers/helpers'

const ConditionnalPapersList = props => {
  const params = useParams()

  if (
    flag('hide.healthTheme.enabled') &&
    getThemeByItem({ label: params.qualificationLabel })?.label === 'health'
  ) {
    return <Navigate replace to="/paper" />
  }

  return <PapersList {...props} />
}

const PapersList = () => {
  const params = useParams()

  const { selectedQualificationLabel } = useMultiSelection()

  const currentQualificationLabel = getCurrentQualificationLabel(
    params,
    selectedQualificationLabel
  )
  const filesQueryByLabel = buildFilesQueryByLabel(currentQualificationLabel)
  const { data: files, ...fileQueryResult } = useQueryAll(
    filesQueryByLabel.definition,
    filesQueryByLabel.options
  )
  const isLoadingFiles =
    isQueryLoading(fileQueryResult) || fileQueryResult.hasMore
  const hasFiles = files?.length > 0

  const contactIds = getContactsRefIdsByFiles(files)
  const contactsQueryByIds = buildContactsQueryByIds(
    contactIds,
    !isLoadingFiles
  )
  const { data: contacts, ...contactQueryResult } = useQueryAll(
    contactsQueryByIds.definition,
    contactsQueryByIds.options
  )
  const isLoadingContacts =
    isQueryLoading(contactQueryResult) || contactQueryResult.hasMore

  const queryKonnector = buildKonnectorsQueryByQualificationLabel(
    currentQualificationLabel
  )
  const { data: konnectors, ...konnectorsQueryLeft } = useQuery(
    queryKonnector.definition,
    queryKonnector.options
  )
  const isKonnectorsLoading = isQueryLoading(konnectorsQueryLeft)
  const hasKonnector = konnectors?.length > 0
  const konnectorSlugs = konnectors?.map(konnector => konnector.slug)

  const queryAccounts = buildAccountsQueryBySlugs(konnectorSlugs, hasKonnector)
  const { data: accounts, ...accountsQueryLeft } = useQuery(
    queryAccounts.definition,
    queryAccounts.options
  )
  const isAccountsLoading = hasKonnector && isQueryLoading(accountsQueryLeft)

  const { accountsWithFiles, accountsWithoutFiles } = makeAccountsByFiles(
    accounts,
    files
  )

  const isLoading =
    isLoadingFiles ||
    isLoadingContacts ||
    isKonnectorsLoading ||
    isAccountsLoading

  return (
    <>
      <PapersListToolbar
        selectedQualificationLabel={selectedQualificationLabel}
      />
      {isLoading ? (
        <ListSkeleton count={6} />
      ) : (
        <>
          {hasFiles && (
            <PapersListByContact
              selectedQualificationLabel={selectedQualificationLabel}
              files={files}
              contacts={contacts}
              konnectors={konnectors}
              accounts={{ accountsWithFiles, accountsWithoutFiles }}
            />
          )}
          {accountsWithoutFiles.length > 0 && (
            <Empty
              hasFiles={hasFiles}
              konnectors={konnectors}
              accountsByFiles={{ accountsWithFiles, accountsWithoutFiles }}
            />
          )}
        </>
      )}
    </>
  )
}

export default ConditionnalPapersList
