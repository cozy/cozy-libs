import React from 'react'
import PropTypes from 'prop-types'

import AvatarPlusX from './AvatarPlusX'
import styles from './recipient.styl'
import { getDisplayName } from '../../models'
import Identity from './Identity'

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
