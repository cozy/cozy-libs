import React, { useState, useRef, useCallback } from 'react'

import { useClient } from 'cozy-client'
import DropdownButton from 'cozy-ui/transpiled/react/DropdownButton'
import Icon from 'cozy-ui/transpiled/react/Icon'
import EyeIcon from 'cozy-ui/transpiled/react/Icons/Eye'
import RenameIcon from 'cozy-ui/transpiled/react/Icons/Rename'
import TrashIcon from 'cozy-ui/transpiled/react/Icons/Trash'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import Typography from 'cozy-ui/transpiled/react/Typography'
import ActionMenu, {
  ActionMenuItem
} from 'cozy-ui/transpiled/react/deprecated/ActionMenu'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const RecipientPermissions = ({
  isOwner,
  status,
  instance,
  type,
  document,
  documentType,
  className,
  onRevoke,
  onRevokeSelf,
  sharingId,
  index
}) => {
  const { t } = useI18n()
  const buttonRef = useRef()
  const client = useClient()
  const [revoking, setRevoking] = useState(false)
  const [isMenuDisplayed, setIsMenuDisplayed] = useState(false)
  const instanceMatchesClient =
    instance !== undefined && instance === client.options.uri
  const contactIsOwner = status === 'owner'
  const shouldShowMenu =
    !revoking &&
    !contactIsOwner &&
    ((instanceMatchesClient && !isOwner) || isOwner)

  const showMenu = () => setIsMenuDisplayed(true)
  const hideMenu = () => setIsMenuDisplayed(false)

  const onRevokeClick = useCallback(async () => {
    setRevoking(true)
    if (isOwner) {
      await onRevoke(document, sharingId, index)
    } else {
      await onRevokeSelf(document)
    }

    setRevoking(false)
  }, [isOwner, onRevoke, onRevokeSelf, document, sharingId, index])

  const PermissionIcon = type === 'two-way' ? RenameIcon : EyeIcon

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
            onClick={showMenu}
            ref={buttonRef}
            textVariant="body2"
          >
            {t(`Share.type.${type}`).toLowerCase()}
          </DropdownButton>
          {isMenuDisplayed && (
            <ActionMenu
              onClose={hideMenu}
              popperOptions={{
                placement: 'bottom-end',
                strategy: 'fixed'
              }}
              anchorElRef={buttonRef}
            >
              <ActionMenuItem
                left={
                  <Icon icon={PermissionIcon} color="var(--primaryTextColor)" />
                }
              >
                {t(`Share.type.${type}`)}
              </ActionMenuItem>

              <hr />
              <ActionMenuItem
                onClick={onRevokeClick}
                left={<Icon icon={TrashIcon} color="var(--errorColor)" />}
              >
                <Typography className="u-error" variant="body1">
                  {isOwner
                    ? t(`${documentType}.share.revoke.title`)
                    : t(`${documentType}.share.revokeSelf.title`)}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {isOwner
                    ? t(`${documentType}.share.revoke.desc`)
                    : t(`${documentType}.share.revokeSelf.desc`)}
                </Typography>
              </ActionMenuItem>
            </ActionMenu>
          )}
        </>
      )}
    </div>
  )
}

export default RecipientPermissions
