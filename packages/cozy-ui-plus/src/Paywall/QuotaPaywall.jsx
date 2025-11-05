import PropTypes from 'prop-types'
import React from 'react'

import Paywall from './Paywall'

/**
 * Paywall displayed when user disk space is full
 */
const QuotaPaywall = ({ onClose, ...props }) => {
  return <Paywall variant="quota" onClose={onClose} {...props} />
}

QuotaPaywall.propTypes = {
  /** Callback used when the user close the paywall */
  onClose: PropTypes.func.isRequired
}

export default QuotaPaywall
