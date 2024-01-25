import { useEffect, useMemo, useState } from 'react'

import { isFile, isNote } from 'cozy-client/dist/models/file'
import { useWebviewIntent } from 'cozy-intent'
import {
  makeActions,
  print,
  divider
} from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import {
  open,
  rename,
  select,
  trash,
  viewInDrive,
  editContact,
  copyReminderContent,
  forward,
  forwardTo,
  download
} from '../Actions/Items'
import { useFileSharing } from '../Contexts/FileSharingProvider'
import { useModal } from '../Hooks/useModal'
import { useMultiSelection } from '../Hooks/useMultiSelection'

const useActions = (docs, { isActionBar, actionsOptions } = {}) => {
  const webviewIntent = useWebviewIntent()
  const { t, f } = useI18n()
  const { pushModal, popModal } = useModal()
  const { addMultiSelectionFile } = useMultiSelection()
  const [isPrintAvailable, setIsPrintAvailable] = useState(false)
  const { isFileSharingAvailable } = useFileSharing()

  const hasNoteDoc =
    docs.length > 0 && docs.every(doc => isFile(doc))
      ? docs.length > 0 && docs.every(doc => isNote(doc))
      : false

  const isPDFDoc = docs.every(doc => doc.mime === 'application/pdf')

  const actions = useMemo(
    () =>
      makeActions(
        [
          !isActionBar && hasNoteDoc && copyReminderContent,
          !isActionBar && select,
          !isActionBar && divider,
          !isActionBar && forward,
          isActionBar && forwardTo,
          download,
          isPrintAvailable && isPDFDoc && print,
          !isActionBar && open,
          !isActionBar && divider,
          !isActionBar && rename,
          !isActionBar && hasNoteDoc && editContact,
          !isActionBar && divider,
          !isActionBar && viewInDrive,
          !isActionBar && divider,
          trash
        ],
        {
          ...actionsOptions,
          t,
          f,
          addMultiSelectionFile,
          pushModal,
          popModal,
          isFileSharingAvailable
        }
      ),
    [
      actionsOptions,
      isActionBar,
      hasNoteDoc,
      isPrintAvailable,
      isPDFDoc,
      t,
      f,
      addMultiSelectionFile,
      pushModal,
      popModal,
      isFileSharingAvailable
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

  return docs.length > 0 && docs.every(doc => !isFile(doc))
    ? undefined
    : actions
}

export default useActions
