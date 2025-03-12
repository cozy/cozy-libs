import { addDays } from 'date-fns'
import PropTypes from 'prop-types'
import React, { useState } from 'react'

import { generateWebLink, useClient } from 'cozy-client'
import Button from 'cozy-ui/transpiled/react/Buttons'
import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Icon from 'cozy-ui/transpiled/react/Icon'
import TrashIcon from 'cozy-ui/transpiled/react/Icons/Trash'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { ShareRestrictionContentModal } from './ShareRestrictionContentModal'
import {
  copyToClipboard,
  updatePermissions,
  makeTTL,
  revokePermissions,
  createPermissions
} from './helpers'
import {
  checkIsPermissionHasExpiresDate,
  checkIsPermissionHasPassword,
  checkIsReadOnlyPermissions,
  getPermissionExpiresDate
} from '../../helpers/permissions'
import { useSharingContext } from '../../hooks/useSharingContext'

const PASSWORD_MIN_LENGTH = 4

export const ShareRestrictionModal = ({ file, onClose }) => {
  const client = useClient()
  const { t } = useI18n()
  const { showAlert } = useAlert()
  const [password, setPassword] = useState('')
  const [isValidDate, setIsValidDate] = useState(true)
  const [isValidPassword, setIsValidPassword] = useState(true)
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
  const hasPassword = checkIsPermissionHasPassword(permissions)
  const hasExpiresDate = checkIsPermissionHasExpiresDate(permissions)
  const expiresDate = getPermissionExpiresDate(permissions)
  const defaultDate = expiresDate
    ? new Date(expiresDate)
    : addDays(new Date(), 30)

  const [selectedDate, setSelectedDate] = useState(defaultDate)
  const [dateToggle, setDateToggle] = useState(
    permissions.length > 0 ? hasExpiresDate : true
  )
  const [passwordToggle, setPasswordToggle] = useState(hasPassword)
  const [editingRights, setEditingRights] = useState(
    isReadOnlyPermissions || permissions.length === 0 ? 'readOnly' : 'write'
  )

  const helperTextPassword = !isValidPassword
    ? t('ShareRestrictionModal.invalidPasswordMessage', {
        smart_count: PASSWORD_MIN_LENGTH - password.length
      })
    : null

  const handleClick = async () => {
    setLoading(true)
    // If the file is not shared, we create a new sharing link
    if (!hasSharingLink) {
      const ttl = makeTTL(dateToggle && selectedDate)
      const { data: perms } = await createPermissions({
        file,
        t,
        ttl,
        password,
        editingRights,
        documentType,
        shareByLink,
        showAlert
      })
      const url = generateWebLink({
        cozyUrl: client.getStackClient().uri,
        searchParams: [['sharecode', perms.attributes.shortcodes.code]],
        pathname: '/public',
        slug: 'drive',
        subDomainType: client.capabilities.flat_subdomains ? 'flat' : 'nested'
      })
      await copyToClipboard(url, { t, showAlert })
      onClose()
    } else {
      const [{ data: perms }] = await updatePermissions({
        file,
        t,
        dateToggle,
        selectedDate,
        passwordToggle,
        password,
        editingRights,
        documentType,
        updateDocumentPermissions,
        showAlert
      })
      const url = generateWebLink({
        cozyUrl: client.getStackClient().uri,
        searchParams: [['sharecode', perms.attributes.shortcodes.code]],
        pathname: '/public',
        slug: 'drive',
        subDomainType: client.capabilities.flat_subdomains ? 'flat' : 'nested'
      })
      await copyToClipboard(url, { t, showAlert })
      onClose()
    }
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
          setSelectedDate={setSelectedDate}
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
              startIcon={<Icon icon={TrashIcon} />}
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
