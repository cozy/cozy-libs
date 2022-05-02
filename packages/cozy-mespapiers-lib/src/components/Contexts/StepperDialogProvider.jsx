import React, { createContext, useCallback, useEffect, useState } from 'react'
import { filterWithRemaining } from '../../helpers/filterWithRemaining'

const isOwner = item => item === 'owner'

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

        // Despite its presence in the PapersDefinitions.json, it is not yet expected that the Contact step will be anywhere but in the last position
        const {
          itemsFound: contactStep,
          remainingItems: allStepsWithoutContact
        } = filterWithRemaining(allCurrentStepsDefinitionsSorted, isOwner)

        const { stepIndex: lastStepIndex } = allStepsWithoutContact
          .slice(-1)
          .pop()

        setAllCurrentSteps([
          ...allStepsWithoutContact,
          {
            stepIndex: lastStepIndex + 1,
            multiple: contactStep[0]?.multiple || false,
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
