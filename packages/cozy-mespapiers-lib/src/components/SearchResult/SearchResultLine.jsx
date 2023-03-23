import PropTypes from 'prop-types'
import React, { useRef, useState } from 'react'

import { models } from 'cozy-client'
import { ActionMenuHeader } from 'cozy-ui/transpiled/react/ActionMenu'
import ActionMenuWithClose from 'cozy-ui/transpiled/react/ActionMenu/ActionMenuWithClose'
import ActionsItems from 'cozy-ui/transpiled/react/ActionMenu/Actions/ActionsItems'
import Filename from 'cozy-ui/transpiled/react/Filename'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import { useMultiSelection } from '../Hooks/useMultiSelection'
import PaperItem from '../Papers/PaperItem'

const { splitFilename } = models.file

const SearchResultLine = ({
  file,
  contactNames,
  actions,
  isRenaming,
  setIsRenaming
}) => {
  const { isMobile } = useBreakpoints()
  const actionBtnRef = useRef()
  const [optionFile, setOptionFile] = useState(false)
  const { isMultiSelectionActive } = useMultiSelection()

  const hideActionsMenu = () => setOptionFile(false)
  const toggleActionsMenu = () => setOptionFile(prev => !prev)

  const { filename, extension } = splitFilename({
    name: file.name,
    type: 'file'
  })

  return (
    <>
      <PaperItem
        key={file._id}
        paper={file}
        contactNames={contactNames}
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
          <ActionsItems actions={actions} doc={file} />
        </ActionMenuWithClose>
      )}
    </>
  )
}

SearchResultLine.propTypes = {
  file: PropTypes.object,
  contactNames: PropTypes.string,
  actions: PropTypes.arrayOf(PropTypes.object),
  isRenaming: PropTypes.bool,
  setIsRenaming: PropTypes.func
}

export default SearchResultLine
