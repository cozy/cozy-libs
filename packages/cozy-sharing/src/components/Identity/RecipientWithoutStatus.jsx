import React from 'react'

import Avatar from 'cozy-ui/transpiled/react/Avatar'

import Identity from './Identity'
import { getDisplayName, getInitials } from '../../models'
import styles from '../../styles/recipient.styl'

const RecipientWithoutStatus = ({ instance, ...rest }) => {
  const name = getDisplayName(rest)
  return (
    <div className={styles['recipient']}>
      <Avatar text={getInitials(rest)} textId={name} />
      <div className={styles['recipient-ident-status']}>
        <Identity name={name} details={instance} />
      </div>
    </div>
  )
}

export default RecipientWithoutStatus
