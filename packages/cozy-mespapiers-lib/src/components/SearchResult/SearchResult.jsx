import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'

import { useClient } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import List from 'cozy-ui/transpiled/react/MuiCozyTheme/List'
import ListSubheader from 'cozy-ui/transpiled/react/MuiCozyTheme/ListSubheader'

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

const SearchResult = ({ result }) => {
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

  return (
    <>
      <ListSubheader>{t('PapersList.subheader')}</ListSubheader>
      <List className="u-pv-0">
        {result.map(({ contact, file }) => {
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
  )
}

SearchResult.propTypes = {
  result: PropTypes.arrayOf(PropTypes.object)
}

export default SearchResult
