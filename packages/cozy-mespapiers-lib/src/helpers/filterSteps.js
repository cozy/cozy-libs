import { isOCRActivated } from './isOCRActivated'

/**
 * Filter a list of step with OCR contraint
 * @param {object[]} steps list of step
 * @returns list of step filtered
 */
const filterSteps = steps => {
  const isOCR = isOCRActivated(steps)
  return steps.filter(step => {
    if (isOCR) {
      return step.ocr === 'both' || step.ocr === 'only'
    } else {
      return step?.ocr !== 'only'
    }
  })
}

export { filterSteps }
