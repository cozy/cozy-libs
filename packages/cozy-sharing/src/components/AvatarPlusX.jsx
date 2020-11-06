import React from 'react'
import PropTypes from 'prop-types'

import Avatar from 'cozy-ui/transpiled/react/Avatar'

import { SharingTooltip, TooltipRecipientList } from './Tooltip'

const AvatarPlusX = ({ className, size, extraRecipients = [] }) => (
  <span data-tip data-for="extra-recipients-avatar" className="u-db">
    <Avatar
      className={className}
      size={size}
      text={`+${Math.min(extraRecipients.length, 99)}`}
      style={{
        backgroundColor: 'var(--genericRecipientBackground)',
        color: 'var(--genericRecipientColor)'
      }}
    />
    <SharingTooltip id="extra-recipients-avatar">
      <TooltipRecipientList recipientNames={extraRecipients} />
    </SharingTooltip>
  </span>
)

AvatarPlusX.propTypes = {
  extraRecipients: PropTypes.arrayOf(PropTypes.string),
  size: PropTypes.string,
  className: PropTypes.string
}

AvatarPlusX.defaultProps = {
  extraRecipients: [],
  size: 'medium'
}

export default AvatarPlusX
