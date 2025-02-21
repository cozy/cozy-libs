import React, { useState, useRef } from 'react'

import ActionsMenu from 'cozy-ui/transpiled/react/ActionsMenu'
import {
  makeActions,
  divider
} from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import DropdownButton from 'cozy-ui/transpiled/react/DropdownButton'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { revokeSharedDriveMember } from '../Recipient/actions/revokeSharedDriveMember'
import { setReadOnlySharedPermission } from '../Recipient/actions/setReadOnlySharedPermission'
import { setReadWriteSharedPermission } from '../Recipient/actions/setReadWriteSharedPermission'

const ShareDriveRecipientPermissions = ({
  index,
  onSetType,
  type,
  onRevoke
}) => {
  const { t } = useI18n()
  const buttonRef = useRef()
  const [isMenuDisplayed, setMenuDisplayed] = useState(false)

  const toggleMenu = () => setMenuDisplayed(!isMenuDisplayed)
  const hideMenu = () => setMenuDisplayed(false)

  const handleRevocation = async () => {
    onRevoke(index)
    hideMenu()
  }

  const setType = async newType => {
    if (newType !== type) {
      onSetType(index, newType)
    }
    hideMenu()
  }

  const actions = makeActions(
    [
      setReadOnlySharedPermission,
      setReadWriteSharedPermission,
      divider,
      revokeSharedDriveMember
    ],
    {
      t,
      type,
      setType,
      handleRevocation
    }
  )

  return (
    <div>
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
    </div>
  )
}

export default ShareDriveRecipientPermissions
