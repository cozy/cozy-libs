import { useEffect, useMemo, useState } from 'react'

import { isFile, isNote } from 'cozy-client/dist/models/file'
import { useWebviewIntent } from 'cozy-intent'
import {
  makeActions,
  print,
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
  const webviewIntent = useWebviewIntent()
  const { pushModal, popModal } = useModal()
  const { addMultiSelectionFile } = useMultiSelection()
  const [isPrintAvailable, setIsPrintAvailable] = useState(false)

  const isNoteDoc = isFile(doc) ? isNote(doc) : false
  const isPDFDoc = doc.mime === 'application/pdf'

  const actions = useMemo(
    () =>
      makeActions(
        [
          isNoteDoc && copyReminderContent,
          select,
          divider,
          forward,
          download,
          isPrintAvailable && isPDFDoc && print,
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
    [
      isNoteDoc,
      isPrintAvailable,
      isPDFDoc,
      addMultiSelectionFile,
      pushModal,
      popModal
    ]
  )

  useEffect(() => {
    const init = async () => {
      const isAvailable =
        (await webviewIntent?.call('isAvailable', 'print')) ?? true

      setIsPrintAvailable(isAvailable)
    }

    init()
  }, [webviewIntent])

  return !isFile(doc) ? undefined : actions
}

export default useActions
