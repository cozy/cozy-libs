import React from 'react'

import TeamIcon from 'cozy-ui/transpiled/react/Icons/Team'
import Avatar from 'cozy-ui/transpiled/react/legacy/Avatar'

const GroupAvatar = ({ size, className }) => {
  return <Avatar icon={TeamIcon} size={size} className={className} />
}

export { GroupAvatar }
