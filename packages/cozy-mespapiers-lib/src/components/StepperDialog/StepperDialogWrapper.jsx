import React from 'react'
import { useSearchParams } from 'react-router-dom'

import { useWebviewIntent } from 'cozy-intent'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import { handleBack } from './helpers'
import { useStepperDialog } from '../Hooks/useStepperDialog'
import ContactDialog from '../ModelSteps/ContactDialog'
import InformationDialog from '../ModelSteps/InformationDialog'
import NoteDialog from '../ModelSteps/NoteDialog'
import ScanWrapper from '../ModelSteps/Scan/ScanWrapper'

const StepperDialogWrapper = ({ onClose, onSubmit }) => {
  const { isMobile } = useBreakpoints()
  const webviewIntent = useWebviewIntent()
  const [searchParams] = useSearchParams()
  const {
    allCurrentSteps,
    currentStepIndex,
    previousStep,
    setCurrentStepIndex
  } = useStepperDialog()

  const fromFlagshipUpload = searchParams.get('fromFlagshipUpload')

  return allCurrentSteps.map((currentStep, idx) => {
    if (idx === currentStepIndex) {
      const modelPage = currentStep.model.toLowerCase()

      const onBack = () => {
        handleBack({
          allCurrentSteps,
          currentStepIndex,
          previousStep,
          setCurrentStepIndex,
          fromFlagshipUpload,
          webviewIntent,
          isMobile,
          onClose
        })
      }

      switch (modelPage) {
        case 'scan':
          return (
            <ScanWrapper
              key={idx}
              currentStep={currentStep}
              onClose={onClose}
              onSubmit={onSubmit}
              onBack={onBack}
            />
          )
        case 'information':
          return (
            <InformationDialog
              key={idx}
              currentStep={currentStep}
              onClose={onClose}
              onSubmit={onSubmit}
              onBack={onBack}
            />
          )
        case 'contact':
          return (
            <ContactDialog
              key={idx}
              currentStep={currentStep}
              onClose={onClose}
              onSubmit={onSubmit}
              onBack={onBack}
            />
          )
        case 'note':
          return (
            <NoteDialog
              key={idx}
              currentStep={currentStep}
              onClose={onClose}
              onSubmit={onSubmit}
              onBack={onBack}
            />
          )
      }
    }
  })
}

export default StepperDialogWrapper
