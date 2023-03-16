import PropTypes from 'prop-types'
import React from 'react'

import OwnerRecipientDefault from './OwnerRecipientDefault'
import Recipient from './Recipient'

const OwnerRecipient = ({ recipients }) => {
  const ownerRecipient = recipients.find(
    recipient => recipient.status === 'owner'
  )

  if (ownerRecipient) {
    return <Recipient {...ownerRecipient} />
  }

  return <OwnerRecipientDefault />
}

OwnerRecipient.propTypes = {
  recipients: PropTypes.array.isRequired
}

export default OwnerRecipient
