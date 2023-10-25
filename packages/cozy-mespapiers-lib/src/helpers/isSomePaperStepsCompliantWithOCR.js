/**
 * @param {object[]} steps list of acquisition steps of paper
 * @returns {boolean} true if the paper has at least one step with OCR contraint
 */
export const isSomePaperStepsCompliantWithOCR = steps => {
  return steps.some(
    step => step.isDisplayed === 'ocr' || step.isDisplayed === 'all'
  )
}
