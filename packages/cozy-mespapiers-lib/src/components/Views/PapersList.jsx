import React, { useMemo } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import { isQueryLoading, useQueryAll } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import {
  buildContactsQueryByIds,
  buildFilesQueryByLabel
} from '../../helpers/queries'
import {
  buildFilesByContacts,
  getContactsRefIdsByFiles
} from '../Papers/helpers'
import PapersListByContactLayout from '../Papers/PapersListByContactLayout'
import { usePapersDefinitions } from '../Hooks/usePapersDefinitions'
import { DEFAULT_MAX_FILES_DISPLAYED } from '../../constants/const'

const PapersList = ({ selectedThemeLabel = null }) => {
  const { t } = useI18n()
  const { papersDefinitions } = usePapersDefinitions()
  const params = useParams()

  const currentFileTheme = params?.fileTheme ?? selectedThemeLabel
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

  const currentDefinition = useMemo(
    () =>
      papersDefinitions.find(paperDef => paperDef.label === currentFileTheme),
    [papersDefinitions, currentFileTheme]
  )

  const paperslistByContact = useMemo(() => {
    if (!isLoadingFiles && !isLoadingContacts) {
      return buildFilesByContacts({
        files,
        contacts,
        maxDisplay:
          currentDefinition?.maxDisplay || DEFAULT_MAX_FILES_DISPLAYED,
        t
      })
    }
    return []
  }, [isLoadingFiles, isLoadingContacts, files, contacts, currentDefinition, t])

  const hasNoFiles = !isLoadingFiles && files.length === 0

  if (hasNoFiles) {
    return <Navigate to="/paper" replace />
  }

  return (
    <PapersListByContactLayout
      currentFileTheme={currentFileTheme}
      paperslistByContact={paperslistByContact}
    />
  )
}

PapersList.propTypes = {
  selectedThemeLabel: PropTypes.string
}

export default PapersList
