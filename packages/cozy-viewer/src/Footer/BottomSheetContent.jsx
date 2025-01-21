import React from 'react'

import { BottomSheetItem } from 'cozy-ui/transpiled/react/BottomSheet'

import getPanelBlocks, { getPanelBlocksSpecs } from '../Panel/getPanelBlocks'
import { useViewer } from '../providers/ViewerProvider'

const BottomSheetContent = () => {
  const { file, isPublic, isReadOnly } = useViewer()

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

export default BottomSheetContent
