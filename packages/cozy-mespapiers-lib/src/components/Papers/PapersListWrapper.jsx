import React, { useMemo } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import { isQueryLoading, useQueryAll } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { Spinner } from 'cozy-ui/transpiled/react/Spinner'

import {
  buildContactsQueryByIds,
  buildFilesQueryByLabel
} from '../../helpers/queries'
import { useScannerI18n } from '../Hooks/useScannerI18n'
import { buildFilesByContacts, getContactsRefIdsByFiles } from './helpers'
import { usePapersDefinitions } from '../Hooks/usePapersDefinitions'
import PapersListByContact from '../Papers/PapersListByContact'
import { DEFAULT_MAX_FILES_DISPLAYED } from '../../constants/const'
import { useMultiSelection } from '../Hooks/useMultiSelection'
import PapersListToolbar from './PapersListToolbar'

const PapersListWrapper = ({ selectedThemeLabel = null }) => {
  const params = useParams()
  const navigate = useNavigate()
  const scannerT = useScannerI18n()
  const { t } = useI18n()
  const { papersDefinitions } = usePapersDefinitions()
  const { setIsMultiSelectionActive, isMultiSelectionActive } =
    useMultiSelection()

  const currentFileTheme = params?.fileTheme ?? selectedThemeLabel
  const themeLabel = scannerT(`items.${currentFileTheme}`)
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
    return <Navigate to="/" replace />
  }

  return (
    <>
      {!isMultiSelectionActive && (
        <PapersListToolbar
          title={themeLabel}
          onBack={() => navigate('/')}
          onClose={() => setIsMultiSelectionActive(false)}
        />
      )}

      {paperslistByContact.length > 0 ? (
        <PapersListByContact paperslistByContact={paperslistByContact} />
      ) : (
        <Spinner
          size="xxlarge"
          className="u-flex u-flex-justify-center u-mt-2 u-h-5"
        />
      )}
    </>
  )
}

PapersListWrapper.propTypes = {
  selectedThemeLabel: PropTypes.string
}

export default PapersListWrapper
