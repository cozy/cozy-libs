import PropTypes from 'prop-types'
import React, { useState } from 'react'

import { useClient } from 'cozy-client'
import { models } from 'cozy-client'
import minilog from 'cozy-minilog'
import Button from 'cozy-ui/transpiled/react/Buttons'
import useEventListener from 'cozy-ui/transpiled/react/hooks/useEventListener'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import ConfirmReplaceFile from './ConfirmReplaceFile'
import { KEYS } from '../../../constants/const'
import { FILES_DOCTYPE } from '../../../doctypes'
import { createPdfAndSave } from '../../../helpers/createPdfAndSave'
import getOrCreateAppFolderWithReference from '../../../helpers/getFolderWithReference'
import { useScannerI18n } from '../../Hooks/useScannerI18n'
import { useStepperDialog } from '../../Hooks/useStepperDialog'

const log = minilog('SubmitButton')

const {
  document: { Qualification }
} = models

const SubmitButton = ({ onSubmit, disabled, formData }) => {
  const [isBusy, setIsBusy] = useState(false)
  const [confirmReplaceFileModal, setConfirmReplaceFileModal] = useState(false)
  const client = useClient()
  const { t, f } = useI18n()
  const scannerT = useScannerI18n()
  const { currentDefinition, stepperDialogTitle } = useStepperDialog()
  const { showAlert } = useAlert()

  const cozyFiles = formData.data.filter(d => d.file.from === 'cozy')
  const isDisabled = disabled || isBusy

  const submit = async () => {
    setIsBusy(true)
    try {
      const qualification = Qualification.getByLabel(stepperDialogTitle)
      const { _id: appFolderID } = await getOrCreateAppFolderWithReference(
        client,
        t
      )

      await createPdfAndSave({
        formData,
        qualification,
        currentDefinition,
        appFolderID,
        client,
        i18n: { t, f, scannerT }
      })

      showAlert({ message: t('common.saveFile.success'), severity: 'success' })
    } catch (error) {
      log.error('Error when submitting', error)
      showAlert({ message: t('common.saveFile.error'), severity: 'error' })
    } finally {
      onSubmit()
    }
  }

  const handleReplace = async isFileReplaced => {
    if (isFileReplaced) {
      for (const { file } of cozyFiles) {
        await client.destroy({ _id: file.id, _type: FILES_DOCTYPE })
      }
    }
    submit()
  }

  const handleClick = () => {
    if (cozyFiles.length > 0) {
      setConfirmReplaceFileModal(true)
    } else {
      submit()
    }
  }

  const handleKeyDown = ({ key }) => {
    if (isDisabled) return
    if (key === KEYS.ENTER) handleClick()
  }

  useEventListener(window, 'keydown', handleKeyDown)

  return (
    <>
      <Button
        fullWidth
        label={t(!isBusy ? 'ContactStep.save' : 'ContactStep.onLoad')}
        onClick={handleClick}
        disabled={isDisabled}
        busy={isBusy}
        data-testid="ButtonSave"
      />
      {confirmReplaceFileModal && (
        <ConfirmReplaceFile
          onClose={() => setConfirmReplaceFileModal(false)}
          onReplace={handleReplace}
          cozyFilesCount={cozyFiles.length}
        />
      )}
    </>
  )
}

SubmitButton.propTypes = {
  formData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  disabled: PropTypes.bool
}

export default SubmitButton
