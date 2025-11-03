import PropTypes from 'prop-types'
import React from 'react'

import IntentDialogOpener from 'cozy-ui-plus/dist/Intent/IntentDialogOpener'

const IntentOpener = ({
  action,
  doctype,
  options,
  disabled,
  children,
  ...props
}) => {
  if (disabled) {
    return children
  }

  return (
    <IntentDialogOpener
      {...props}
      action={action}
      doctype={doctype}
      options={options}
      showCloseButton={false}
      iframeProps={{
        spinnerProps: { className: 'u-m-0', middle: true, color: 'white' }
      }}
      fullScreen
      fullWidth
      PaperComponent="div"
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
