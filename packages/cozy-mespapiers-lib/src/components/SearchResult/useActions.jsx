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
  copyReminderContent
} from '../Actions/Items'
import { makeActionVariant } from '../Actions/utils'
import { useModal } from '../Hooks/useModal'
import { useMultiSelection } from '../Hooks/useMultiSelection'

const useActions = doc => {
  const { pushModal, popModal } = useModal()
  const { addMultiSelectionFile } = useMultiSelection()
  const isNoteDoc = isFile(doc) ? isNote(doc) : false

  const actionVariant = makeActionVariant()
  const actions = useMemo(
    () =>
      makeActions(
        [
          isNoteDoc && copyReminderContent,
          select,
          divider,
          ...actionVariant,
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
    [actionVariant, addMultiSelectionFile, popModal, pushModal, isNoteDoc]
  )

  return !isFile(doc) ? undefined : actions
}

export default useActions
