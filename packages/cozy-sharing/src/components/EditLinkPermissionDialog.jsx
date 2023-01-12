import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Radio from 'cozy-ui/transpiled/react/Radios'
import RadioGroup from 'cozy-ui/transpiled/react/RadioGroup'
import FormControlLabel from 'cozy-ui/transpiled/react/FormControlLabel'
import Alerter from 'cozy-ui/transpiled/react/Alerter'

import logger from '../logger'

const EditLinkPermissionDialog = ({
  open,
  onClose,
  document,
  documentType,
  onPermissionsSelected
}) => {
  const { t } = useI18n()

  const [isReadOnlyPermissions, setIsReadOnlyPermissions] = useState(true)

  const onChange = event => {
    setIsReadOnlyPermissions(event.target.value === 'true')
  }

  const onConfirm = () => {
    const verbs = isReadOnlyPermissions
      ? ['GET']
      : ['GET', 'POST', 'PUT', 'PATCH']
    try {
      onPermissionsSelected({ verbs })
    } catch (err) {
      Alerter.error(t(`${documentType}.share.shareByLink.permserror`))
      logger.log(err)
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
            label={
              document?.type === 'directory'
                ? t(`Share.permissionLink.seeFolder`)
                : t(`Share.permissionLink.seeFile`)
            }
            control={<Radio />}
          />
          <FormControlLabel
            value="false"
            label={
              document?.type === 'directory'
                ? t(`Share.permissionLink.modifyFolder`)
                : t(`Share.permissionLink.modifyFile`)
            }
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
  onPermissionsSelected: PropTypes.func.isRequired
}

export default EditLinkPermissionDialog
