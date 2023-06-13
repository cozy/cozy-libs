import PropTypes from 'prop-types'
import React, { forwardRef } from 'react'

import ActionsMenu from 'cozy-ui/transpiled/react/ActionsMenu'

const PaperFabUI = forwardRef(
  ({ PapersFabOverrided, generalMenuProps, konnectorMenuProps }, ref) => {
    const {
      show: showGeneralMenu,
      actions: actionsGeneralMenu,
      onClose: closeGeneralMenu
    } = generalMenuProps

    const {
      show: showKonnectorMenu,
      actions: actionsKonnectorMenu,
      onClose: closeKonnectorMenu
    } = konnectorMenuProps

    return (
      <>
        {PapersFabOverrided}

        {showGeneralMenu && (
          <ActionsMenu
            open
            ref={ref}
            actions={actionsGeneralMenu}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            onClose={closeGeneralMenu}
          />
        )}

        {showKonnectorMenu && (
          <ActionsMenu
            open
            ref={ref}
            actions={actionsKonnectorMenu}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            onClose={closeKonnectorMenu}
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
