import React, { createContext, useEffect, useState, useMemo } from 'react'
import { useSearchParams, useParams } from 'react-router-dom'

import { useWebviewIntent } from 'cozy-intent'

import { filterSteps } from '../../helpers/filterSteps'
import { findPlaceholderByLabelAndCountry } from '../../helpers/findPlaceholders'
import {
  getAndRemoveIndexedStorageData,
  CREATE_PAPER_DATA_BACKUP_CURRENT_STEP_INDEX
} from '../../utils/indexedStorage'
import { usePapersDefinitions } from '../Hooks/usePapersDefinitions'

const StepperDialogContext = createContext()

const StepperDialogProvider = ({ children }) => {
  const [stepperDialogTitle, setStepperDialogTitle] = useState('')
  const [allCurrentSteps, setAllCurrentSteps] = useState([])
  const [currentStepIndex, setCurrentStepIndex] = useState(-1)
  const [currentDefinition, setCurrentDefinition] = useState(null)
  const { papersDefinitions } = usePapersDefinitions()
  const webviewIntent = useWebviewIntent()
  const [searchParams] = useSearchParams()
  const { qualificationLabel } = useParams()

  const isReady = allCurrentSteps.length > 0 && currentStepIndex !== -1

  const fromFlagshipUpload = searchParams.get('fromFlagshipUpload')
  const country = searchParams.get('country')

  const resetStepperDialog = () => {
    setCurrentDefinition(null)
    setStepperDialogTitle('')
    setAllCurrentSteps([])
    setCurrentStepIndex(0)
  }

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

  useEffect(() => {
    if (formModel && currentDefinition !== formModel) {
      setCurrentDefinition(formModel)
    }
  }, [formModel, currentDefinition, setCurrentDefinition])

  useEffect(() => {
    if (currentDefinition) {
      const buildAllCurrentSteps = async () => {
        setStepperDialogTitle(currentDefinition.label)
        const allCurrentStepsDefinitions = currentDefinition.acquisitionSteps
        if (allCurrentStepsDefinitions.length > 0) {
          const filteredSteps = await filterSteps({
            steps: allCurrentStepsDefinitions,
            webviewIntent,
            fromFlagshipUpload
          })
          setAllCurrentSteps(filteredSteps)
        }
      }
      buildAllCurrentSteps()
    }
  }, [webviewIntent, currentDefinition, fromFlagshipUpload])

  useEffect(() => {
    const loadCreatePaperDataBackup = async () => {
      const currentStepIndexBackup = await getAndRemoveIndexedStorageData(
        CREATE_PAPER_DATA_BACKUP_CURRENT_STEP_INDEX
      )

      if (currentStepIndexBackup) {
        setCurrentStepIndex(currentStepIndexBackup)
      } else {
        setCurrentStepIndex(0)
      }
    }

    loadCreatePaperDataBackup()
  }, [])

  const previousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1)
    }
  }

  const nextStep = () => {
    allCurrentSteps.length > currentStepIndex + 1 &&
      setCurrentStepIndex(prev => prev + 1)
  }

  /**
   * @param {string} modelStep - The model of the step to check
   * @returns {boolean} - True if the step is the last step of the model
   */
  const isLastStep = modelStep => {
    if (!modelStep) return currentStepIndex + 1 === allCurrentSteps.length

    const lastScanIndex = allCurrentSteps.findLastIndex(
      step => step.model === modelStep
    )
    return lastScanIndex === currentStepIndex
  }

  const stepperDialog = {
    allCurrentSteps,
    currentStepIndex,
    setCurrentStepIndex,
    stepperDialogTitle,
    currentDefinition,
    isLastStep,
    setCurrentDefinition,
    previousStep,
    nextStep,
    resetStepperDialog
  }

  if (!isReady) {
    return null
  }

  return (
    <StepperDialogContext.Provider value={stepperDialog}>
      {children}
    </StepperDialogContext.Provider>
  )
}

export default StepperDialogContext

export { StepperDialogProvider }
