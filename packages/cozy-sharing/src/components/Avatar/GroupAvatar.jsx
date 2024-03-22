import React from 'react'

import Avatar from 'cozy-ui/transpiled/react/Avatar'
import TeamIcon from 'cozy-ui/transpiled/react/Icons/Team'

const GroupAvatar = ({ size, className }) => {
  return <Avatar icon={TeamIcon} size={size} className={className} />
}

export { GroupAvatar }
