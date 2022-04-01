import React from 'react'

import ActionMenu from 'cozy-ui/transpiled/react/ActionMenu'

import ImportDropdown from '../ImportDropdown/ImportDropdown'

const ActionMenuImportDropdown = ({
  className,
  anchorElRef,
  isOpened,
  placeholder,
  onClose,
  onClick
}) => {
  if (!isOpened) {
    return null
  }

  return (
    <ActionMenu
      className={className}
      anchorElRef={anchorElRef}
      onClose={onClose}
    >
      <ImportDropdown
        label={placeholder.label}
        icon={placeholder.icon}
        hasSteps={placeholder?.acquisitionSteps.length > 0}
        onClose={onClose}
        onClick={onClick}
      />
    </ActionMenu>
  )
}

export default ActionMenuImportDropdown
