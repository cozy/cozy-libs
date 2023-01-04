import React from 'react'

import Avatar from 'cozy-ui/transpiled/react/Avatar'

import styles from './recipient.styl'
import { getDisplayName, getInitials } from '../../models'
import Identity from './Identity'

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
