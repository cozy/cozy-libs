import React from 'react'
import PropTypes from 'prop-types'

import ActionMenuImportDropdown from '../Placeholders/ActionMenuImportDropdown'
import ActionMenuWrapper from '../Actions/ActionMenuWrapper'
import { ActionsItems } from '../Actions/ActionsItems'

const PaperFabUI = React.forwardRef(
  (
    { PapersFabOverrided, generalMenuOptions, connectorActionMenuOptions },
    ref
  ) => {
    const { showGeneralMenuOptions, hideGeneralMenuOption, actions } =
      generalMenuOptions
    const {
      showConnectorActionMenu,
      paperDefinition,
      onClickConnectorActionMenu,
      hideConnectorActionMenu
    } = connectorActionMenuOptions

    return (
      <>
        {PapersFabOverrided}

        {showGeneralMenuOptions && (
          <ActionMenuWrapper onClose={hideGeneralMenuOption} ref={ref}>
            <ActionsItems actions={actions} />
          </ActionMenuWrapper>
        )}
        {showConnectorActionMenu && (
          <ActionMenuImportDropdown
            isOpened
            placeholder={paperDefinition}
            onClick={onClickConnectorActionMenu}
            onClose={hideConnectorActionMenu}
            anchorElRef={ref}
          />
        )}
      </>
    )
  }
)
PaperFabUI.displayName = 'PaperFabUI'

PaperFabUI.propTypes = {
  PapersFabOverrided: PropTypes.node,
  generalMenuOptions: PropTypes.shape({
    showGeneralMenuOptions: PropTypes.bool,
    actions: PropTypes.arrayOf(PropTypes.object),
    hideGeneralMenuOption: PropTypes.func
  }),
  connectorActionMenuOptions: PropTypes.shape({
    showConnectorActionMenu: PropTypes.bool,
    paperDefinition: PropTypes.arrayOf(PropTypes.object),
    hideConnectorActionMenu: PropTypes.func,
    onClickConnectorActionMenu: PropTypes.func
  })
}

export default PaperFabUI
