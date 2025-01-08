import { addDays } from 'date-fns'
import PropTypes from 'prop-types'
import React, { useState } from 'react'

import { useClient } from 'cozy-client'
import { getSharingLink as makeSharingLink } from 'cozy-client/dist/models/sharing'
import { isMobile } from 'cozy-device-helper'
import Button from 'cozy-ui/transpiled/react/Buttons'
import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Icon from 'cozy-ui/transpiled/react/Icon'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { ShareRestrictionContentModal } from './ShareRestrictionContentModal'
import {
  copyToClipboard,
  forwardFile,
  updatePermissions,
  makeTTL,
  READ_ONLY_PERMS,
  WRITE_PERMS,
  revokePermissions
} from './helpers'
import { checkIsReadOnlyPermissions } from '../../helpers/permissions'
import { useSharingContext } from '../../hooks/useSharingContext'

const PASSWORD_MIN_LENGTH = 4

export const ShareRestrictionModal = ({ file, onClose }) => {
  const client = useClient()
  const { t } = useI18n()
  const { showAlert } = useAlert()
  const [password, setPassword] = useState('')
  const [selectedDate, setSelectedDate] = useState(addDays(new Date(), 30))
  const [isValidDate, setIsValidDate] = useState(true)
  const [isValidPassword, setIsValidPassword] = useState(true)
  const [dateToggle, setDateToggle] = useState(true)
  const [passwordToggle, setPasswordToggle] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    documentType,
    getDocumentPermissions,
    updateDocumentPermissions,
    shareByLink,
    getSharingLink,
    revokeSharingLink
  } = useSharingContext()

  const hasSharingLink = getSharingLink(file._id) !== null
  const permissions = getDocumentPermissions(file._id)
  const isReadOnlyPermissions = checkIsReadOnlyPermissions(permissions)

  const [editingRights, setEditingRights] = useState(
    isReadOnlyPermissions || permissions.length === 0 ? 'readOnly' : 'write'
  )

  const isDesktopOrMobileWithoutShareAPI =
    (isMobile() && !navigator.share) || !isMobile()

  const helperTextPassword = !isValidPassword
    ? t('ShareRestrictionModal.invalidPasswordMessage', {
        smart_count: PASSWORD_MIN_LENGTH - password.length
      })
    : null

  const handleDateChange = (date, isValid) => {
    setSelectedDate(date)
    setIsValidDate(isValid)
  }

  const handleClick = async () => {
    setLoading(true)
    // If the file is not shared, we create a new sharing link
    if (!hasSharingLink) {
      const verbs = editingRights === 'readOnly' ? READ_ONLY_PERMS : WRITE_PERMS
      await shareByLink(file, { verbs })
      const url = getSharingLink(file._id)
      await copyToClipboard(url, { t, showAlert })
      onClose()
      return
    }

    await updatePermissions({
      file,
      t,
      editingRights,
      documentType,
      updateDocumentPermissions,
      showAlert
    })

    const ttl = makeTTL(dateToggle && selectedDate)
    if (isDesktopOrMobileWithoutShareAPI) {
      const url = await makeSharingLink(client, [file._id], {
        ttl,
        password
      })
      await copyToClipboard(url, { t, showAlert })
    } else {
      await forwardFile({
        client,
        file,
        t,
        ttl,
        password,
        showAlert
      })
    }
    onClose()
  }

  const handleRevokeLink = async () => {
    setLoading(true)
    await revokePermissions({
      file,
      t,
      documentType,
      revokeSharingLink,
      showAlert
    })
    onClose()
  }

  return (
    <ConfirmDialog
      open
      onClose={onClose}
      content={
        <ShareRestrictionContentModal
          file={file}
          // Date
          dateToggle={dateToggle}
          setDateToggle={setDateToggle}
          setSelectedDate={handleDateChange}
          selectedDate={selectedDate}
          setIsValidDate={setIsValidDate}
          // Password
          helperTextPassword={helperTextPassword}
          passwordToggle={passwordToggle}
          setPasswordToggle={setPasswordToggle}
          password={password}
          setPassword={setPassword}
          setIsValidPassword={setIsValidPassword}
          // Editing rights
          editingRights={editingRights}
          setEditingRights={setEditingRights}
        />
      }
      actions={
        <>
          {hasSharingLink && (
            <Button
              label={t('Share.permissionLink.deactivate')}
              variant="secondary"
              color="error"
              startIcon={<Icon icon="trash" />}
              onClick={handleRevokeLink}
              busy={loading}
            />
          )}
          <Button
            label={t('ShareRestrictionModal.action.confirm')}
            onClick={handleClick}
            disabled={!isValidDate || !isValidPassword}
            busy={loading}
          />
        </>
      }
    />
  )
}

ShareRestrictionModal.propTypes = {
  file: PropTypes.object.isRequired,
  onClose: PropTypes.func
}
