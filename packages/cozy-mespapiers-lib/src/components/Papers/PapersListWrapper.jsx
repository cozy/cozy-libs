import React, { useMemo } from 'react'
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'

import { getReferencedBy, isQueryLoading, useQueryAll } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { Spinner } from 'cozy-ui/transpiled/react/Spinner'

import {
  buildContactsQueryByIds,
  buildFilesQueryByLabel
} from '../../helpers/queries'
import { useScannerI18n } from '../Hooks/useScannerI18n'
import { CONTACTS_DOCTYPE } from '../../doctypes'
import { buildFilesByContacts } from './helpers'
import { usePapersDefinitions } from '../Hooks/usePapersDefinitions'
import PapersListByContact from '../Papers/PapersListByContact'
import { DEFAULT_MAX_FILES_DISPLAYED } from '../../constants/const'
import { useMultiSelection } from '../Hooks/useMultiSelection'
import PapersListToolbar from './PapersListToolbar'

const PapersListWrapper = ({ history, match, selectedThemeLabel = null }) => {
  const scannerT = useScannerI18n()
  const { t } = useI18n()
  const { papersDefinitions } = usePapersDefinitions()
  const { setIsMultiSelectionActive, isMultiSelectionActive } =
    useMultiSelection()

  const currentFileTheme = match?.params?.fileTheme ?? selectedThemeLabel
  const themeLabel = scannerT(`items.${currentFileTheme}`)
  const filesQueryByLabel = buildFilesQueryByLabel(currentFileTheme)

  const { data: files, ...fileQueryResult } = useQueryAll(
    filesQueryByLabel.definition,
    filesQueryByLabel.options
  )

  const isLoadingFiles =
    isQueryLoading(fileQueryResult) || fileQueryResult.hasMore

  const contactIds = !isLoadingFiles
    ? files.flatMap(file => {
        return getReferencedBy(file, CONTACTS_DOCTYPE).map(
          contactRef => contactRef.id
        )
      })
    : []
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
    return <Redirect to="/paper" />
  }

  return (
    <>
      {!isMultiSelectionActive && (
        <PapersListToolbar
          title={themeLabel}
          onBack={() => history.push('/paper')}
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
  history: PropTypes.object,
  match: PropTypes.shape({
    params: PropTypes.shape({
      fileTheme: PropTypes.string.isRequired
    })
  }),
  selectedThemeLabel: PropTypes.string
}

export default PapersListWrapper
