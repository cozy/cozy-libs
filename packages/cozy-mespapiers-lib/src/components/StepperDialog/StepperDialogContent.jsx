import React from 'react'

import { useStepperDialog } from '../Hooks/useStepperDialog'
import ContactWrapper from '../ModelSteps/ContactWrapper'
import Information from '../ModelSteps/Information'
import ScanWrapper from '../ModelSteps/ScanWrapper'

const StepperDialogContent = ({ onClose }) => {
  const { allCurrentSteps, currentStepIndex } = useStepperDialog()

  return allCurrentSteps.map(currentStep => {
    if (currentStep.stepIndex === currentStepIndex) {
      const modelPage = currentStep.model.toLowerCase()
      switch (modelPage) {
        case 'scan':
          return (
            <ScanWrapper
              key={currentStep.stepIndex}
              currentStep={currentStep}
            />
          )
        case 'information':
          return (
            <Information
              key={currentStep.stepIndex}
              currentStep={currentStep}
            />
          )
        case 'contact':
          return (
            <ContactWrapper
              key={currentStep.stepIndex}
              currentStep={currentStep}
              onClose={onClose}
            />
          )
      }
    }
  })
}

export default StepperDialogContent
