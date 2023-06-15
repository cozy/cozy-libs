import { useMemo } from 'react'

import { isFile } from 'cozy-client/dist/models/file'
import {
  makeActions,
  divider
} from 'cozy-ui/transpiled/react/ActionsMenu/Actions'

import { open, rename, select, trash, viewInDrive } from '../Actions/Items'
import { makeActionVariant } from '../Actions/utils'
import { useModal } from '../Hooks/useModal'
import { useMultiSelection } from '../Hooks/useMultiSelection'

const useActions = doc => {
  const { pushModal, popModal } = useModal()
  const { addMultiSelectionFile } = useMultiSelection()

  const actionVariant = makeActionVariant()
  const actions = useMemo(
    () =>
      makeActions(
        [
          select,
          divider,
          ...actionVariant,
          open,
          divider,
          rename,
          divider,
          viewInDrive,
          divider,
          trash
        ],
        {
          addMultiSelectionFile,
          pushModal,
          popModal
        }
      ),
    [actionVariant, addMultiSelectionFile, popModal, pushModal]
  )

  return !isFile(doc) ? undefined : actions
}

export default useActions
