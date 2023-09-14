import { isFlagshipApp } from 'cozy-device-helper'
import flag from 'cozy-flags'

import { isOCRCompliant } from './isOCRCompliant'

const isOCRActivated = steps => {
  // TODO : Check whether the Flagship application has OCR capability
  if (
    isFlagshipApp() &&
    isOCRCompliant(steps) &&
    flag('mespapiers.ocr.enabled')
  )
    return true
  return false
}

export { isOCRActivated }
