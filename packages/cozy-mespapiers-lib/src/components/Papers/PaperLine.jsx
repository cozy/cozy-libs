import PropTypes from 'prop-types'
import React, { useState, useRef, memo, useMemo } from 'react'

import { splitFilename, isNote } from 'cozy-client/dist/models/file'
import ActionsMenu from 'cozy-ui/transpiled/react/ActionsMenu'
import {
  makeActions,
  divider
} from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import ActionsMenuMobileHeader from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuMobileHeader'
import Filename from 'cozy-ui/transpiled/react/Filename'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'

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
import PaperItem from '../Papers/PaperItem'

const PaperLine = ({
  paper,
  hasDivider,
  isRenaming,
  setIsRenaming,
  isLast
}) => {
  const actionBtnRef = useRef()
  const { isMultiSelectionActive, addMultiSelectionFile } = useMultiSelection()
  const { pushModal, popModal } = useModal()
  const [showActionMenu, setShowActionMenu] = useState(false)

  const actionVariant = makeActionVariant()
  const actions = useMemo(
    () =>
      makeActions(
        [
          isNote(paper) && copyReminderContent,
          select,
          divider,
          ...actionVariant,
          open,
          divider,
          rename,
          isNote(paper) && editContact,
          divider,
          viewInDrive,
          divider,
          trash
        ],
        {
          addMultiSelectionFile,
          pushModal,
          popModal,
          setShowActionMenu
        }
      ),
    [actionVariant, addMultiSelectionFile, popModal, pushModal, paper]
  )

  const { filename, extension } = splitFilename({
    name: paper.name,
    type: 'file'
  })

  return (
    <>
      <PaperItem
        paper={paper}
        hasDivider={hasDivider}
        isRenaming={isRenaming}
        setIsRenaming={setIsRenaming}
        {...(isMultiSelectionActive && { withCheckbox: true })}
      >
        {!isMultiSelectionActive && (
          <IconButton
            ref={actionBtnRef}
            onClick={() => setShowActionMenu(prev => !prev)}
          >
            <Icon icon="dots" />
          </IconButton>
        )}
      </PaperItem>
      {showActionMenu && (
        <ActionsMenu
          open
          ref={actionBtnRef}
          doc={paper}
          actions={actions}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          componentsProps={{
            actionsItems: { actionOptions: { isLast, setIsRenaming } }
          }}
          onClose={() => setShowActionMenu(false)}
        >
          <ActionsMenuMobileHeader>
            <Filename
              icon="file-type-pdf"
              filename={filename}
              extension={extension}
            />
          </ActionsMenuMobileHeader>
        </ActionsMenu>
      )}
    </>
  )
}

PaperLine.propTypes = {
  paper: PropTypes.object.isRequired,
  hasDivider: PropTypes.bool,
  isRenaming: PropTypes.bool,
  setIsRenaming: PropTypes.func,
  isLast: PropTypes.bool
}

export default memo(PaperLine)
