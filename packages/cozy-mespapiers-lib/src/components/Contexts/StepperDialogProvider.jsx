import React, { createContext, useEffect, useState } from 'react'

import { filterSteps } from '../../helpers/filterSteps'

const StepperDialogContext = createContext()

const StepperDialogProvider = ({ children }) => {
  const [stepperDialogTitle, setStepperDialogTitle] = useState('')
  const [allCurrentSteps, setAllCurrentSteps] = useState([])
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [currentDefinition, setCurrentDefinition] = useState(null)

  const resetStepperDialog = () => {
    setCurrentDefinition(null)
    setStepperDialogTitle('')
    setAllCurrentSteps([])
    setCurrentStepIndex(0)
  }

  useEffect(() => {
    if (currentDefinition) {
      setStepperDialogTitle(currentDefinition.label)
      const allCurrentStepsDefinitions = currentDefinition.acquisitionSteps
      if (allCurrentStepsDefinitions.length > 0) {
        const filteredSteps = filterSteps(allCurrentStepsDefinitions)
        setAllCurrentSteps(filteredSteps)
      }
    }
  }, [currentDefinition])

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

  return (
    <StepperDialogContext.Provider value={stepperDialog}>
      {children}
    </StepperDialogContext.Provider>
  )
}

export default StepperDialogContext

export { StepperDialogProvider }
