import React from 'react'

import Typography from 'cozy-ui/transpiled/react/Typography'

import { useScannerI18n } from '../Hooks/useScannerI18n'
import { useStepperDialog } from '../Hooks/useStepperDialog'

const StepperDialogTitle = () => {
  const scannerT = useScannerI18n()
  const {
    allCurrentSteps,
    currentStepIndex,
    currentDefinition,
    stepperDialogTitle
  } = useStepperDialog()

  return (
    <>
      {scannerT(`items.${stepperDialogTitle}`, {
        country: currentDefinition.country
      })}
      <Typography variant="h6">
        {`${currentStepIndex + 1}/${allCurrentSteps.length}`}
      </Typography>
    </>
  )
}

export default StepperDialogTitle
