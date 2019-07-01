import React from 'react'
import PropTypes from 'prop-types'

import { isIOSApp, isAndroidApp } from 'cozy-device-helper'
import { translate } from 'cozy-ui/transpiled/react'

const UploadInputLabel = ({ t }) => {
  if (isIOSApp()) {
    return <span> {t('documents.upload.from_my_device_scan')}</span>
  } else if (isAndroidApp()) {
    return <span>{t('documents.upload.from_my_device')}</span>
  } else {
    return <span>{t('documents.upload.from_my_computer')}</span>
  }
}

UploadInputLabel.propTypes = {
  t: PropTypes.func.isRequired
}
export default translate()(UploadInputLabel)
