import React, { useState, useRef, useCallback } from 'react'

import { useClient } from 'cozy-client'
import ActionsMenu from 'cozy-ui/transpiled/react/ActionsMenu'
import {
  makeActions,
  divider
} from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import DropdownButton from 'cozy-ui/transpiled/react/DropdownButton'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { permission } from './actions/permission'
import { revokeMember } from './actions/revokeMember'

const MemberRecipientPermissions = ({
  isOwner,
  status,
  instance,
  type,
  document,
  className,
  onRevoke,
  onRevokeSelf,
  sharingId,
  memberIndex
}) => {
  const { t } = useI18n()
  const buttonRef = useRef()
  const client = useClient()

  const [revoking, setRevoking] = useState(false)
  const [isMenuDisplayed, setMenuDisplayed] = useState(false)

  const instanceMatchesClient =
    instance !== undefined && instance === client.options.uri
  const contactIsOwner = status === 'owner'
  const shouldShowMenu =
    !revoking &&
    !contactIsOwner &&
    ((instanceMatchesClient && !isOwner) || isOwner)

  const toggleMenu = () => setMenuDisplayed(!isMenuDisplayed)
  const hideMenu = () => setMenuDisplayed(false)

  const handleRevocation = useCallback(async () => {
    setRevoking(true)
    if (isOwner) {
      await onRevoke(document, sharingId, memberIndex)
    } else {
      await onRevokeSelf(document)
    }
    setRevoking(false)
  }, [isOwner, onRevoke, onRevokeSelf, document, sharingId, memberIndex])

  const actions = makeActions([permission, divider, revokeMember], {
    t,
    type,
    isOwner,
    handleRevocation
  })

  return (
    <div className={className}>
      {revoking && <Spinner />}
      {!shouldShowMenu && !revoking && (
        <Typography variant="body2">
          {t(`Share.status.${status}`).toLowerCase()}
        </Typography>
      )}
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

export default MemberRecipientPermissions
