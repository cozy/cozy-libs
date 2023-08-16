import React, { useMemo, useEffect } from 'react'
import { useSearchParams, useNavigate, useParams } from 'react-router-dom'

import { useWebviewIntent } from 'cozy-intent'

import { getFilesToHandle } from './createPaperModalTemps'
import { findPlaceholderByLabelAndCountry } from '../../helpers/findPlaceholders'
import { FormDataProvider } from '../Contexts/FormDataProvider'
import { StepperDialogProvider } from '../Contexts/StepperDialogProvider'
import { useFormData } from '../Hooks/useFormData'
import { usePapersDefinitions } from '../Hooks/usePapersDefinitions'
import { useStepperDialog } from '../Hooks/useStepperDialog'
import { makeFileFromBase64 } from '../ModelSteps/helpers'
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

  const onClose = async () => {
    fromFlagshipUpload
      ? await webviewIntent?.call('cancelUploadByCozyApp')
      : navigate('..')
  }

  const onSubmit = () => {
    navigate(`/paper/files/${qualificationLabel}`)
  }

  useEffect(() => {
    if (formModel && currentDefinition !== formModel) {
      setCurrentDefinition(formModel)
    }
  }, [formModel, currentDefinition, setCurrentDefinition])

  useEffect(() => {
    const getFileAndSetFormData = async () => {
      // TODO: we should use getFilesToHandle from webviewIntent
      const { source, name, type } = (await getFilesToHandle()) || {}
      const file = makeFileFromBase64({ source, name, type })

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
              stepIndex: 1,
              fileMetadata: {
                page: 'front'
              }
            }
          ]
        }))
        setCurrentStepIndex(nextStep.stepIndex)
      }
    }

    // TODO: we should add `webviewIntent` in the condition
    if (fromFlagshipUpload) {
      getFileAndSetFormData()
    }
  }, [fromFlagshipUpload, allCurrentSteps, setCurrentStepIndex, setFormData])

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
