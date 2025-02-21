import React from 'react'

import Typography from 'cozy-ui/transpiled/react/Typography'
import { Media, Bd } from 'cozy-ui/transpiled/react/deprecated/Media'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const SharedDriveRecipientStatus = ({ members, email }) => {
  const { t } = useI18n()

  const text = members
    ? t('GroupRecipient.secondary', {
        memberCount: members.length,
        smart_count: members.length
      })
    : email

  return (
    <Media>
      <Bd>
        <Typography variant="caption" color="textSecondary">
          {text}
        </Typography>
      </Bd>
    </Media>
  )
}

export default SharedDriveRecipientStatus
