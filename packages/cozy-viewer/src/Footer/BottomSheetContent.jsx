import PropTypes from 'prop-types'
import React from 'react'

import { BottomSheetItem } from 'cozy-ui/transpiled/react/BottomSheet'

import getPanelBlocks, { getPanelBlocksSpecs } from '../Panel/getPanelBlocks'

const BottomSheetContent = ({ file, isPublic, isReadOnly }) => {
  const panelBlocks = getPanelBlocks({
    panelBlocksSpecs: getPanelBlocksSpecs(isPublic),
    file
  })

  return panelBlocks.map((PanelBlock, index) => (
    <BottomSheetItem
      key={index}
      disableGutters
      disableElevation={index === panelBlocks.length - 1}
    >
      <PanelBlock file={file} isPublic={isPublic} isReadOnly={isReadOnly} />
    </BottomSheetItem>
  ))
}

BottomSheetContent.propTypes = {
  file: PropTypes.object.isRequired,
  isPublic: PropTypes.bool,
  isReadOnly: PropTypes.bool
}

export default BottomSheetContent
