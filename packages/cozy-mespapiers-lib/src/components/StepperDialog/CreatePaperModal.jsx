import React, { useMemo, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { findPlaceholdersByQualification } from '../../helpers/findPlaceholders'
import { FormDataProvider } from '../Contexts/FormDataProvider'
import { StepperDialogProvider } from '../Contexts/StepperDialogProvider'
import { usePapersDefinitions } from '../Hooks/usePapersDefinitions'
import { useStepperDialog } from '../Hooks/useStepperDialog'
import StepperDialogWrapper from './StepperDialogWrapper'

const CreatePaperModal = () => {
  const { search } = useLocation()
  const navigate = useNavigate()
  const { qualificationLabel } = useParams()
  const { papersDefinitions } = usePapersDefinitions()
  const { setCurrentDefinition, currentDefinition } = useStepperDialog()
  const backgroundPath = new URLSearchParams(search).get('backgroundPath')
  const allPlaceholders = useMemo(
    () =>
      findPlaceholdersByQualification(papersDefinitions, [
        {
          label: qualificationLabel
        }
      ]),
    [qualificationLabel, papersDefinitions]
  )

  const formModel = allPlaceholders[0]
  const onClose = () => navigate(backgroundPath)

  useEffect(() => {
    if (formModel && currentDefinition !== formModel) {
      setCurrentDefinition(formModel)
    }
  }, [formModel, currentDefinition, setCurrentDefinition])

  if (!currentDefinition) {
    return null
  }

  return <StepperDialogWrapper onClose={onClose} />
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
