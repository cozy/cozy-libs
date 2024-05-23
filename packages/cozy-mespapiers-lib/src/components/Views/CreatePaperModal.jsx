import React, { useEffect, useCallback } from 'react'
import { useSearchParams, useNavigate, useParams } from 'react-router-dom'

import { useWebviewIntent } from 'cozy-intent'
import minilog from 'cozy-minilog'

import { FormDataProvider } from '../Contexts/FormDataProvider'
import { StepperDialogProvider } from '../Contexts/StepperDialogProvider'
import { useFormData } from '../Hooks/useFormData'
import { useStepperDialog } from '../Hooks/useStepperDialog'
import {
  makeFileFromBase64,
  getFirstFileFromNative
} from '../ModelSteps/helpers'
import StepperDialogWrapper from '../StepperDialog/StepperDialogWrapper'

const log = minilog('CreatePaperModal')

const CreatePaperModal = () => {
  const navigate = useNavigate()
  const { qualificationLabel } = useParams()
  const [searchParams] = useSearchParams()
  const { currentDefinition, allCurrentSteps } = useStepperDialog()
  const webviewIntent = useWebviewIntent()
  const { setFormData } = useFormData()

  const fromFlagshipUpload = searchParams.get('fromFlagshipUpload')

  const onClose = useCallback(async () => {
    fromFlagshipUpload
      ? await webviewIntent?.call('cancelUploadByCozyApp')
      : navigate('..')
  }, [fromFlagshipUpload, navigate, webviewIntent])

  const onSubmit = () => {
    navigate(`/paper/files/${qualificationLabel}`)
  }

  useEffect(() => {
    const getFileAndSetFormData = async () => {
      try {
        const fileToHandle = await getFirstFileFromNative(webviewIntent)
        const file = makeFileFromBase64(fileToHandle)

        if (file && allCurrentSteps?.length > 0) {
          setFormData(prev => ({
            ...prev,
            data: [
              ...prev.data,
              {
                file,
                stepIndex: 0,
                fileMetadata: {
                  page: 'front'
                }
              }
            ]
          }))
        }
      } catch (error) {
        log.error(
          'An error occured during getFileAndSetFormData setup in CreatePaperModal, the modal will be closed.',
          error
        )

        onClose()
      }
    }

    if (fromFlagshipUpload && webviewIntent) getFileAndSetFormData()
  }, [fromFlagshipUpload, allCurrentSteps, setFormData, webviewIntent, onClose])

  if (!currentDefinition) {
    return null
  }

  return <StepperDialogWrapper onClose={onClose} onSubmit={onSubmit} />
}

const CreatePaperModalWrapper = () => {
  return (
    <StepperDialogProvider>
      <FormDataProvider>
        <CreatePaperModal />
      </FormDataProvider>
    </StepperDialogProvider>
  )
}

export default CreatePaperModalWrapper
