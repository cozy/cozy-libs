import { useMemo } from 'react'

import { isFile, isNote } from 'cozy-client/dist/models/file'
import {
  makeActions,
  divider
} from 'cozy-ui/transpiled/react/ActionsMenu/Actions'

import {
  open,
  rename,
  select,
  trash,
  viewInDrive,
  editContact,
  copyReminderContent,
  forward,
  download
} from '../Actions/Items'
import { useModal } from '../Hooks/useModal'
import { useMultiSelection } from '../Hooks/useMultiSelection'

const useActions = doc => {
  const { pushModal, popModal } = useModal()
  const { addMultiSelectionFile } = useMultiSelection()
  const isNoteDoc = isFile(doc) ? isNote(doc) : false

  const actions = useMemo(
    () =>
      makeActions(
        [
          isNoteDoc && copyReminderContent,
          select,
          divider,
          forward,
          download,
          open,
          divider,
          rename,
          isNoteDoc && editContact,
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
    [addMultiSelectionFile, popModal, pushModal, isNoteDoc]
  )

  return !isFile(doc) ? undefined : actions
}

export default useActions
