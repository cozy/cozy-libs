import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'

import { isQueryLoading, useClient, useQueryAll } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Empty from 'cozy-ui/transpiled/react/Empty'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import List from 'cozy-ui/transpiled/react/MuiCozyTheme/List'
import ListSubheader from 'cozy-ui/transpiled/react/MuiCozyTheme/ListSubheader'

import { buildContactsQueryByIds } from '../../helpers/queries'
import {
  buildFilesWithContacts,
  getContactsRefIdsByFiles
} from '../Papers/helpers'
import HomeCloud from '../../assets/icons/HomeCloud.svg'
import { useMultiSelection } from '../Hooks/useMultiSelection'
import { useModal } from '../Hooks/useModal'
import { makeActions, makeActionVariant } from '../Actions/utils'
import { select } from '../Actions/Items/select'
import { hr } from '../Actions/Items/hr'
import { viewInDrive } from '../Actions/Items/viewInDrive'
import { trash } from '../Actions/Items/trash'
import { open } from '../Actions/Items/open'
import { rename } from '../Actions/Items/rename'
import SearchResultLine from './SearchResultLine'

const SearchResult = ({ filteredPapers }) => {
  const client = useClient()
  const { t } = useI18n()
  const { pushModal, popModal } = useModal()
  const { addMultiSelectionFile } = useMultiSelection()
  const [paperBeingRenamedId, setPaperBeingRenamedId] = useState(null)

  const actionVariant = makeActionVariant()
  const actions = useMemo(
    () =>
      makeActions(
        [
          select,
          hr,
          ...actionVariant,
          open,
          hr,
          rename,
          hr,
          viewInDrive,
          hr,
          trash
        ],
        {
          client,
          addMultiSelectionFile,
          pushModal,
          popModal,
          setPaperBeingRenamedId
        }
      ),
    [actionVariant, client, addMultiSelectionFile, popModal, pushModal]
  )
  const contactIds = getContactsRefIdsByFiles(filteredPapers)

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
            <SearchResultLine
              key={file._id}
              actions={actions}
              file={file}
              contactNames={contact}
              isRenaming={file.id === paperBeingRenamedId}
              setIsRenaming={isRenaming =>
                setPaperBeingRenamedId(isRenaming ? file.id : null)
              }
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
