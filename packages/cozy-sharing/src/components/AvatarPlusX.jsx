import React from 'react'
import PropTypes from 'prop-types'
import { SharingTooltip, TooltipRecipientList } from './Tooltip'
import Avatar from 'cozy-ui/transpiled/react/Avatar'

const AvatarPlusX = ({ size, extraRecipients = [] }) => (
  <div data-tip data-for="extra-recipients-avatar">
    <Avatar
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
  </div>
)

AvatarPlusX.propTypes = {
  extraRecipients: PropTypes.arrayOf(PropTypes.string),
  size: PropTypes.string
}

AvatarPlusX.defaultProps = {
  extraRecipients: [],
  size: 'medium'
}

export default AvatarPlusX
