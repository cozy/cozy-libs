import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { useClient } from 'cozy-client'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Avatar from 'cozy-ui/transpiled/react/Avatar'
import Button from 'cozy-ui/transpiled/react/Button'
import CompositeRow from 'cozy-ui/transpiled/react/CompositeRow'
import DropdownButton from 'cozy-ui/transpiled/react/DropdownButton'
import ActionMenu, { ActionMenuItem } from 'cozy-ui/transpiled/react/ActionMenu'
import Icon from 'cozy-ui/transpiled/react/Icon'
import { Media, Img, Bd } from 'cozy-ui/transpiled/react/Media'
import RenameIcon from 'cozy-ui/transpiled/react/Icons/Rename'
import TrashIcon from 'cozy-ui/transpiled/react/Icons/Trash'
import EyeIcon from 'cozy-ui/transpiled/react/Icons/Eye'
import PaperplaneIcon from 'cozy-ui/transpiled/react/Icons/Paperplane'
import ToTheCloudIcon from 'cozy-ui/transpiled/react/Icons/ToTheCloud'

import AvatarPlusX from './AvatarPlusX'
import styles from './recipient.styl'
import modalStyles from '../share.styl'
import { getDisplayName, getInitials } from '../models'
import Identity from './Identity'

import LinkIcon from 'cozy-ui/transpiled/react/Icons/Link'

import Typography from 'cozy-ui/transpiled/react/Typography'

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
  const PermissionIcon = type === 'two-way' ? RenameIcon : EyeIcon

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
            <Typography variant="body1">{t(`Share.type.${type}`)}</Typography>
          </DropdownButton>
          {isMenuDisplayed && (
            <ActionMenu
              onClose={hideMenu}
              popperOptions={{
                placement: 'bottom-end',
                modifiers: [
                  {
                    name: 'preventOverflow'
                  }
                ]
              }}
              anchorElRef={buttonRef}
            >
              <ActionMenuItem
                left={
                  <Icon icon={PermissionIcon} color="var(--primaryTextColor)" />
                }
              >
                {t(`Share.type.${type}`)}
              </ActionMenuItem>

              <hr />
              <ActionMenuItem
                onClick={onRevokeClick}
                left={<Icon icon={TrashIcon} color="var(--errorColor)" />}
              >
                <Typography className="u-error" variant="body1">
                  {isOwner
                    ? t(`${documentType}.share.revoke.title`)
                    : t(`${documentType}.share.revokeSelf.title`)}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {isOwner
                    ? t(`${documentType}.share.revoke.desc`)
                    : t(`${documentType}.share.revokeSelf.desc`)}
                </Typography>
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
    icon = ToTheCloudIcon
  } else if (isSendingEmail) {
    text = t('Share.status.mail-not-sent')
    icon = PaperplaneIcon
  } else {
    const supportedStatus = ['pending', 'seen']
    text = supportedStatus.includes(status)
      ? t(`Share.status.${status}`)
      : t('Share.status.pending')

    icon = status === 'seen' ? EyeIcon : PaperplaneIcon
  }

  return (
    <Media>
      <Img className={styles['recipient-status-icon']}>
        <Icon icon={icon} size={10} />
      </Img>
      <Bd>
        <Typography variant="caption" color="textSecondary">
          {text}
        </Typography>
      </Bd>
    </Media>
  )
}

/**
 * Displays the confirmation interface that allows to confirm or reject a recipient
 */
const RecipientConfirm = ({ recipientConfirmationData, verifyRecipient }) => {
  const { t } = useI18n()

  const verify = () => {
    verifyRecipient(recipientConfirmationData)
  }

  return (
    <>
      <Button
        style={{ position: 'initial' }} // fix z-index bug on iOS when under a BottomDrawer due to relative position
        theme="text"
        className={modalStyles['aligned-dropdown-button']}
        onClick={verify}
        label={t(`Share.twoStepsConfirmation.verify`)}
      />
    </>
  )
}

RecipientConfirm.propTypes = {
  recipientConfirmationData: PropTypes.object.isRequired,
  verifyRecipient: PropTypes.func.isRequired
}

const Recipient = props => {
  const { t } = useI18n()
  const client = useClient()

  const {
    instance,
    isOwner,
    status,
    recipientConfirmationData,
    verifyRecipient,
    ...rest
  } = props

  const isMe =
    (isOwner && status === 'owner') || instance === client.options.uri
  const defaultDisplayName = t(DEFAULT_DISPLAY_NAME)
  const name = getDisplayName(rest, defaultDisplayName)

  const RightPart = recipientConfirmationData ? (
    <RecipientConfirm
      recipientConfirmationData={recipientConfirmationData}
      verifyRecipient={verifyRecipient}
    ></RecipientConfirm>
  ) : (
    <Permissions {...props} className="u-flex-shrink-0" />
  )

  return (
    <CompositeRow
      dense
      className={cx(styles['recipient'], 'u-ph-0')}
      primaryText={
        <Typography className="u-ellipsis" variant="body1">
          {isMe ? t('Share.recipients.you') : name}
        </Typography>
      }
      secondaryText={<Status status={status} isMe={isMe} instance={instance} />}
      image={<RecipientAvatar recipient={props} />}
      right={RightPart}
    />
  )
}

Recipient.propTypes = {
  instance: PropTypes.string,
  isOwner: PropTypes.bool,
  status: PropTypes.string,
  recipientConfirmationData: PropTypes.object,
  verifyRecipient: PropTypes.func
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
