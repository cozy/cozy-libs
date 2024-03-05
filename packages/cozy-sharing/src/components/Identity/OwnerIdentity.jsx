import React from 'react'

import Avatar from 'cozy-ui/transpiled/react/Avatar'

import Identity from './Identity'
import { getDisplayName, getInitials } from '../../models'
import styles from '../../styles/recipient.styl'

const OwnerIdentity = ({ url, size, ...rest }) => (
  <div className={styles['avatar']}>
    <Avatar
      text={getInitials(rest)}
      size={size}
      textId={getDisplayName(rest)}
    />
    <Identity name={getDisplayName(rest)} details={url} />
  </div>
)

export default OwnerIdentity
