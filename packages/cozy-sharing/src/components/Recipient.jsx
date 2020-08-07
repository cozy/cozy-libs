import React, { useState, useCallback } from 'react'
import { useClient } from 'cozy-client'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { Spinner } from 'cozy-ui/transpiled/react'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { AvatarPlusX, AvatarLink, Avatar } from './Avatar'

import CompositeRow from 'cozy-ui/transpiled/react/CompositeRow'
import DropdownButton from 'cozy-ui/transpiled/react/DropdownButton'
import ActionMenu, { ActionMenuItem } from 'cozy-ui/transpiled/react/ActionMenu'
import { Text, Caption } from 'cozy-ui/transpiled/react/Text'
import Icon from 'cozy-ui/transpiled/react/Icon'
import { Media, Img, Bd } from 'cozy-ui/transpiled/react/Media'

import styles from './recipient.styl'
import modalStyles from '../share.styl'

import { Contact } from '../models'
import Identity from './Identity'

const MAX_DISPLAYED_RECIPIENTS = 3
const DEFAULT_DISPLAY_NAME = 'Share.contacts.defaultDisplayName'

export const RecipientsAvatars = ({
  recipients,
  link,
  size = 'small-plus',
  className,
  onClick
}) => {
  // we reverse the recipients array because we use `flex-direction: row-reverse` to display them correctly
  // we slice first to clone the original array because reverse() mutates it
  const reversedRecipients = recipients.slice().reverse()
  return (
    <div
      className={classNames(
        styles['recipients-avatars'],
        {
          [styles['--interactive']]: onClick
        },
        className
      )}
      onClick={onClick}
    >
      {link && <AvatarLink size={size} />}
      {recipients.length > MAX_DISPLAYED_RECIPIENTS && (
        <AvatarPlusX
          extraRecipients={reversedRecipients
            .slice(MAX_DISPLAYED_RECIPIENTS)
            .map(recipient => Contact.getDisplayName(recipient))}
          size={size}
        />
      )}
      {reversedRecipients
        .slice(0, MAX_DISPLAYED_RECIPIENTS)
        .map((recipient, idx) => (
          <Avatar
            key={idx}
            text={Contact.getInitials(recipient)}
            size={size}
            textId={Contact.getDisplayName(recipient)}
          />
        ))}
    </div>
  )
}

export const UserAvatar = ({ url, size, ...rest }) => (
  <div className={styles['avatar']}>
    <Avatar
      text={Contact.getInitials(rest)}
      size={size}
      textId={Contact.getDisplayName(rest)}
    />
    <Identity name={Contact.getDisplayName(rest)} details={url} />
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
  const isMe =
    instance !== undefined && instance === client.options.uri && !isOwner
  const shouldShowMenu = !revoking && status !== 'owner' && (isMe || isOwner)

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
      {shouldShowMenu && !revoking && (
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

  const isError =
    !isMe && ['error', 'unregistered', 'mail-not-sent'].includes(status)
  const isReady = isMe || status === 'ready'

  let text, icon
  if (isReady) {
    text = instance
    icon = 'to-the-cloud'
  } else if (isError) {
    text = t('Share.status.error')
    icon = 'warning'
  } else {
    text = ['pending', 'seen'].includes(status)
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
        <Caption className={classNames({ 'u-pomegranate': isError })}>
          {text}
        </Caption>
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
  const defaultInitials = defaultDisplayName[0].toUpperCase()
  const name = Contact.getDisplayName(rest, defaultDisplayName)

  return (
    <CompositeRow
      dense
      className={classNames(styles['recipient'], 'u-ph-0')}
      primaryText={
        <Text className="u-ellipsis">
          {isMe ? t('Share.recipients.you') : name}
        </Text>
      }
      secondaryText={<Status status={status} isMe={isMe} instance={instance} />}
      image={
        <Avatar
          text={Contact.getInitials(rest, defaultInitials)}
          size="small-plus"
          textId={name}
        />
      }
      right={<Permissions {...props} className="u-flex-shrink-0" />}
    />
  )
}

export default Recipient

export const RecipientWithoutStatus = ({ instance, ...rest }) => {
  const name = Contact.getDisplayName(rest)
  return (
    <div className={styles['recipient']}>
      <Avatar
        text={Contact.getInitials(rest)}
        size={'small-plus'}
        textId={name}
      />
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
        Contact.getDisplayName(recipient)
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
