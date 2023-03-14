import PropTypes from 'prop-types'
import React from 'react'

import ActionMenuWrapper from '../Actions/ActionMenuWrapper'
import { ActionsItems } from '../Actions/ActionsItems'
import ActionMenuImportDropdown from '../Placeholders/ActionMenuImportDropdown'

const PaperFabUI = React.forwardRef(
  ({ PapersFabOverrided, generalMenuProps, konnectorMenuProps }, ref) => {
    const { show: showGeneralMenu, onClose, actions } = generalMenuProps
    const { show: showConnectorMenu } = konnectorMenuProps

    return (
      <>
        {PapersFabOverrided}

        {showGeneralMenu && (
          <ActionMenuWrapper onClose={onClose} ref={ref}>
            <ActionsItems actions={actions} />
          </ActionMenuWrapper>
        )}
        {showConnectorMenu && (
          <ActionMenuImportDropdown
            isOpened
            anchorElRef={ref}
            {...konnectorMenuProps}
          />
        )}
      </>
    )
  }
)
PaperFabUI.displayName = 'PaperFabUI'

PaperFabUI.propTypes = {
  PapersFabOverrided: PropTypes.node,
  generalMenuProps: PropTypes.shape({
    show: PropTypes.bool,
    actions: PropTypes.arrayOf(PropTypes.object),
    onClose: PropTypes.func
  }),
  konnectorMenuProps: PropTypes.shape({
    show: PropTypes.bool,
    placeholder: PropTypes.object,
    onClose: PropTypes.func,
    onClick: PropTypes.func
  })
}

export default PaperFabUI
