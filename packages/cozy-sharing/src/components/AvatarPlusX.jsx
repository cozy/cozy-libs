import React from 'react'
import PropTypes from 'prop-types'
import uniqueId from 'lodash/uniqueId'

import Avatar from 'cozy-ui/transpiled/react/Avatar'

import { SharingTooltip, TooltipRecipientList } from './Tooltip'

const AvatarPlusX = ({ className, size, extraRecipients = [] }) => {
  const sharingTooltipId = uniqueId('extra-recipients-avatar-')

  return (
    <span data-tip data-for={sharingTooltipId} className="u-db">
      <Avatar
        className={className}
        size={size}
        text={`+${Math.min(extraRecipients.length, 99)}`}
        style={{
          backgroundColor: 'var(--genericRecipientBackground)',
          color: 'var(--genericRecipientColor)'
        }}
      />
      <SharingTooltip id={sharingTooltipId}>
        <TooltipRecipientList recipientNames={extraRecipients} />
      </SharingTooltip>
    </span>
  )
}

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
