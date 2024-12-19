import PropTypes from 'prop-types'
import React, { useState } from 'react'

import Backdrop from 'cozy-ui/transpiled/react/Backdrop'
import IntentDialogOpener from 'cozy-ui/transpiled/react/IntentDialogOpener'
import Portal from 'cozy-ui/transpiled/react/Portal'

const PortalBackdrop = ({ children, ...props }) => {
  return (
    <Portal into="body">
      <Backdrop {...props}>{children}</Backdrop>
    </Portal>
  )
}

const IntentOpener = ({
  action,
  doctype,
  options,
  disabled,
  children,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true)

  if (disabled) {
    return children
  }

  return (
    <IntentDialogOpener
      {...props}
      action={action}
      doctype={doctype}
      options={options}
      Component={PortalBackdrop}
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
