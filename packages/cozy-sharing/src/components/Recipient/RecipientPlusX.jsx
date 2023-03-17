import PropTypes from 'prop-types'
import React from 'react'

import AvatarPlusX from './AvatarPlusX'
import Identity from './Identity'
import styles from './recipient.styl'
import { getDisplayName } from '../../models'

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
