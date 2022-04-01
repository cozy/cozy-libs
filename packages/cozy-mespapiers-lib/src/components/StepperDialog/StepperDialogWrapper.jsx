import React, { useEffect } from 'react'

import { useStepperDialog } from '../Hooks/useStepperDialog'
import { useScannerI18n } from '../Hooks/useScannerI18n'
import StepperDialog from '../StepperDialog/StepperDialog'
import StepperDialogContent from '../StepperDialog/StepperDialogContent'

const StepperDialogWrapper = ({ onClose }) => {
  const scannerT = useScannerI18n()
  const {
    allCurrentSteps,
    currentStepIndex,
    previousStep,
    stepperDialogTitle,
    resetStepperDialog
  } = useStepperDialog()

  useEffect(() => {
    return () => {
      resetStepperDialog()
    }
  }, [resetStepperDialog])

  return (
    <StepperDialog
      open
      onClose={onClose}
      onBack={currentStepIndex > 1 ? previousStep : undefined}
      title={stepperDialogTitle && scannerT(`items.${stepperDialogTitle}`)}
      content={<StepperDialogContent onClose={onClose} />}
      stepper={`${currentStepIndex}/${allCurrentSteps.length}`}
    />
  )
}

export default StepperDialogWrapper
