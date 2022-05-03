/* global cozy */
import React, { useMemo, useCallback } from 'react'
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'

import { useQuery, getReferencedBy, isQueryLoading } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import UIBarTitle from 'cozy-ui/transpiled/react/BarTitle'
import CozyTheme from 'cozy-ui/transpiled/react/CozyTheme'
import { Spinner } from 'cozy-ui/transpiled/react/Spinner'

import {
  buildContactsQueryByIds,
  buildFilesQueryByLabel
} from '../../helpers/queries'
import { useScannerI18n } from '../Hooks/useScannerI18n'
import { CONTACTS_DOCTYPE } from '../../doctypes'
import { buildPaperslistByContact } from '../../helpers/buildPaperslistByContact'
import { usePapersDefinitions } from '../Hooks/usePapersDefinitions'
import PapersListByContact from '../Papers/PapersListByContact'
import { DEFAULT_MAX_FILES_DISPLAYED } from '../../constants/const'

const PapersListWrapper = ({ history, match }) => {
  const scannerT = useScannerI18n()
  const { t } = useI18n()
  const { papersDefinitions } = usePapersDefinitions()
  const { BarLeft, BarCenter } = cozy.bar
  const backButtonAction = useCallback(() => history.push('/paper'), [history])
  const currentFileTheme = useMemo(
    () => match?.params?.fileTheme || null,
    [match]
  )
  const themeLabel = scannerT(`items.${currentFileTheme}`)
  const filesQueryByLabel = buildFilesQueryByLabel(currentFileTheme)

  const {
    data: files,
    hasMore: hasMoreFiles,
    fetchMore: fetchMoreFiles,
    ...fileQueryResult
  } = useQuery(filesQueryByLabel.definition, filesQueryByLabel.options)

  if (hasMoreFiles) fetchMoreFiles()

  const isLoadingFiles = isQueryLoading(fileQueryResult) || hasMoreFiles

  const contactIds = !isLoadingFiles
    ? files.flatMap(file => {
        return getReferencedBy(file, CONTACTS_DOCTYPE).map(
          contactRef => contactRef.id
        )
      })
    : []
  const contactsQueryByIds = buildContactsQueryByIds(contactIds)
  const {
    data: contacts,
    hasMore: hasMoreContacts,
    ...contactQueryResult
  } = useQuery(contactsQueryByIds.definition, {
    ...contactsQueryByIds.options,
    enabled: !isLoadingFiles
  })

  const isLoadingContacts =
    isQueryLoading(contactQueryResult) || hasMoreContacts

  const currentDefinition = useMemo(
    () =>
      papersDefinitions.find(paperDef => paperDef.label === currentFileTheme),
    [papersDefinitions, currentFileTheme]
  )

  const paperslistByContact = useMemo(() => {
    if (!isLoadingFiles && !isLoadingContacts) {
      return buildPaperslistByContact({
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
    return <Redirect to={'/paper'} />
  }

  return (
    <>
      <BarLeft>
        <IconButton className={'u-mr-half'} onClick={backButtonAction}>
          <Icon icon={'previous'} size={16} />
        </IconButton>
      </BarLeft>
      <BarCenter>
        {/* Need to repeat the theme since the bar is in another react portal */}
        <CozyTheme variant="normal">
          <UIBarTitle>{themeLabel}</UIBarTitle>
        </CozyTheme>
      </BarCenter>

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
  })
}

export default PapersListWrapper
