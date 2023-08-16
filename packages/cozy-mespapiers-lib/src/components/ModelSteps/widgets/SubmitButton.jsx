import PropTypes from 'prop-types'
import React, { useState } from 'react'

import { useClient } from 'cozy-client'
import Button from 'cozy-ui/transpiled/react/Buttons'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import useEventListener from 'cozy-ui/transpiled/react/hooks/useEventListener'

import ConfirmReplaceFile from './ConfirmReplaceFile'
import { KEYS } from '../../../constants/const'
import { FILES_DOCTYPE } from '../../../doctypes'
import { useFormData } from '../../Hooks/useFormData'

const SubmitButton = ({ onSubmit, disabled }) => {
  const [isBusy, setIsBusy] = useState(false)
  const [confirmReplaceFileModal, setConfirmReplaceFileModal] = useState(false)
  const { formSubmit, formData } = useFormData()
  const client = useClient()
  const { t } = useI18n()

  const cozyFiles = formData.data.filter(d => d.file.from === 'cozy')
  const isDisabled = disabled || isBusy

  const submit = async () => {
    setIsBusy(true)
    await formSubmit()
    onSubmit()
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
  onSubmit: PropTypes.func.isRequired,
  disabled: PropTypes.bool
}

export default SubmitButton
