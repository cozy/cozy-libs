import React, {
  forwardRef,
  isValidElement,
  cloneElement,
  Children
} from 'react'

import ActionMenu from 'cozy-ui/transpiled/react/ActionMenu'

const ActionMenuWrapper = forwardRef(({ onClose, children }, ref) => {
  return (
    <ActionMenu onClose={onClose} anchorElRef={ref}>
      {Children.map(children, child => {
        if (isValidElement(child)) {
          return cloneElement(child, { onClose })
        }
        return null
      })}
    </ActionMenu>
  )
})
ActionMenuWrapper.displayName = 'ActionMenuWrapper'

export default ActionMenuWrapper
