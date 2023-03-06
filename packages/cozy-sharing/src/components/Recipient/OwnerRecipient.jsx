import React from 'react'
import PropTypes from 'prop-types'

import Recipient from './Recipient'
import OwnerRecipientDefault from './OwnerRecipientDefault'

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
