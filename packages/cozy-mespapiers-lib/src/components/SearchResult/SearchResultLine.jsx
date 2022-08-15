import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'

import { models } from 'cozy-client'
import { ActionMenuHeader } from 'cozy-ui/transpiled/react/ActionMenu'
import Filename from 'cozy-ui/transpiled/react/Filename'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import Icon from 'cozy-ui/transpiled/react/Icon'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import { ActionsItems } from '../Actions/ActionsItems'
import ActionMenuWrapper from '../Actions/ActionMenuWrapper'
import PaperItem from '../Papers/PaperItem'
import { useMultiSelection } from '../Hooks/useMultiSelection'

const { splitFilename } = models.file

const SearchResultLine = ({ file, contactNames, actions }) => {
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
        {...(isMultiSelectionActive && { withCheckbox: true })}
      >
        {!isMultiSelectionActive && (
          <IconButton ref={actionBtnRef} onClick={toggleActionsMenu}>
            <Icon icon="dots" />
          </IconButton>
        )}
      </PaperItem>

      {optionFile && (
        <ActionMenuWrapper onClose={hideActionsMenu} ref={actionBtnRef}>
          {isMobile && (
            <ActionMenuHeader>
              <Filename
                icon="file-type-pdf"
                filename={filename}
                extension={extension}
              />
            </ActionMenuHeader>
          )}
          <ActionsItems actions={actions} file={file} />
        </ActionMenuWrapper>
      )}
    </>
  )
}

SearchResultLine.propTypes = {
  file: PropTypes.object,
  contactNames: PropTypes.string,
  actions: PropTypes.arrayOf(PropTypes.object)
}

export default SearchResultLine
