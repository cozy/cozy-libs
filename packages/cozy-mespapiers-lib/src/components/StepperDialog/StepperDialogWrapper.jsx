import React from 'react'

import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import { useStepperDialog } from '../Hooks/useStepperDialog'
import ContactDialog from '../ModelSteps/ContactDialog'
import InformationDialog from '../ModelSteps/InformationDialog'
import NoteDialog from '../ModelSteps/NoteDialog'
import ScanWrapper from '../ModelSteps/Scan/ScanWrapper'

const StepperDialogWrapper = ({ onClose, onSubmit }) => {
  const { isMobile } = useBreakpoints()
  const { allCurrentSteps, currentStepIndex, previousStep } = useStepperDialog()

  const handleBack = () => {
    if (currentStepIndex > 1) {
      return previousStep
    }
    return isMobile ? onClose : undefined
  }

  return allCurrentSteps.map(currentStep => {
    if (currentStep.stepIndex === currentStepIndex) {
      const modelPage = currentStep.model.toLowerCase()
      switch (modelPage) {
        case 'scan':
          return (
            <ScanWrapper
              key={currentStep.stepIndex}
              currentStep={currentStep}
              onClose={onClose}
              onSubmit={onSubmit}
              onBack={handleBack()}
            />
          )
        case 'information':
          return (
            <InformationDialog
              key={currentStep.stepIndex}
              currentStep={currentStep}
              onClose={onClose}
              onSubmit={onSubmit}
              onBack={handleBack()}
            />
          )
        case 'contact':
          return (
            <ContactDialog
              key={currentStep.stepIndex}
              currentStep={currentStep}
              onClose={onClose}
              onSubmit={onSubmit}
              onBack={handleBack()}
            />
          )
        case 'note':
          return (
            <NoteDialog
              key={currentStep.stepIndex}
              currentStep={currentStep}
              onClose={onClose}
              onSubmit={onSubmit}
              onBack={handleBack()}
            />
          )
      }
    }
  })
}

export default StepperDialogWrapper
