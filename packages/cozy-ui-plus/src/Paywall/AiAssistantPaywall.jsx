import PropTypes from 'prop-types'
import React from 'react'

import Paywall from './Paywall'

const AiAssistantPaywall = ({ onClose }) => {
  return <Paywall variant="AIAssistant" onClose={onClose} />
}

/**
 * Paywall displayed when the user is not authorised to access AI Assistant features
 */
AiAssistantPaywall.propTypes = {
  /** Callback used when the user close the paywall */
  onClose: PropTypes.func.isRequired
}

export default AiAssistantPaywall
