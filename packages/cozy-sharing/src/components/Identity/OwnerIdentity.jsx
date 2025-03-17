import React from 'react'

import Avatar from 'cozy-ui/transpiled/react/Avatar'

import Identity from './Identity'
import { getDisplayName, getInitials } from '../../models'
import styles from '../../styles/recipient.styl'

const OwnerIdentity = ({ url, size, ...rest }) => (
  <div className={styles['avatar']}>
    <Avatar size={size}>{getInitials(rest)}</Avatar>
    <Identity name={getDisplayName(rest)} details={url} />
  </div>
)

export default OwnerIdentity
