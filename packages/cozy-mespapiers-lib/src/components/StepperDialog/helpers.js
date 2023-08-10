export const handleBack = ({
  allCurrentSteps,
  currentStepIndex,
  previousStep,
  setCurrentStepIndex,
  returnUrl,
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

    return returnUrl
      ? !isPreviousScanFront
        ? previousStep()
        : currentStepIndex > 2
        ? setCurrentStepIndex(currentStepIndex - 2)
        : window.open(returnUrl, '_self')
      : previousStep()
  }

  return isMobile
    ? onClose()
    : returnUrl
    ? window.open(returnUrl, '_self')
    : undefined
}
