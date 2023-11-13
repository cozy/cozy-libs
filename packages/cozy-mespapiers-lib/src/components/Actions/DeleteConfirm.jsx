import React, { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useClient } from 'cozy-client'
import { getCreatedByApp } from 'cozy-client/dist/models/utils'
import Checkbox from 'cozy-ui/transpiled/react/Checkbox'
import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Stack from 'cozy-ui/transpiled/react/Stack'
import Typography from 'cozy-ui/transpiled/react/Typography'
import Button from 'cozy-ui/transpiled/react/deprecated/Button'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { trashFiles, removeQualification } from './utils'

const DeleteConfirm = ({ files, isLast, onClose, children }) => {
  const { t } = useI18n()
  const client = useClient()
  const [isDeleting, setDeleting] = useState(false)
  const [clearQualification, setClearQualification] = useState(false)
  const navigate = useNavigate()

  const onDelete = useCallback(async () => {
    setDeleting(true)
    if (clearQualification) {
      await removeQualification(client, files)
    } else {
      await trashFiles(client, files)
    }
    onClose()
    isLast && navigate('/paper', { replace: true })
  }, [clearQualification, client, files, isLast, navigate, onClose])

  const handleOnChange = () => {
    setClearQualification(prev => !prev)
  }

  const createdByDriveOrDesktop = ['drive', 'cozy-desktop'].includes(
    getCreatedByApp(files[0])
  )

  return (
    <ConfirmDialog
      open
      onClose={onClose}
      title={t('DeleteConfirm.title')}
      content={
        <Stack>
          <Typography
            dangerouslySetInnerHTML={{
              __html: t('DeleteConfirm.text', {
                name: files[0].name
              })
            }}
          />
          {createdByDriveOrDesktop && (
            <Checkbox
              value={clearQualification}
              onChange={handleOnChange}
              label={t('DeleteConfirm.choice')}
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

export default DeleteConfirm
