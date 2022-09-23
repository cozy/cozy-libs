import React from 'react'

import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import { useStepperDialog } from '../Hooks/useStepperDialog'
import { useScannerI18n } from '../Hooks/useScannerI18n'
import StepperDialog from '../StepperDialog/StepperDialog'
import StepperDialogContent from '../StepperDialog/StepperDialogContent'

const StepperDialogWrapper = ({ onClose }) => {
  const { isMobile } = useBreakpoints()
  const scannerT = useScannerI18n()
  const {
    allCurrentSteps,
    currentDefinition,
    currentStepIndex,
    previousStep,
    stepperDialogTitle
  } = useStepperDialog()

  const handleBack = () => {
    if (currentStepIndex > 1) {
      return previousStep
    }
    return isMobile ? onClose : undefined
  }

  return (
    <StepperDialog
      open
      onClose={onClose}
      onBack={handleBack()}
      title={
        Boolean(stepperDialogTitle) &&
        scannerT(`items.${stepperDialogTitle}`, currentDefinition.country)
      }
      content={<StepperDialogContent onClose={onClose} />}
      stepper={`${currentStepIndex}/${allCurrentSteps.length}`}
    />
  )
}

export default StepperDialogWrapper
