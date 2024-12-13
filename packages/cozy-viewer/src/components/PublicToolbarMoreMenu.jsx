import React, { useState, useCallback, useRef } from 'react'

import ActionsMenu from 'cozy-ui/transpiled/react/ActionsMenu'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import DotsIcon from 'cozy-ui/transpiled/react/Icons/Dots'

const PublicToolbarMoreMenu = ({ files, actions }) => {
  const moreButtonRef = useRef()
  const [menuIsVisible, setMenuVisible] = useState(false)
  const openMenu = useCallback(() => setMenuVisible(true), [setMenuVisible])
  const closeMenu = useCallback(() => setMenuVisible(false), [setMenuVisible])
  const toggleMenu = useCallback(() => {
    if (menuIsVisible) return closeMenu()
    openMenu()
  }, [closeMenu, openMenu, menuIsVisible])

  return (
    <>
      <IconButton
        ref={moreButtonRef}
        variant="secondary"
        className="u-white"
        onClick={toggleMenu}
      >
        <Icon icon={DotsIcon} />
      </IconButton>

      {menuIsVisible && (
        <ActionsMenu
          open
          onClose={closeMenu}
          ref={moreButtonRef}
          docs={files}
          actions={actions}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
        />
      )}
    </>
  )
}

export default PublicToolbarMoreMenu
