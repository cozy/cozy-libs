import React from 'react'
import PropTypes from 'prop-types'
import Recipient from './Recipient'

const WhoHasAccess = ({
  isOwner = false,
  recipients,
  document,
  documentType,
  onRevoke,
  className,
  onRevokeSelf
}) => (
  <div className={className}>
    {recipients.map(recipient => (
      <Recipient
        {...recipient}
        key={`key_r_${recipient.index}`}
        isOwner={isOwner}
        document={document}
        documentType={documentType}
        onRevoke={onRevoke}
        onRevokeSelf={onRevokeSelf}
      />
    ))}
  </div>
)

WhoHasAccess.propTypes = {
  isOwner: PropTypes.bool,
  recipients: PropTypes.array.isRequired,
  document: PropTypes.object.isRequired,
  documentType: PropTypes.string.isRequired,
  onRevoke: PropTypes.func.isRequired,
  onRevokeSelf: PropTypes.func
}
export default WhoHasAccess
