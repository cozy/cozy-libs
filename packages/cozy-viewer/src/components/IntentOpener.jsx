import PropTypes from 'prop-types'
import React, { useState } from 'react'

import Backdrop from 'cozy-ui/transpiled/react/Backdrop'
import IntentDialogOpener from 'cozy-ui/transpiled/react/IntentDialogOpener'

const IntentOpener = ({ action, doctype, options, disabled, children }) => {
  const [isLoading, setIsLoading] = useState(true)

  if (disabled) {
    return children
  }

  return (
    <IntentDialogOpener
      action={action}
      doctype={doctype}
      options={options}
      Component={Backdrop}
      invisible={!isLoading}
      isOver
      showCloseButton={false}
      iframeProps={{
        spinnerProps: { className: 'u-m-0', middle: true, color: 'white' },
        setIsLoading
      }}
    >
      {children}
    </IntentDialogOpener>
  )
}

IntentOpener.propTypes = {
  action: PropTypes.string,
  doctype: PropTypes.string,
  options: PropTypes.object,
  disabled: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ])
}

export default IntentOpener
