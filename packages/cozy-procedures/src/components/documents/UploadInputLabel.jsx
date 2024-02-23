import flow from 'lodash/flow'
import PropTypes from 'prop-types'
import React from 'react'

import { isIOSApp, isAndroidApp } from 'cozy-device-helper'
import { translate, withBreakpoints } from 'cozy-ui/transpiled/react'

const UploadInputLabel = ({ t, breakpoints }) => {
  const { isMobile } = breakpoints
  if (isIOSApp()) {
    return (
      <span className="needsclick">
        {t('documents.upload.from_my_device_scan')}
      </span>
    )
  } else if (isAndroidApp()) {
    return <span>{t('documents.upload.from_my_mobile')}</span>
  } else {
    if (isMobile) {
      return <span> {t('documents.upload.from_my_device_scan')}</span>
    } else {
      return <span>{t('documents.upload.from_my_computer')}</span>
    }
  }
}

UploadInputLabel.propTypes = {
  t: PropTypes.func.isRequired,
  breakpoints: PropTypes.object.isRequired
}
export default flow(translate(), withBreakpoints())(UploadInputLabel)
