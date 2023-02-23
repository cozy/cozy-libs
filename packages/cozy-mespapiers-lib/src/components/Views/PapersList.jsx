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
import {
  getContactsRefIdsByFiles,
  getCurrentFileTheme
} from '../Papers/helpers'
import PapersListToolbar from '../Papers/PapersListToolbar'
import PapersListByContact from '../Papers/PapersListByContact'
import Empty from '../Papers/Empty/Empty'
import { useMultiSelection } from '../Hooks/useMultiSelection'

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

  const queryConnector =
    buildConnectorsQueryByQualificationLabel(currentFileTheme)
  const { data: connectors, ...connectorsQueryLeft } = useQuery(
    queryConnector.definition,
    queryConnector.options
  )
  const isConnectorsLoading = isQueryLoading(connectorsQueryLeft)
  const connector = connectors?.[0]
  const connectorSlug = connector?.slug

  const queryAccounts = buildAccountsQueryBySlug(
    connectorSlug,
    Boolean(connectorSlug)
  )
  const { data: accounts, ...accountsQueryLeft } = useQuery(
    queryAccounts.definition,
    queryAccounts.options
  )
  const isAccountsLoading =
    Boolean(connectorSlug) && isQueryLoading(accountsQueryLeft)

  const isLoading =
    isLoadingFiles ||
    isLoadingContacts ||
    isConnectorsLoading ||
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
              connector={connector}
              accounts={accounts}
            />
          )}
          {!hasFiles && <Empty connector={connector} accounts={accounts} />}
        </>
      )}
    </>
  )
}

export default PapersList
