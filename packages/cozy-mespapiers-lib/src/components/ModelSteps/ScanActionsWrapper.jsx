import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'

import { isFlagshipApp, isMobile } from 'cozy-device-helper'
import flag from 'cozy-flags'
import { useWebviewIntent } from 'cozy-intent'

import ScanDesktopActions from './ScanDesktopActions'
import ScanFlagshipActions from './ScanFlagshipActions'
import ScanMobileActions from './ScanMobileActions'

const ScanActionsWrapper = props => {
  const [isFlagshipScanAvailable, setIsFlagshipScanAvailable] = useState(false)
  const webviewIntent = useWebviewIntent()

  useEffect(() => {
    const checkScanDocument = async () => {
      const isAvailable = await webviewIntent.call('isScannerAvailable')
      setIsFlagshipScanAvailable(isAvailable)
    }
    webviewIntent && checkScanDocument()
  }, [webviewIntent])

  if ((isFlagshipApp() || flag('flagship.debug')) && isFlagshipScanAvailable) {
    return <ScanFlagshipActions {...props} />
  }

  if (isMobile()) {
    return <ScanMobileActions {...props} />
  }

  return <ScanDesktopActions {...props} />
}

ScanActionsWrapper.propTypes = {
  onChangeFile: PropTypes.func,
  onOpenFilePickerModal: PropTypes.func,
  onOpenFlagshipScan: PropTypes.func
}

export default ScanActionsWrapper
