export const handleBack = async ({
  allCurrentSteps,
  currentStepIndex,
  previousStep,
  setCurrentStepIndex,
  fromFlagshipUpload,
  webviewIntent,
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
        : await webviewIntent?.call('cancelUploadByCozyApp')
      : previousStep()
  }

  return isMobile
    ? onClose()
    : fromFlagshipUpload
    ? await webviewIntent?.call('cancelUploadByCozyApp')
    : undefined
}
