import React from 'react'
import { useI18n } from 'twake-i18n'

import Icon from 'cozy-ui/transpiled/react/Icon'
import EyeIcon from 'cozy-ui/transpiled/react/Icons/Eye'
import PaperplaneIcon from 'cozy-ui/transpiled/react/Icons/Paperplane'
import ToTheCloudIcon from 'cozy-ui/transpiled/react/Icons/ToTheCloud'
import Typography from 'cozy-ui/transpiled/react/Typography'

const MemberRecipientStatus = ({ status, isMe, instance, typographyProps }) => {
  const { t } = useI18n()

  const isSendingEmail = !isMe && status === 'mail-not-sent'
  const isReady = isMe || status === 'ready' || status === 'owner'
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
    <div className="u-flex u-flex-items-center">
      <Icon icon={icon} size={10} />
      &nbsp;
      <Typography variant="caption" color="textSecondary" {...typographyProps}>
        {text}
      </Typography>
    </div>
  )
}

export default MemberRecipientStatus
