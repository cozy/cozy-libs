import React from 'react'
import PropTypes from 'prop-types'

import ActionMenuImportDropdown from '../Placeholders/ActionMenuImportDropdown'
import ActionMenuWrapper from '../Actions/ActionMenuWrapper'
import { ActionsItems } from '../Actions/ActionsItems'

const PaperFabUI = React.forwardRef(
  ({ PapersFabOverrided, generalMenuProps, connectorMenuProps }, ref) => {
    const { show: showGeneralMenu, onClose, actions } = generalMenuProps
    const { show: showConnectorMenu } = connectorMenuProps

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
            {...connectorMenuProps}
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
  connectorMenuProps: PropTypes.shape({
    show: PropTypes.bool,
    placeholder: PropTypes.object,
    onClose: PropTypes.func,
    onClick: PropTypes.func
  })
}

export default PaperFabUI
