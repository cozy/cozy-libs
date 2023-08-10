import React, { useMemo, useEffect } from 'react'
import { useSearchParams, useNavigate, useParams } from 'react-router-dom'

import { findPlaceholderByLabelAndCountry } from '../../helpers/findPlaceholders'
import { FormDataProvider } from '../Contexts/FormDataProvider'
import { StepperDialogProvider } from '../Contexts/StepperDialogProvider'
import { usePapersDefinitions } from '../Hooks/usePapersDefinitions'
import { useStepperDialog } from '../Hooks/useStepperDialog'
import StepperDialogWrapper from '../StepperDialog/StepperDialogWrapper'

const CreatePaperModal = () => {
  const navigate = useNavigate()
  const { qualificationLabel } = useParams()
  const [searchParams] = useSearchParams()
  const { papersDefinitions } = usePapersDefinitions()
  const { setCurrentDefinition, currentDefinition } = useStepperDialog()

  const returnUrl = searchParams.get('returnUrl')
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
    returnUrl ? window.open(returnUrl, '_self') : navigate('..')
  }

  const onSubmit = () => {
    navigate(`/paper/files/${qualificationLabel}`)
  }

  useEffect(() => {
    if (formModel && currentDefinition !== formModel) {
      setCurrentDefinition(formModel)
    }
  }, [formModel, currentDefinition, setCurrentDefinition])

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
