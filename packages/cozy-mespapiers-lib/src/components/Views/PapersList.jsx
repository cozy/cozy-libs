import React from 'react'
import { useParams } from 'react-router-dom'

import { isQueryLoading, useQueryAll, useQuery } from 'cozy-client'
import { Spinner } from 'cozy-ui/transpiled/react/Spinner'

import {
  buildContactsQueryByIds,
  buildFilesQueryByLabel,
  buildConnectorsQueryByQualificationLabel,
  buildAccountsQueryBySlug
} from '../../helpers/queries'
import { useMultiSelection } from '../Hooks/useMultiSelection'
import Empty from '../Papers/Empty/Empty'
import PapersListByContact from '../Papers/PapersListByContact'
import PapersListToolbar from '../Papers/PapersListToolbar'
import {
  getContactsRefIdsByFiles,
  getCurrentFileTheme
} from '../Papers/helpers'

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
    buildConnectorsQueryByQualificationLabel(currentFileTheme)
  const { data: konnectors, ...konnectorsQueryLeft } = useQuery(
    queryKonnector.definition,
    queryKonnector.options
  )
  const isKonnectorsLoading = isQueryLoading(konnectorsQueryLeft)
  const konnector = konnectors?.[0]
  const konnectorSlug = konnector?.slug

  const queryAccounts = buildAccountsQueryBySlug(
    konnectorSlug,
    Boolean(konnectorSlug)
  )
  const { data: accounts, ...accountsQueryLeft } = useQuery(
    queryAccounts.definition,
    queryAccounts.options
  )
  const isAccountsLoading =
    Boolean(konnectorSlug) && isQueryLoading(accountsQueryLeft)

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
              konnector={konnector}
              accounts={accounts}
            />
          )}
          {!hasFiles && <Empty konnector={konnector} accounts={accounts} />}
        </>
      )}
    </>
  )
}

export default PapersList
