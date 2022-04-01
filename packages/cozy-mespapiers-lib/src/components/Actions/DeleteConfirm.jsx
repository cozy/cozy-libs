import React, { useCallback, useState } from 'react'

import { useClient } from 'cozy-client'
import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Button from 'cozy-ui/transpiled/react/Button'
import Typography from 'cozy-ui/transpiled/react/Typography'
import Stack from 'cozy-ui/transpiled/react/Stack'
import Checkbox from 'cozy-ui/transpiled/react/Checkbox'

import { trashFiles, removeQualification } from './utils'

const DeleteConfirm = ({ files, onClose, children }) => {
  const { t } = useI18n()
  const client = useClient()
  const [isDeleting, setDeleting] = useState(false)
  const [clearQualification, setClearQualification] = useState(false)

  const onDelete = useCallback(async () => {
    setDeleting(true)
    if (clearQualification) {
      await removeQualification(client, files)
    } else {
      await trashFiles(client, files)
    }
    onClose()
  }, [clearQualification, client, files, onClose])

  const handleOnChange = () => {
    setClearQualification(prev => !prev)
  }

  return (
    <ConfirmDialog
      open={true}
      onClose={onClose}
      title={t('DeleteConfirm.title')}
      content={
        <Stack>
          <Typography
            variant={'body1'}
            dangerouslySetInnerHTML={{
              __html: t('DeleteConfirm.text', {
                name: files[0].name
              })
            }}
          />
          <Checkbox
            value={clearQualification}
            onChange={handleOnChange}
            label={t('DeleteConfirm.choice')}
          />
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
