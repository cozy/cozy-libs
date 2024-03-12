import React, { useState, useRef } from 'react'

import { useClient } from 'cozy-client'
import ActionsMenu from 'cozy-ui/transpiled/react/ActionsMenu'
import {
  makeActions,
  divider
} from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import DropdownButton from 'cozy-ui/transpiled/react/DropdownButton'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { permission } from './actions/permission'
import { revokeGroup } from './actions/revokeGroup'

const GroupRecipientPermissions = ({
  isOwner,
  instance,
  read_only: isReadOnly = false,
  className
}) => {
  const { t } = useI18n()
  const buttonRef = useRef()
  const client = useClient()

  const [isMenuDisplayed, setMenuDisplayed] = useState(false)

  const instanceMatchesClient =
    instance !== undefined && instance === client.options.uri
  const shouldShowMenu = (instanceMatchesClient && !isOwner) || isOwner

  const toggleMenu = () => setMenuDisplayed(!isMenuDisplayed)
  const hideMenu = () => setMenuDisplayed(false)

  const handleRevocation = () => {
    // TODO : Need to be implemented
  }

  const type = isReadOnly ? 'one-way' : 'two-way'

  const actions = makeActions([permission, divider, revokeGroup], {
    t,
    type,
    isOwner,
    handleRevocation
  })

  return (
    <div className={className}>
      {shouldShowMenu && (
        <>
          <DropdownButton
            ref={buttonRef}
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={toggleMenu}
            textVariant="body2"
          >
            {t(`Share.type.${type}`).toLowerCase()}
          </DropdownButton>
          <ActionsMenu
            ref={buttonRef}
            open={isMenuDisplayed}
            actions={actions}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            autoClose
            onClose={hideMenu}
          />
        </>
      )}
    </div>
  )
}

export { GroupRecipientPermissions }
