import { isFlagshipApp } from 'cozy-device-helper'
import flag from 'cozy-flags'

import { isSomePaperStepsCompliantWithOCR } from './isSomePaperStepsCompliantWithOCR'

export const isOCRActivated = steps => {
  // TODO : Check whether the Flagship application has OCR capability
  if (
    isFlagshipApp() &&
    isSomePaperStepsCompliantWithOCR(steps) &&
    flag('mespapiers.ocr.enabled')
  ) {
    return true
  }
  return false
}
