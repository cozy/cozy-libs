import React, { useMemo, useEffect } from 'react'
import { useSearchParams, useNavigate, useParams } from 'react-router-dom'

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
  const { setFormData } = useFormData()
  const base64File = getFilesToHandle()
  const file = makeFileFromBase64({
    source: base64File,
    name: 'test.png',
    type: 'image/png'
  })

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

  const onClose = () => {
    fromFlagshipUpload
      ? window.open(fromFlagshipUpload, '_self')
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
    // here we should probably condition according to the return of getFilesToHandle
    // and not according to the presence of fromFlagshipUpload.
    // For the moment, getFilesToHandle is mocked, so let's leave it that way.
    if (allCurrentSteps?.length > 0 && fromFlagshipUpload) {
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
  }, [fromFlagshipUpload, allCurrentSteps]) // eslint-disable-line react-hooks/exhaustive-deps

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
