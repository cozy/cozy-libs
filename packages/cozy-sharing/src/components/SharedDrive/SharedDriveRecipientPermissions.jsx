import React, { useState, useRef } from 'react'
import { useI18n } from 'twake-i18n'

import { useClient } from 'cozy-client'
import ActionsMenu from 'cozy-ui/transpiled/react/ActionsMenu'
import {
  makeActions,
  divider
} from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import DropdownButton from 'cozy-ui/transpiled/react/DropdownButton'

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
  const client = useClient()
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
      client,
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
        autoClose
        onClose={hideMenu}
      />
    </div>
  )
}

export default ShareDriveRecipientPermissions
