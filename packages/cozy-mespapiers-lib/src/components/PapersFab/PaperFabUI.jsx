import React from 'react'
import PropTypes from 'prop-types'

import ActionMenuWrapper from '../Actions/ActionMenuWrapper'
import { ActionsItems } from '../Actions/ActionsItems'

const PaperFabUI = React.forwardRef(
  ({ PapersFabOverrided, generalMenuOptions }, ref) => {
    const { actions, hideGeneralMenuOption, showGeneralMenuOptions } =
      generalMenuOptions

    return (
      <>
        {PapersFabOverrided}

        {showGeneralMenuOptions && (
          <ActionMenuWrapper onClose={hideGeneralMenuOption} ref={ref}>
            <ActionsItems actions={actions} />
          </ActionMenuWrapper>
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
  })
}

export default PaperFabUI
