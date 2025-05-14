import uniqueId from 'lodash/uniqueId'
import PropTypes from 'prop-types'
import React from 'react'

import Avatar from 'cozy-ui/transpiled/react/Avatar'

import { SharingTooltip, TooltipRecipientList } from '../Tooltip'

const ExtraAvatar = ({ className, size, extraRecipients = [] }) => {
  const sharingTooltipId = uniqueId('extra-recipients-avatar-')

  return (
    <span data-tip data-for={sharingTooltipId} className="u-db">
      <Avatar className={className} size={size} color="none" border innerBorder>
        {`+${Math.min(extraRecipients.length, 99)}`}
      </Avatar>
      <SharingTooltip id={sharingTooltipId}>
        <TooltipRecipientList recipientNames={extraRecipients} />
      </SharingTooltip>
    </span>
  )
}

ExtraAvatar.propTypes = {
  extraRecipients: PropTypes.arrayOf(PropTypes.string),
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string
}

ExtraAvatar.defaultProps = {
  extraRecipients: [],
  size: 'm'
}

export { ExtraAvatar }
