import React, { useState } from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import { models } from 'cozy-client'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Radio from 'cozy-ui/transpiled/react/Radios'
import RadioGroup from 'cozy-ui/transpiled/react/RadioGroup'
import FormControlLabel from 'cozy-ui/transpiled/react/FormControlLabel'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import logger from '../logger'

const checkIsReadOnlyPermissions = permissions => {
  const permissionCategories = get(
    permissions,
    '[0].attributes.permissions',
    {}
  )
  return (
    Object.values(permissionCategories).filter(permissionCategory =>
      models.permission.isReadOnly(permissionCategory)
    ).length > 0
  )
}

const EditLinkPermissionDialog = ({
  open,
  onClose,
  document,
  documentType,
  permissions,
  onChangePermissions
}) => {
  const { t } = useI18n()

  const isReadOnlyPermissionsInitial = checkIsReadOnlyPermissions(permissions)

  const [isReadOnlyPermissions, setIsReadOnlyPermissions] = useState(
    isReadOnlyPermissionsInitial
  )

  const updateLinkPermissions = ({ isReadOnly }) => {
    const verbs = isReadOnly ? ['GET'] : ['GET', 'POST', 'PUT', 'PATCH']
    try {
      onChangePermissions(document, verbs)
    } catch (err) {
      Alerter.error(t(`${documentType}.share.shareByLink.permserror`))
      logger.log(err)
    }
  }

  const onChange = event => {
    setIsReadOnlyPermissions(event.target.value === 'true')
  }

  const onConfirm = () => {
    if (isReadOnlyPermissions !== isReadOnlyPermissionsInitial) {
      updateLinkPermissions({ isReadOnly: isReadOnlyPermissions })
    }
    onClose()
  }

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      title={t('Share.permissionLink.title')}
      content={
        <RadioGroup
          aria-label="radio"
          value={isReadOnlyPermissions.toString()}
          onChange={onChange}
        >
          <FormControlLabel
            value="true"
            label={t('Share.permissionLink.read')}
            control={<Radio />}
          />
          <FormControlLabel
            value="false"
            label={t('Share.permissionLink.write')}
            control={<Radio />}
          />
        </RadioGroup>
      }
      actions={
        <>
          <Button
            variant="secondary"
            label={t('Share.permissionLink.cancel')}
            onClick={onClose}
          />
          <Button
            variant="primary"
            label={t('Share.permissionLink.confirm')}
            onClick={onConfirm}
          />
        </>
      }
    />
  )
}

EditLinkPermissionDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  document: PropTypes.object.isRequired,
  documentType: PropTypes.string.isRequired,
  permissions: PropTypes.array.isRequired,
  onChangePermissions: PropTypes.func.isRequired
}

export default EditLinkPermissionDialog
