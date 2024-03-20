import React, { useState, useRef } from 'react'

import { useClient } from 'cozy-client'
import ActionsMenu from 'cozy-ui/transpiled/react/ActionsMenu'
import {
  makeActions,
  divider
} from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import ActionsMenuMobileHeader from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuMobileHeader'
import DropdownButton from 'cozy-ui/transpiled/react/DropdownButton'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { permission } from './actions/permission'
import { revokeGroup as revokeGroupAction } from './actions/revokeGroup'
import { useSharingContext } from '../../hooks/useSharingContext'
import { GroupAvatar } from '../Avatar/GroupAvatar'

const GroupRecipientPermissions = ({
  name,
  isOwner,
  instance,
  sharingId,
  groupIndex,
  read_only: isReadOnly = false,
  className
}) => {
  const { t } = useI18n()
  const buttonRef = useRef()
  const client = useClient()
  const { revokeGroup, revokeSelf } = useSharingContext()

  const [isMenuDisplayed, setMenuDisplayed] = useState(false)
  const [revoking, setRevoking] = useState(false)

  const instanceMatchesClient =
    instance !== undefined && instance === client.options.uri
  const shouldShowMenu =
    !revoking && ((instanceMatchesClient && !isOwner) || isOwner)

  const toggleMenu = () => setMenuDisplayed(!isMenuDisplayed)
  const hideMenu = () => setMenuDisplayed(false)

  const handleRevocation = async () => {
    setRevoking(true)
    if (isOwner) {
      await revokeGroup(document, sharingId, groupIndex)
    } else {
      await revokeSelf(document)
    }
    setRevoking(false)
  }

  const type = isReadOnly ? 'one-way' : 'two-way'

  const actions = makeActions([permission, divider, revokeGroupAction], {
    t,
    type,
    isOwner,
    handleRevocation
  })

  return (
    <div className={className}>
      {revoking && <Spinner />}
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
          >
            <ActionsMenuMobileHeader>
              <ListItemIcon>
                <GroupAvatar size="small" />
              </ListItemIcon>
              <ListItemText
                primary={name}
                primaryTypographyProps={{ variant: 'h6' }}
              />
            </ActionsMenuMobileHeader>
          </ActionsMenu>
        </>
      )}
    </div>
  )
}

export { GroupRecipientPermissions }
