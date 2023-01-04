import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { useClient } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import CompositeRow from 'cozy-ui/transpiled/react/CompositeRow'

import styles from './recipient.styl'
import { getDisplayName } from '../../models'
import RecipientConfirm from './RecipientConfirm'
import RecipientPermissions from './RecipientPermissions'
import RecipientAvatar from './RecipientAvatar'
import RecipientStatus from './RecipientStatus'

import Typography from 'cozy-ui/transpiled/react/Typography'

const DEFAULT_DISPLAY_NAME = 'Share.contacts.defaultDisplayName'

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
    <RecipientPermissions {...props} className="u-flex-shrink-0" />
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
      secondaryText={
        <RecipientStatus status={status} isMe={isMe} instance={instance} />
      }
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
