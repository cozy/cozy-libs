import React from 'react'
import PropTypes from 'prop-types'

import { isQueryLoading, useQueryAll } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Empty from 'cozy-ui/transpiled/react/Empty'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import List from 'cozy-ui/transpiled/react/MuiCozyTheme/List'
import ListSubheader from 'cozy-ui/transpiled/react/MuiCozyTheme/ListSubheader'

import PaperItem from '../Papers/PaperItem'
import { buildContactsQueryByIds } from '../../helpers/queries'
import {
  buildFilesWithContacts,
  getContactsRefIdsByFiles
} from '../Papers/helpers'
import HomeCloud from '../../assets/icons/HomeCloud.svg'
import { useMultiSelection } from '../Hooks/useMultiSelection'

const SearchResult = ({ filteredPapers }) => {
  const { t } = useI18n()
  const contactIds = getContactsRefIdsByFiles(filteredPapers)
  const { isMultiSelectionActive } = useMultiSelection()

  const contactsQueryByIds = buildContactsQueryByIds(contactIds)
  const { data: contacts, ...contactQueryResult } = useQueryAll(
    contactsQueryByIds.definition,
    contactsQueryByIds.options
  )

  const isLoadingContacts =
    isQueryLoading(contactQueryResult) || contactQueryResult.hasMore

  const filesWithContacts = !isLoadingContacts
    ? buildFilesWithContacts({
        files: filteredPapers,
        contacts,
        t
      })
    : []

  if (filesWithContacts.length === 0 && !isLoadingContacts) {
    return (
      <Empty
        icon={HomeCloud}
        iconSize="large"
        title={t('Search.empty.title')}
        text={t('Search.empty.text')}
        className="u-ph-1"
      />
    )
  }

  return filesWithContacts.length > 0 ? (
    <>
      <ListSubheader>{t('PapersList.subheader')}</ListSubheader>
      <List>
        {filesWithContacts.map(({ contact, file }) => {
          return (
            <PaperItem
              key={file._id}
              paper={file}
              contactNames={contact}
              {...(isMultiSelectionActive && { withCheckbox: true })}
            />
          )
        })}
      </List>
    </>
  ) : (
    <Spinner
      size="xxlarge"
      className="u-flex u-flex-justify-center u-mt-2 u-h-5"
    />
  )
}

SearchResult.propTypes = {
  filteredPapers: PropTypes.arrayOf(PropTypes.object)
}

export default SearchResult
