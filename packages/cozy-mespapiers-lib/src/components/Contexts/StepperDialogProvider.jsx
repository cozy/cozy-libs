import React, { createContext, useEffect, useState } from 'react'

const StepperDialogContext = createContext()

const StepperDialogProvider = ({ children }) => {
  const [stepperDialogTitle, setStepperDialogTitle] = useState('')
  const [allCurrentSteps, setAllCurrentSteps] = useState([])
  const [currentStepIndex, setCurrentStepIndex] = useState(1)
  const [currentDefinition, setCurrentDefinition] = useState(null)

  const resetStepperDialog = () => {
    setCurrentDefinition(null)
    setStepperDialogTitle('')
    setAllCurrentSteps([])
    setCurrentStepIndex(1)
  }

  useEffect(() => {
    if (currentDefinition) {
      setStepperDialogTitle(currentDefinition.label)
      const allCurrentStepsDefinitions = currentDefinition.acquisitionSteps
      if (allCurrentStepsDefinitions.length > 0) {
        const allCurrentStepsDefinitionsSorted =
          allCurrentStepsDefinitions.sort((a, b) => a.stepIndex - b.stepIndex)

        setAllCurrentSteps(allCurrentStepsDefinitionsSorted)
      }
    }
  }, [currentDefinition])

  const previousStep = () => {
    if (currentStepIndex > 1) {
      setCurrentStepIndex(prev => prev - 1)
    }
  }

  const nextStep = () => {
    allCurrentSteps.length > currentStepIndex &&
      setCurrentStepIndex(prev => prev + 1)
  }

  const isLastStep = () => {
    return currentStepIndex === allCurrentSteps.length
  }

  const stepperDialog = {
    allCurrentSteps,
    currentStepIndex,
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
