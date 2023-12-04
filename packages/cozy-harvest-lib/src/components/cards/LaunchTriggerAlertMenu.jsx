import PropTypes from 'prop-types'
import React, { useRef, useState } from 'react'

import ActionsMenu from 'cozy-ui/transpiled/react/ActionsMenu'
import { makeActions } from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import DotsIcon from 'cozy-ui/transpiled/react/Icons/Dots'

const LaunchTriggerAlertMenu = ({ actions, options, disabled }) => {
  const anchorRef = useRef()
  const [isMenuDisplayed, setMenuDisplayed] = useState(false)

  const actionsWithOptions = makeActions(actions, options)

  const toggleMenu = () => setMenuDisplayed(!isMenuDisplayed)

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={toggleMenu}
        data-testid="alert-menu-button"
        disabled={disabled}
      >
        <Icon icon={DotsIcon} />
      </IconButton>
      {isMenuDisplayed ? (
        <ActionsMenu
          ref={anchorRef}
          open
          actions={actionsWithOptions}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          autoClose
          onClose={toggleMenu}
        />
      ) : null}
    </>
  )
}

LaunchTriggerAlertMenu.defaultProps = {
  actions: [],
  options: {}
}

LaunchTriggerAlertMenu.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.func).isRequired,
  options: PropTypes.object.isRequired
}

export { LaunchTriggerAlertMenu }
