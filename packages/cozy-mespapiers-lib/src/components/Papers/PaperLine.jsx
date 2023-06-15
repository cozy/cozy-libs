import PropTypes from 'prop-types'
import React, { useState, useRef, memo } from 'react'

import { splitFilename } from 'cozy-client/dist/models/file'
import ActionsMenu from 'cozy-ui/transpiled/react/ActionsMenu'
import ActionsMenuMobileHeader from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuMobileHeader'
import Filename from 'cozy-ui/transpiled/react/Filename'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'

import { useMultiSelection } from '../Hooks/useMultiSelection'
import PaperItem from '../Papers/PaperItem'

const PaperLine = ({
  paper,
  divider,
  actions,
  isRenaming,
  setIsRenaming,
  isLast
}) => {
  const actionBtnRef = useRef()
  const { isMultiSelectionActive } = useMultiSelection()
  const [showActionMenu, setShowActionMenu] = useState(false)

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
            actionsItems: { actionOptions: { isLast } }
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
  divider: PropTypes.bool,
  actions: PropTypes.array,
  isRenaming: PropTypes.bool,
  setIsRenaming: PropTypes.func,
  isLast: PropTypes.bool
}

export default memo(PaperLine)
