/* global cozy */
import React, { useMemo, useCallback } from 'react'
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'

import {
  useQuery,
  getReferencedBy,
  isQueryLoading,
  hasQueryBeenLoaded
} from 'cozy-client'
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

const PapersListWrapper = ({ history, match }) => {
  const scannerT = useScannerI18n()
  const { t } = useI18n()
  const { papersDefinitions } = usePapersDefinitions()
  const { BarLeft, BarCenter } = cozy.bar
  const backButtonAction = useCallback(() => history.push('/paper'), [history])
  const currentFileCategory = useMemo(
    () => match?.params?.fileCategory || null,
    [match]
  )
  const categoryLabel = scannerT(`items.${currentFileCategory}`)
  const filesQueryByLabel = buildFilesQueryByLabel(currentFileCategory)

  const {
    data: papersList,
    hasMore: hasMorePapers,
    fetchMore: fetchMorepapers,
    ...restPapers
  } = useQuery(filesQueryByLabel.definition, filesQueryByLabel.options)

  if (hasMorePapers) fetchMorepapers()

  const contactsIds = Array.isArray(papersList)
    ? papersList.flatMap(paper =>
        getReferencedBy(paper, CONTACTS_DOCTYPE).map(
          contactRef => contactRef.id
        )
      )
    : []
  const contactsQueryByIds = buildContactsQueryByIds(contactsIds)
  const { data: contactsList, ...restContacts } = useQuery(
    contactsQueryByIds.definition,
    {
      ...contactsQueryByIds.options,
      enabled: !hasMorePapers
    }
  )

  const paperslistByContact = useMemo(() => {
    if (
      !isQueryLoading(restPapers) &&
      hasQueryBeenLoaded(restPapers) &&
      !isQueryLoading(restContacts) &&
      hasQueryBeenLoaded(restContacts) &&
      !hasMorePapers
    ) {
      return buildPaperslistByContact({
        papersList,
        contactsList,
        defaultName: t('PapersList.defaultName'),
        papersDefinitions,
        currentFileCategory
      })
    }
    return []
  }, [
    restPapers,
    restContacts,
    hasMorePapers,
    papersList,
    contactsList,
    t,
    papersDefinitions,
    currentFileCategory
  ])

  const hasNoPapers =
    papersList?.length === 0 &&
    !isQueryLoading(restPapers) &&
    hasQueryBeenLoaded(restPapers)

  return hasNoPapers ? (
    <Redirect to={'/paper'} />
  ) : (
    <>
      <BarLeft>
        <IconButton className={'u-mr-half'} onClick={backButtonAction}>
          <Icon icon={'previous'} size={16} />
        </IconButton>
      </BarLeft>
      <BarCenter>
        {/* Need to repeat the theme since the bar is in another react portal */}
        <CozyTheme variant="normal">
          <UIBarTitle>{categoryLabel}</UIBarTitle>
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
      fileCategory: PropTypes.string.isRequired
    })
  })
}

export default PapersListWrapper
