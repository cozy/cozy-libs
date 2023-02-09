import React from 'react'
import { useParams } from 'react-router-dom'

import { isQueryLoading, useQueryAll } from 'cozy-client'
import { Spinner } from 'cozy-ui/transpiled/react/Spinner'

import {
  buildContactsQueryByIds,
  buildFilesQueryByLabel
} from '../../helpers/queries'
import {
  getContactsRefIdsByFiles,
  getCurrentFileTheme
} from '../Papers/helpers'
import PapersListToolbar from '../Papers/PapersListToolbar'
import PapersListByContact from '../Papers/PapersListByContact'
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

  const contactIds = !isLoadingFiles ? getContactsRefIdsByFiles(files) : []
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

  const isLoading = isLoadingFiles || isLoadingContacts

  if (isLoading) {
    return (
      <>
        <PapersListToolbar selectedThemeLabel={selectedThemeLabel} />
        <Spinner
          className="u-flex u-flex-justify-center u-mt-2 u-h-5"
          size="xxlarge"
        />
      </>
    )
  }

  return (
    <>
      <PapersListToolbar selectedThemeLabel={selectedThemeLabel} />
      <PapersListByContact
        selectedThemeLabel={selectedThemeLabel}
        files={files}
        contacts={contacts}
      />
    </>
  )
}

export default PapersList
