import React from 'react'
import PropTypes from 'prop-types'

import ActionMenu from 'cozy-ui/transpiled/react/ActionMenu'
import { iconPropType } from 'cozy-ui/transpiled/react/Icon'

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
        placeholder={placeholder}
        onClose={onClose}
        onClick={onClick}
      />
    </ActionMenu>
  )
}

ActionMenuImportDropdown.propTypes = {
  className: PropTypes.string,
  anchorElRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]),
  isOpened: PropTypes.bool.isRequired,
  placeholder: PropTypes.shape({
    label: PropTypes.string.isRequired,
    icon: iconPropType.isRequired,
    acquisitionSteps: PropTypes.array,
    konnectorCriteria: PropTypes.shape({
      name: PropTypes.string,
      category: PropTypes.string
    })
  }),
  onClose: PropTypes.func,
  onClick: PropTypes.func
}

export default ActionMenuImportDropdown
