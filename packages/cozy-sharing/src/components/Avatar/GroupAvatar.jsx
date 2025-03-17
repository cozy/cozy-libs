import React from 'react'

import Avatar from 'cozy-ui/transpiled/react/Avatar'
import Icon from 'cozy-ui/transpiled/react/Icon'
import TeamIcon from 'cozy-ui/transpiled/react/Icons/Team'

const GroupAvatar = ({ size, className }) => {
  return (
    <Avatar size={size} className={className} border>
      <Icon icon={TeamIcon} />
    </Avatar>
  )
}

export { GroupAvatar }
