import PropTypes from 'prop-types'
import React, { useState, useRef, memo } from 'react'

import { models } from 'cozy-client'
import { ActionMenuHeader } from 'cozy-ui/transpiled/react/ActionMenu'
import Filename from 'cozy-ui/transpiled/react/Filename'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import ActionMenuWithClose from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem/ListItemBase/ActionsMenu/ActionMenuWithClose'
import ActionsItems from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem/ListItemBase/ActionsMenu/ActionsItems'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import { useMultiSelection } from '../Hooks/useMultiSelection'
import PaperItem from '../Papers/PaperItem'

const { splitFilename } = models.file

const PaperLine = ({
  paper,
  divider,
  actions,
  isRenaming,
  setIsRenaming,
  isLast
}) => {
  const { isMobile } = useBreakpoints()
  const actionBtnRef = useRef()

  const [optionFile, setOptionFile] = useState(false)

  const { isMultiSelectionActive } = useMultiSelection()
  const hideActionsMenu = () => setOptionFile(false)
  const toggleActionsMenu = () => setOptionFile(prev => !prev)

  const { filename, extension } = splitFilename({
    name: paper.name,
    type: 'file'
  })

  return (
    <>
      <PaperItem
        paper={paper}
        divider={divider}
        isRenaming={isRenaming}
        setIsRenaming={setIsRenaming}
        {...(isMultiSelectionActive && { withCheckbox: true })}
      >
        {!isMultiSelectionActive && (
          <IconButton ref={actionBtnRef} onClick={toggleActionsMenu}>
            <Icon icon="dots" />
          </IconButton>
        )}
      </PaperItem>

      {optionFile && (
        <ActionMenuWithClose onClose={hideActionsMenu} ref={actionBtnRef}>
          {isMobile && (
            <ActionMenuHeader>
              <Filename
                icon="file-type-pdf"
                filename={filename}
                extension={extension}
              />
            </ActionMenuHeader>
          )}
          <ActionsItems actions={actions} doc={paper} isLast={isLast} />
        </ActionMenuWithClose>
      )}
    </>
  )
}

PaperLine.propTypes = {
  paper: PropTypes.object.isRequired,
  divider: PropTypes.bool,
  actions: PropTypes.array,
  isRenaming: PropTypes.bool,
  setIsRenaming: PropTypes.func
}

export default memo(PaperLine)
