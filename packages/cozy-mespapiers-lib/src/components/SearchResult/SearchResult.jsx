import PropTypes from 'prop-types'
import React, { useMemo, useState } from 'react'

import { useClient } from 'cozy-client'
import flag from 'cozy-flags'
import { makeActions } from 'cozy-ui/transpiled/react/ActionMenu/Actions/helpers'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import List from 'cozy-ui/transpiled/react/MuiCozyTheme/List'
import ListSubheader from 'cozy-ui/transpiled/react/MuiCozyTheme/ListSubheader'

import SearchResultLine from './SearchResultLine'
import { hr } from '../Actions/Items/hr'
import { open } from '../Actions/Items/open'
import { rename } from '../Actions/Items/rename'
import { select } from '../Actions/Items/select'
import { trash } from '../Actions/Items/trash'
import { viewInDrive } from '../Actions/Items/viewInDrive'
import { makeActionVariant } from '../Actions/utils'
import { useModal } from '../Hooks/useModal'
import { useMultiSelection } from '../Hooks/useMultiSelection'

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

  return (
    <>
      {!flag('mespapiers.v2-1-0.enabled') && (
        <ListSubheader>{t('PapersList.subheader')}</ListSubheader>
      )}
      <List className="u-pv-0">
        {filteredPapers.map(({ contact, file }) => {
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
  filteredPapers: PropTypes.arrayOf(PropTypes.object)
}

export default SearchResult
