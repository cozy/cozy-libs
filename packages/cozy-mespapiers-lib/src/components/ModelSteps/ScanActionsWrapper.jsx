import PropTypes from 'prop-types'
import React from 'react'

import { isMobile } from 'cozy-device-helper'

import ScanDesktopActions from './ScanDesktopActions'
import ScanMobileActions from './ScanMobileActions'

const ScanActionsWrapper = props => {
  if (isMobile()) {
    return <ScanMobileActions {...props} />
  }

  return <ScanDesktopActions {...props} />
}

ScanActionsWrapper.propTypes = {
  onChangeFile: PropTypes.func,
  openFilePickerModal: PropTypes.func,
}

export default ScanActionsWrapper
