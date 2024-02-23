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
  if (currentStepIndex > 0) {
    const previousDefinition = allCurrentSteps[currentStepIndex - 1]
    const isPreviousScanFront =
      previousDefinition.model === 'scan' &&
      (previousDefinition.page === 'front' ||
        previousDefinition.page === undefined)

    return fromFlagshipUpload
      ? !isPreviousScanFront
        ? previousStep()
        : currentStepIndex > 1
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
