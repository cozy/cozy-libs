import { isFlagshipOCRAvailable } from './isFlagshipOCRAvailable'
import { isSomePaperStepsCompliantWithOCR } from './isSomePaperStepsCompliantWithOCR'

/**
 * Filter a list of step with OCR contraint
 * @param {object[]} steps list of step
 * @param {Object} [webviewIntent] - The webview intent service to interact with the native environment.
 * @param {function} webviewIntent.call - A function to call native methods, expecting the method name and its arguments.
 * @returns {Promise<object[]>} list of step filtered
 */
export const filterSteps = async ({
  steps,
  webviewIntent,
  fromFlagshipUpload
}) => {
  const isOCR =
    !fromFlagshipUpload &&
    isSomePaperStepsCompliantWithOCR(steps) &&
    (await isFlagshipOCRAvailable(webviewIntent))
  return steps.filter(step => {
    if (isOCR) {
      return step.isDisplayed === 'all' || step.isDisplayed === 'ocr'
    } else {
      return step?.isDisplayed !== 'ocr'
    }
  })
}
