import cx from 'classnames'
import React from 'react'

import RecipientPlusX from './Identity/RecipientPlusX'
import RecipientWithoutStatus from './Identity/RecipientWithoutStatus'
import styles from '../styles/recipient.styl'

const MAX_DISPLAYED_RECIPIENTS = 2

const WhoHasAccessLight = ({ recipients, className }) => (
  <div className={cx(styles['recipients-list-light'], className)}>
    {recipients.slice(0, MAX_DISPLAYED_RECIPIENTS).map((recipient, index) => (
      <RecipientWithoutStatus {...recipient} key={`key_recipient__${index}`} />
    ))}
    {recipients.length > MAX_DISPLAYED_RECIPIENTS && (
      <RecipientPlusX
        extraRecipients={recipients.slice(MAX_DISPLAYED_RECIPIENTS)}
      />
    )}
  </div>
)

export default WhoHasAccessLight
