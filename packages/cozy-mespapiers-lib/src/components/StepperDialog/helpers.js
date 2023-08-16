export const handleBack = ({
  allCurrentSteps,
  currentStepIndex,
  previousStep,
  setCurrentStepIndex,
  fromFlagshipUpload,
  isMobile,
  onClose
}) => {
  if (currentStepIndex > 1) {
    const previousDefinition = allCurrentSteps.find(
      el => el.stepIndex === currentStepIndex - 1
    )
    const isPreviousScanFront =
      previousDefinition.model === 'scan' &&
      (previousDefinition.page === 'front' ||
        previousDefinition.page === undefined)

    return fromFlagshipUpload
      ? !isPreviousScanFront
        ? previousStep()
        : currentStepIndex > 2
        ? setCurrentStepIndex(currentStepIndex - 2)
        : window.open(fromFlagshipUpload, '_self')
      : previousStep()
  }

  return isMobile
    ? onClose()
    : fromFlagshipUpload
    ? window.open(fromFlagshipUpload, '_self')
    : undefined
}
