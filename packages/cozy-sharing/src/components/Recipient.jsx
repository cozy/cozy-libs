import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { useClient } from 'cozy-client'
import { Spinner } from 'cozy-ui/transpiled/react'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Avatar from 'cozy-ui/transpiled/react/Avatar'
import CompositeRow from 'cozy-ui/transpiled/react/CompositeRow'
import DropdownButton from 'cozy-ui/transpiled/react/DropdownButton'
import ActionMenu, { ActionMenuItem } from 'cozy-ui/transpiled/react/ActionMenu'
import { Text, Caption } from 'cozy-ui/transpiled/react/Text'
import Icon from 'cozy-ui/transpiled/react/Icon'
import { Media, Img, Bd } from 'cozy-ui/transpiled/react/Media'

import AvatarPlusX from './AvatarPlusX'
import styles from './recipient.styl'
import modalStyles from '../share.styl'
import { getDisplayName, getInitials } from '../models'
import Identity from './Identity'

export const MAX_DISPLAYED_RECIPIENTS = 3
const DEFAULT_DISPLAY_NAME = 'Share.contacts.defaultDisplayName'

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

export const RecipientsAvatars = ({
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
            icon="link"
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

export const RecipientAvatar = ({ recipient, ...rest }) => {
  const client = useClient()
  return (
    <Avatar
      /**
       * avatarPath is always the same for a recipient, but image
       * can be different since the stack generate it on the fly.
       * It can be "gray" during the first load depending of the
       * status' sharing, but can become active (from the realtime)
       * so we need a way to "refresh" the image. Passing the
       * status in the url force the refresh of the image when the
       * status changes
       */
      image={`${client.options.uri}${recipient.avatarPath}?v=${recipient.status}`}
      text={getInitials(recipient)}
      textId={getDisplayName(recipient)}
      disabled={
        recipient.status === 'pending' || recipient.status === 'mail-not-send'
      }
      {...rest}
    />
  )
}

export const OwnerIdentity = ({ url, size, ...rest }) => (
  <div className={styles['avatar']}>
    <Avatar
      text={getInitials(rest)}
      size={size}
      textId={getDisplayName(rest)}
    />
    <Identity name={getDisplayName(rest)} details={url} />
  </div>
)

export const Permissions = ({
  isOwner,
  status,
  instance,
  type,
  document,
  documentType,
  className,
  onRevoke,
  onRevokeSelf,
  sharingId,
  index
}) => {
  const { t } = useI18n()
  const client = useClient()
  const [revoking, setRevoking] = useState(false)
  const [isMenuDisplayed, setIsMenuDisplayed] = useState(false)
  const instanceMatchesClient =
    instance !== undefined && instance === client.options.uri
  const contactIsOwner = status === 'owner'
  const shouldShowMenu =
    !revoking &&
    !contactIsOwner &&
    ((instanceMatchesClient && !isOwner) || isOwner)

  const showMenu = () => setIsMenuDisplayed(true)
  const hideMenu = () => setIsMenuDisplayed(false)

  const onRevokeClick = useCallback(async () => {
    setRevoking(true)
    if (isOwner) {
      await onRevoke(document, sharingId, index)
    } else {
      await onRevokeSelf(document)
    }

    setRevoking(false)
  }, [isOwner, onRevoke, onRevokeSelf, document, sharingId, index])

  const buttonRef = React.createRef()
  const permissionIconName = type === 'two-way' ? 'rename' : 'eye'

  return (
    <div className={className}>
      {revoking && <Spinner />}
      {!shouldShowMenu && !revoking && (
        <span>{t(`Share.status.${status}`)}</span>
      )}
      {shouldShowMenu && (
        <>
          <DropdownButton
            onClick={showMenu}
            ref={buttonRef}
            className={modalStyles['aligned-dropdown-button']}
          >
            {t(`Share.type.${type}`)}
          </DropdownButton>
          {isMenuDisplayed && (
            <ActionMenu
              onClose={hideMenu}
              placement="bottom-end"
              anchorElRef={buttonRef}
              preventOverflow
            >
              <ActionMenuItem
                left={
                  <Icon
                    icon={permissionIconName}
                    color="var(--primaryTextColor)"
                  />
                }
              >
                {t(`Share.type.${type}`)}
              </ActionMenuItem>

              <hr />
              <ActionMenuItem
                onClick={onRevokeClick}
                left={<Icon icon="trash" color="var(--pomegranate)" />}
              >
                <Text className="u-pomegranate">
                  {isOwner
                    ? t(`${documentType}.share.revoke.title`)
                    : t(`${documentType}.share.revokeSelf.title`)}
                </Text>
                <Caption>
                  {isOwner
                    ? t(`${documentType}.share.revoke.desc`)
                    : t(`${documentType}.share.revokeSelf.desc`)}
                </Caption>
              </ActionMenuItem>
            </ActionMenu>
          )}
        </>
      )}
    </div>
  )
}

const Status = ({ status, isMe, instance }) => {
  const { t } = useI18n()

  const isSendingEmail = !isMe && status === 'mail-not-sent'
  const isReady = isMe || status === 'ready'
  let text, icon
  if (isReady) {
    text = instance
    icon = 'to-the-cloud'
  } else if (isSendingEmail) {
    text = t('Share.status.mail-not-sent')
    icon = 'paperplane'
  } else {
    const supportedStatus = ['pending', 'seen']
    text = supportedStatus.includes(status)
      ? t(`Share.status.${status}`)
      : t('Share.status.pending')

    icon = status === 'seen' ? 'eye' : 'paperplane'
  }

  return (
    <Media>
      <Img className={styles['recipient-status-icon']}>
        <Icon icon={icon} size={10} />
      </Img>
      <Bd>
        <Caption>{text}</Caption>
      </Bd>
    </Media>
  )
}

const Recipient = props => {
  const { t } = useI18n()
  const client = useClient()
  const { instance, isOwner, status, ...rest } = props
  const isMe =
    (isOwner && status === 'owner') || instance === client.options.uri
  const defaultDisplayName = t(DEFAULT_DISPLAY_NAME)
  const name = getDisplayName(rest, defaultDisplayName)

  return (
    <CompositeRow
      dense
      className={cx(styles['recipient'], 'u-ph-0')}
      primaryText={
        <Text className="u-ellipsis">
          {isMe ? t('Share.recipients.you') : name}
        </Text>
      }
      secondaryText={<Status status={status} isMe={isMe} instance={instance} />}
      image={<RecipientAvatar recipient={props} />}
      right={<Permissions {...props} className="u-flex-shrink-0" />}
    />
  )
}

export default Recipient

export const RecipientWithoutStatus = ({ instance, ...rest }) => {
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

export const RecipientPlusX = ({ extraRecipients }, { t }) => (
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
