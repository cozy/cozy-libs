import { useMemo } from 'react'

import { useClient } from 'cozy-client'
import { isFile } from 'cozy-client/dist/models/file'
import { makeActions } from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem/ListItemBase/ActionsMenu/helpers'

import { hr } from '../Actions/Items/hr'
import { open } from '../Actions/Items/open'
import { renameDefaultActions } from '../Actions/Items/renameDefaultActions'
import { select } from '../Actions/Items/select'
import { trash } from '../Actions/Items/trash'
import { viewInDrive } from '../Actions/Items/viewInDrive'
import { makeActionVariant } from '../Actions/utils'
import { useModal } from '../Hooks/useModal'
import { useMultiSelection } from '../Hooks/useMultiSelection'

const useActions = doc => {
  const client = useClient()
  const { pushModal, popModal } = useModal()
  const { addMultiSelectionFile } = useMultiSelection()

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
          renameDefaultActions,
          hr,
          viewInDrive,
          hr,
          trash
        ],
        {
          client,
          addMultiSelectionFile,
          pushModal,
          popModal
        }
      ),
    [actionVariant, client, addMultiSelectionFile, popModal, pushModal]
  )

  return !isFile(doc) ? undefined : actions
}

export default useActions
