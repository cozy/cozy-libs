import React, { useMemo, useEffect, useCallback } from 'react'
import { useSearchParams, useNavigate, useParams } from 'react-router-dom'

import { useWebviewIntent } from 'cozy-intent'
import log from 'cozy-logger'

import { findPlaceholderByLabelAndCountry } from '../../helpers/findPlaceholders'
import { FormDataProvider } from '../Contexts/FormDataProvider'
import { StepperDialogProvider } from '../Contexts/StepperDialogProvider'
import { useFormData } from '../Hooks/useFormData'
import { usePapersDefinitions } from '../Hooks/usePapersDefinitions'
import { useStepperDialog } from '../Hooks/useStepperDialog'
import {
  makeFileFromBase64,
  getFirstFileFromNative
} from '../ModelSteps/helpers'
import StepperDialogWrapper from '../StepperDialog/StepperDialogWrapper'

const CreatePaperModal = () => {
  const navigate = useNavigate()
  const { qualificationLabel } = useParams()
  const [searchParams] = useSearchParams()
  const { papersDefinitions } = usePapersDefinitions()
  const {
    setCurrentDefinition,
    currentDefinition,
    setCurrentStepIndex,
    allCurrentSteps
  } = useStepperDialog()
  const webviewIntent = useWebviewIntent()
  const { setFormData } = useFormData()

  const fromFlagshipUpload = searchParams.get('fromFlagshipUpload')
  const country = searchParams.get('country')

  const allPlaceholders = useMemo(
    () =>
      findPlaceholderByLabelAndCountry(
        papersDefinitions,
        qualificationLabel,
        country
      ),
    [qualificationLabel, papersDefinitions, country]
  )

  const formModel = allPlaceholders[0]

  const onClose = useCallback(async () => {
    fromFlagshipUpload
      ? await webviewIntent?.call('cancelUploadByCozyApp')
      : navigate('..')
  }, [fromFlagshipUpload, navigate, webviewIntent])

  const onSubmit = () => {
    navigate(
      `/paper/files/${qualificationLabel}${
        fromFlagshipUpload ? '?skipOnboarding=true' : ''
      }`
    )
  }

  useEffect(() => {
    if (formModel && currentDefinition !== formModel) {
      setCurrentDefinition(formModel)
    }
  }, [formModel, currentDefinition, setCurrentDefinition])

  useEffect(() => {
    const getFileAndSetFormData = async () => {
      try {
        const fileToHandle = await getFirstFileFromNative(webviewIntent)
        const file = makeFileFromBase64(fileToHandle)

        if (file && allCurrentSteps?.length > 0) {
          const nextStep = allCurrentSteps.find(
            el => el.model !== 'scan' || el.page === 'back'
          )

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

          const stepIndex = allCurrentSteps.findIndex(
            el => el.model === nextStep.model
          )

          setCurrentStepIndex(stepIndex)
        }
      } catch (error) {
        log(
          'error',
          'An error occured during getFileAndSetFormData setup in CreatePaperModal, the modal will be closed.'
        )
        log('error', error)

        onClose()
      }
    }

    if (fromFlagshipUpload && webviewIntent) getFileAndSetFormData()
  }, [
    fromFlagshipUpload,
    allCurrentSteps,
    setCurrentStepIndex,
    setFormData,
    webviewIntent,
    onClose
  ])

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
