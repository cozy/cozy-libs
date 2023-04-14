import { useContext } from 'react'

import StepperDialogContext from '../Contexts/StepperDialogProvider'

export const useStepperDialog = () => {
  const stepperDialogContext = useContext(StepperDialogContext)
  if (!stepperDialogContext) {
    throw new Error(
      'useStepperDialog must be used within a StepperDialogProvider'
    )
  }
  return stepperDialogContext
}
