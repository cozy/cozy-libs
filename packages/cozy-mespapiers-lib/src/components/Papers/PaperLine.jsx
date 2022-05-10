import React, { useState, useRef, memo } from 'react'
import PropTypes from 'prop-types'

import { models } from 'cozy-client'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import ActionMenu, {
  ActionMenuHeader
} from 'cozy-ui/transpiled/react/ActionMenu'
import Filename from 'cozy-ui/transpiled/react/Filename'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import Icon from 'cozy-ui/transpiled/react/Icon'
import FileTypePdfIcon from 'cozy-ui/transpiled/react/icons/FileTypePdf'
import DotsIcon from 'cozy-ui/transpiled/react/icons/Dots'

import { ActionsItems } from '../Actions/ActionsItems'
import PaperItem from '../Papers/PaperItem'

const { splitFilename } = models.file

const PaperLine = ({ paper, divider, actions }) => {
  const { isMobile } = useBreakpoints()
  const actionBtnRef = useRef()

  const [optionFile, setOptionFile] = useState(false)

  const hideActionsMenu = () => setOptionFile(false)
  const toggleActionsMenu = () => setOptionFile(prev => !prev)

  const { filename, extension } = splitFilename({
    name: paper.name,
    type: 'file'
  })

  return (
    <>
      <PaperItem paper={paper} divider={divider}>
        <IconButton ref={actionBtnRef} onClick={toggleActionsMenu}>
          <Icon icon={DotsIcon} />
        </IconButton>
      </PaperItem>

      {optionFile && (
        <ActionMenu onClose={hideActionsMenu} anchorElRef={actionBtnRef}>
          {isMobile && (
            <ActionMenuHeader>
              <Filename
                icon={FileTypePdfIcon}
                filename={filename}
                extension={extension}
              />
            </ActionMenuHeader>
          )}
          <ActionsItems
            actions={actions}
            file={paper}
            onClose={hideActionsMenu}
          />
        </ActionMenu>
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
