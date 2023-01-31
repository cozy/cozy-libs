import React from 'react'
import cx from 'classnames'
import { useClient } from 'cozy-client'

import Avatar from 'cozy-ui/transpiled/react/Avatar'
import LinkIcon from 'cozy-ui/transpiled/react/Icons/Link'

import RecipientAvatar from './RecipientAvatar'
import AvatarPlusX from './AvatarPlusX'
import styles from './recipient.styl'
import { getDisplayName } from '../../models'

export const MAX_DISPLAYED_RECIPIENTS = 3

/**
 * Exclude me from the list of recipients.
 * @typedef {object} Recipient
 * @param {array<Recipient>} recipients - List of recipients
 * @param {boolean} isOwner - Indicates if I'm the owner or not
 * @param {object} client - CozyClient instance
 * @returns {array<Recipient>} List of recipients without me if I'm the owner
 */
export const excludeMeAsOwnerFromRecipients = ({
  recipients,
  isOwner,
  client
}) => {
  return recipients.filter(recipient => {
    if (isOwner) {
      return recipient.status !== 'owner'
    }
    return recipient.instance !== client.options.uri
  })
}

const RecipientsAvatars = ({
  recipients,
  link,
  size,
  className,
  onClick,
  isOwner,
  showMeAsOwner
}) => {
  const client = useClient()
  const filteredRecipients = showMeAsOwner
    ? recipients.slice().reverse() // we slice first to clone the original array because reverser() mutates it
    : excludeMeAsOwnerFromRecipients({
        recipients,
        isOwner,
        client
      }).reverse()
  // we reverse the recipients array because we use `flex-direction: row-reverse` to display them correctly

  const isAvatarPlusX = filteredRecipients.length > MAX_DISPLAYED_RECIPIENTS
  const extraRecipients = filteredRecipients
    .slice(MAX_DISPLAYED_RECIPIENTS)
    .map(recipient => getDisplayName(recipient))
  const shownRecipients = filteredRecipients.slice(0, MAX_DISPLAYED_RECIPIENTS)

  return (
    <div
      className={cx(
        styles['recipients-avatars'],
        {
          [styles['--interactive']]: onClick
        },
        className
      )}
      onClick={onClick}
    >
      {link && (
        <span data-testid="recipientsAvatars-link">
          <Avatar
            className={styles['recipients-avatars--link']}
            icon={LinkIcon}
            size={size}
          />
        </span>
      )}
      {isAvatarPlusX && (
        <span data-testid="recipientsAvatars-plusX">
          <AvatarPlusX
            className={styles['recipients-avatars--plusX']}
            extraRecipients={extraRecipients}
            size={size}
          />
        </span>
      )}
      {shownRecipients.map((recipient, idx) => (
        <span
          data-testid={`recipientsAvatars-avatar${
            recipient.status === 'owner' ? '-owner' : ''
          }`}
          key={idx}
        >
          <RecipientAvatar
            recipient={recipient}
            size={size}
            className={cx(styles['recipients-avatars--avatar'])}
          />
        </span>
      ))}
    </div>
  )
}

export default RecipientsAvatars
