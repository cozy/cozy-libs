import PropTypes from 'prop-types'
import React from 'react'

import Identity from './Identity'
import { getDisplayName } from '../../models'
import styles from '../../styles/recipient.styl'
import { ExtraAvatar } from '../Avatar/ExtraAvatar'

const ExtraIdentity = ({ extraRecipients }, { t }) => (
  <div className={styles['recipient']}>
    <ExtraAvatar
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

ExtraIdentity.contextTypes = {
  t: PropTypes.func.isRequired
}

export { ExtraIdentity }
