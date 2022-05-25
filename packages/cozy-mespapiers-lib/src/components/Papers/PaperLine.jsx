import React, { useState, useRef, memo } from 'react'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'

import { models } from 'cozy-client'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import { ActionMenuHeader } from 'cozy-ui/transpiled/react/ActionMenu'
import Filename from 'cozy-ui/transpiled/react/Filename'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Radio from 'cozy-ui/transpiled/react/Radios'

import { ActionsItems } from '../Actions/ActionsItems'
import ActionMenuWrapper from '../Actions/ActionMenuWrapper'
import PaperItem from '../Papers/PaperItem'
import { useMultiSelection } from '../Hooks/useMultiSelection'

const { splitFilename } = models.file

const PaperLine = ({ paper, divider, actions }) => {
  const history = useHistory()
  const { isMobile } = useBreakpoints()
  const actionBtnRef = useRef()

  const [optionFile, setOptionFile] = useState(false)

  const { isMultiSelectionActive, addMultiSelectionFile } = useMultiSelection()
  const hideActionsMenu = () => setOptionFile(false)
  const toggleActionsMenu = () => setOptionFile(prev => !prev)

  const { filename, extension } = splitFilename({
    name: paper.name,
    type: 'file'
  })

  const handleClick = () => {
    if (isMultiSelectionActive) {
      addMultiSelectionFile(paper)
      history.push({
        pathname: `/paper/multiselect`,
        search: `backgroundPath=/paper`
      })
    } else {
      history.push({
        pathname: `/paper/file/${paper.id}`
      })
    }
  }

  return (
    <>
      <PaperItem paper={paper} divider={divider} onClick={handleClick}>
        {isMultiSelectionActive ? (
          <Radio onClick={handleClick} />
        ) : (
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
          <ActionsItems actions={actions} file={paper} />
        </ActionMenuWrapper>
      )}
    </>
  )
}

PaperLine.propTypes = {
  paper: PropTypes.object.isRequired,
  divider: PropTypes.bool,
  actions: PropTypes.array
}

export default memo(PaperLine)
