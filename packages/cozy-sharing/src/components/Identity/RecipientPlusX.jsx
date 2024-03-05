import PropTypes from 'prop-types'
import React from 'react'

import Identity from './Identity'
import { getDisplayName } from '../../models'
import styles from '../../styles/recipient.styl'
import AvatarPlusX from '../Avatar/AvatarPlusX'

const RecipientPlusX = ({ extraRecipients }, { t }) => (
  <div className={styles['recipient']}>
    <AvatarPlusX
      extraRecipients={extraRecipients.map(recipient =>
        getDisplayName(recipient)
      )}
    />
    <div className={styles['recipient-ident-status']}>
      <Identity
        name={t('Share.members.otherContacts', extraRecipients.length)}
      />
    </div>
  </div>
)

RecipientPlusX.contextTypes = {
  t: PropTypes.func.isRequired
}

export default RecipientPlusX
