import React from 'react'
import { useParams, Navigate } from 'react-router-dom'

import { isQueryLoading, useQueryAll, useQuery } from 'cozy-client'
import { getThemeByItem } from 'cozy-client/dist/models/document/documentTypeDataHelpers'
import flag from 'cozy-flags'
import { Spinner } from 'cozy-ui/transpiled/react/Spinner'

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
  getCurrentFileTheme
} from '../Papers/helpers'

const ConditionnalPapersList = props => {
  const params = useParams()

  if (
    flag('hide.healthTheme.enabled') &&
    getThemeByItem({ label: params.fileTheme })?.label === 'health'
  ) {
    return <Navigate replace to="/paper" />
  }

  return <PapersList {...props} />
}

const PapersList = () => {
  const params = useParams()

  const { selectedThemeLabel } = useMultiSelection()

  const currentFileTheme = getCurrentFileTheme(params, selectedThemeLabel)
  const filesQueryByLabel = buildFilesQueryByLabel(currentFileTheme)
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

  const queryKonnector =
    buildKonnectorsQueryByQualificationLabel(currentFileTheme)
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

  const isLoading =
    isLoadingFiles ||
    isLoadingContacts ||
    isKonnectorsLoading ||
    isAccountsLoading

  return (
    <>
      <PapersListToolbar selectedThemeLabel={selectedThemeLabel} />
      {isLoading && (
        <Spinner
          className="u-flex u-flex-justify-center u-mt-2 u-h-5"
          size="xxlarge"
        />
      )}
      {!isLoading && (
        <>
          {hasFiles && (
            <PapersListByContact
              selectedThemeLabel={selectedThemeLabel}
              files={files}
              contacts={contacts}
              konnectors={konnectors}
              accounts={accounts}
            />
          )}
          {!hasFiles && <Empty konnector={konnectors[0]} accounts={accounts} />}
        </>
      )}
    </>
  )
}

export default ConditionnalPapersList
