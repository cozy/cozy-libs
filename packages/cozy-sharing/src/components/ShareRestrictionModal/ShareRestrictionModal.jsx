import { addDays } from 'date-fns'
import PropTypes from 'prop-types'
import React, { useState } from 'react'

import { useClient } from 'cozy-client'
import { getSharingLink as makeSharingLink } from 'cozy-client/dist/models/sharing'
import { isMobile } from 'cozy-device-helper'
import Button from 'cozy-ui/transpiled/react/Buttons'
import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { ShareRestrictionContentModal } from './ShareRestrictionContentModal'
import {
  copyToClipboard,
  forwardFile,
  updatePermissions,
  makeTTL,
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
    revokeSharingLink
  } = useSharingContext()

  const permissions = getDocumentPermissions(file._id)
  const isReadOnlyPermissions = checkIsReadOnlyPermissions(permissions)
  // 'readOnly', 'write' or 'revoke'
  const [editingRights, setEditingRights] = useState(
    isReadOnlyPermissions ? 'readOnly' : 'write'
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
    if (editingRights === 'revoke') {
      await revokePermissions({
        file,
        t,
        documentType,
        revokeSharingLink,
        showAlert
      })
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

  const textAction = isDesktopOrMobileWithoutShareAPI
    ? t('ShareRestrictionModal.action.desktop')
    : t('ShareRestrictionModal.action.mobile')

  return (
    <ConfirmDialog
      open
      onClose={onClose}
      content={
        <ShareRestrictionContentModal
          file={file}
          onShareRestrictionModalClose={onClose}
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
        <Button
          label={textAction}
          onClick={handleClick}
          disabled={!isValidDate || !isValidPassword}
          busy={loading}
        />
      }
    />
  )
}

ShareRestrictionModal.propTypes = {
  file: PropTypes.object.isRequired,
  onClose: PropTypes.func
}
