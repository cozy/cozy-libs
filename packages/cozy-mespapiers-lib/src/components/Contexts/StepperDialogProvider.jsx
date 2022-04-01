import React, { createContext, useCallback, useEffect, useState } from 'react'

const StepperDialogContext = createContext()

const StepperDialogProvider = ({ children }) => {
  const [stepperDialogTitle, setStepperDialogTitle] = useState('')
  const [allCurrentSteps, setAllCurrentSteps] = useState([])
  const [currentStepIndex, setCurrentStepIndex] = useState(1)
  const [currentDefinition, setCurrentDefinition] = useState(null)

  const resetStepperDialog = useCallback(() => {
    setCurrentDefinition(null)
    setStepperDialogTitle('')
    setAllCurrentSteps([])
    setCurrentStepIndex(1)
  }, [])

  useEffect(() => {
    if (currentDefinition) {
      setStepperDialogTitle(currentDefinition.label)
      const allCurrentStepsDefinitions = currentDefinition.acquisitionSteps
      if (allCurrentStepsDefinitions.length > 0) {
        const allCurrentStepsDefinitionsSorted =
          allCurrentStepsDefinitions.sort((a, b) => a.stepIndex - b.stepIndex)

        // TODO START - Just needed for Beta.4
        const clearTempOwner = allCurrentStepsDefinitionsSorted.filter(
          definition => definition.model.toLowerCase() !== 'owner'
        )
        // TODO END

        const { stepIndex: lastStepIndex } = clearTempOwner.slice(-1).pop()

        setAllCurrentSteps([
          ...clearTempOwner,
          {
            stepIndex: lastStepIndex + 1,
            illustration: 'Account.svg',
            text: 'PaperJSON.generic.owner.text',
            model: 'contact'
          }
        ])
      }
    }
  }, [currentDefinition])

  const previousStep = useCallback(() => {
    if (currentStepIndex > 1) {
      setCurrentStepIndex(prev => prev - 1)
    }
  }, [currentStepIndex])

  const nextStep = useCallback(() => {
    allCurrentSteps.length > currentStepIndex &&
      setCurrentStepIndex(prev => prev + 1)
  }, [allCurrentSteps.length, currentStepIndex])

  const stepperDialog = React.useMemo(
    () => ({
      allCurrentSteps,
      currentStepIndex,
      stepperDialogTitle,
      currentDefinition,
      setCurrentDefinition,
      previousStep,
      nextStep,
      resetStepperDialog
    }),
    [
      allCurrentSteps,
      currentStepIndex,
      stepperDialogTitle,
      currentDefinition,
      previousStep,
      nextStep,
      resetStepperDialog
    ]
  )

  return (
    <StepperDialogContext.Provider value={stepperDialog}>
      {children}
    </StepperDialogContext.Provider>
  )
}

export default StepperDialogContext

export { StepperDialogProvider }
