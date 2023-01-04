import React from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { Media, Img, Bd } from 'cozy-ui/transpiled/react/Media'
import Typography from 'cozy-ui/transpiled/react/Typography'
import Icon from 'cozy-ui/transpiled/react/Icon'
import PaperplaneIcon from 'cozy-ui/transpiled/react/Icons/Paperplane'
import ToTheCloudIcon from 'cozy-ui/transpiled/react/Icons/ToTheCloud'
import EyeIcon from 'cozy-ui/transpiled/react/Icons/Eye'

import styles from './recipient.styl'

const RecipientStatus = ({ status, isMe, instance }) => {
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

export default RecipientStatus
