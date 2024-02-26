import PropTypes from 'prop-types'
import React, { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useClient } from 'cozy-client'
import { getCreatedByApp } from 'cozy-client/dist/models/utils'
import Checkbox from 'cozy-ui/transpiled/react/Checkbox'
import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Stack from 'cozy-ui/transpiled/react/Stack'
import Typography from 'cozy-ui/transpiled/react/Typography'
import Button from 'cozy-ui/transpiled/react/deprecated/Button'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { trashFiles, removeQualification } from './utils'
import { useMultiSelection } from '../Hooks/useMultiSelection'

const DeleteConfirm = ({ files, isLast, onClose, children }) => {
  const { t } = useI18n()
  const client = useClient()
  const { isMultiSelectionActive } = useMultiSelection()
  const [isDeleting, setDeleting] = useState(false)
  const [clearQualification, setClearQualification] = useState(false)
  const navigate = useNavigate()
  const { showAlert } = useAlert()

  const onDelete = useCallback(async () => {
    setDeleting(true)
    if (clearQualification) {
      await removeQualification({ client, files, showAlert, t })
    } else {
      await trashFiles({ client, files, showAlert, t })
    }
    onClose()
    if (isLast || isMultiSelectionActive) {
      navigate('/paper', { replace: true })
    }
  }, [
    clearQualification,
    client,
    files,
    isLast,
    isMultiSelectionActive,
    navigate,
    onClose,
    showAlert,
    t
  ])

  const handleOnChange = () => {
    setClearQualification(prev => !prev)
  }

  const createdByDriveOrDesktop = files.every(file =>
    ['drive', 'cozy-desktop'].includes(getCreatedByApp(file))
  )

  return (
    <ConfirmDialog
      open
      onClose={onClose}
      title={t('DeleteConfirm.title', files.length)}
      content={
        <Stack>
          <Typography
            dangerouslySetInnerHTML={{
              __html: t('DeleteConfirm.text', {
                name: files[0].name,
                smart_count: files.length
              })
            }}
          />
          {createdByDriveOrDesktop && (
            <Checkbox
              checked={clearQualification}
              onChange={handleOnChange}
              label={t('DeleteConfirm.choice', files.length)}
            />
          )}
          {children}
        </Stack>
      }
      actions={
        <>
          <Button
            theme="secondary"
            onClick={onClose}
            label={t('DeleteConfirm.cancel')}
          />
          <Button
            busy={isDeleting}
            theme="danger"
            label={t('DeleteConfirm.delete')}
            onClick={onDelete}
          />
        </>
      }
    />
  )
}

DeleteConfirm.propTypes = {
  files: PropTypes.array,
  isLast: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.node
}

export default DeleteConfirm
