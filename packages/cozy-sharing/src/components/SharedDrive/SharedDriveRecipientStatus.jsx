import React from 'react'
import { useI18n } from 'twake-i18n'

import Typography from 'cozy-ui/transpiled/react/Typography'

const SharedDriveRecipientStatus = ({ members, email }) => {
  const { t } = useI18n()

  const text = members
    ? t('GroupRecipient.secondary', {
        memberCount: members.length,
        smart_count: members.length
      })
    : email

  return (
    <Typography variant="caption" color="textSecondary">
      {text}
    </Typography>
  )
}

export default SharedDriveRecipientStatus
