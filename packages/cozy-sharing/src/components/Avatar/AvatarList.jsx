import cx from 'classnames'
import React from 'react'

import { useClient } from 'cozy-client'
import Avatar from 'cozy-ui/transpiled/react/Avatar'
import Icon from 'cozy-ui/transpiled/react/Icon'
import LinkIcon from 'cozy-ui/transpiled/react/Icons/Link'
import { isTwakeTheme } from 'cozy-ui/transpiled/react/helpers/isTwakeTheme'

import { ExtraAvatar } from './ExtraAvatar'
import { GroupAvatar } from './GroupAvatar'
import { MemberAvatar } from './MemberAvatar'
import { getDisplayName } from '../../models'
import styles from '../../styles/recipient.styl'

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

const AvatarList = ({
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

  const hasExtraRecipients =
    filteredRecipients.length > MAX_DISPLAYED_RECIPIENTS
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
        <span data-testid="AvatarList-link">
          <Avatar color="none" border innerBorder={isTwakeTheme()} size={size}>
            <Icon icon={LinkIcon} />
          </Avatar>
        </span>
      )}
      {hasExtraRecipients && (
        <span data-testid="AvatarList-plusX">
          <ExtraAvatar extraRecipients={extraRecipients} size={size} />
        </span>
      )}
      {shownRecipients.map(recipient => {
        if (recipient.members) {
          return (
            <span
              data-testid={`AvatarList-avatar${
                recipient.status === 'owner' ? '-owner' : ''
              }`}
              key={recipient.index}
            >
              <GroupAvatar size={size} />
            </span>
          )
        }

        return (
          <span
            data-testid={`AvatarList-avatar${
              recipient.status === 'owner' ? '-owner' : ''
            }`}
            key={recipient.index}
          >
            <MemberAvatar recipient={recipient} size={size} />
          </span>
        )
      })}
    </div>
  )
}

export { AvatarList }
