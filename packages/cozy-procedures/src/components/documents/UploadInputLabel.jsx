import React from 'react'
import PropTypes from 'prop-types'
import flow from 'lodash/flow'

import { translate, withBreakpoints } from 'cozy-ui/transpiled/react'

const UploadInputLabel = ({ t, breakpoints }) => {
  const { isMobile } = breakpoints

  if (isMobile) {
    return <span> {t('documents.upload.from_my_device_scan')}</span>
  } else {
    return <span>{t('documents.upload.from_my_computer')}</span>
  }
}

UploadInputLabel.propTypes = {
  t: PropTypes.func.isRequired,
  breakpoints: PropTypes.object.isRequired
}
export default flow(translate(), withBreakpoints())(UploadInputLabel)
