import PropTypes from 'prop-types'
import React from 'react'

import MemberRecipient from './MemberRecipient'
import OwnerRecipientDefault from './OwnerRecipientDefault'

const OwnerRecipient = ({ recipients }) => {
  const ownerRecipient = recipients.find(
    recipient => recipient.status === 'owner'
  )

  if (ownerRecipient) {
    return <MemberRecipient {...ownerRecipient} />
  }

  return <OwnerRecipientDefault />
}

OwnerRecipient.propTypes = {
  recipients: PropTypes.array.isRequired
}

export default OwnerRecipient
