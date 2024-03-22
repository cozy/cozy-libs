import React from 'react'

import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { GroupRecipientDetailWithAccess } from './GroupRecipientDetailWithAccess'
import { GroupRecipientDetailWithoutAccess } from './GroupRecipientDetailWithoutAccess'

const GroupRecipientDetail = ({ name, owner, members, onClose }) => {
  const { t } = useI18n()
  const withAccess = members.filter(
    member => !['revoked', 'mail-not-sent'].includes(member.status)
  )
  const withoutAccess = members.filter(member =>
    ['revoked', 'mail-not-sent'].includes(member.status)
  )

  const ownerName = owner.public_name

  return (
    <Dialog
      open
      size="small"
      onClose={onClose}
      title={
        <>
          {name}
          {ownerName ? (
            <Typography variant="caption">
              {t('GroupRecipientDetail.subtitle', { ownerName })}
            </Typography>
          ) : null}
        </>
      }
      content={
        <div className="u-flex u-stack-xs u-flex-column">
          {withAccess.length > 0 ? (
            <GroupRecipientDetailWithAccess withAccess={withAccess} />
          ) : null}
          {withoutAccess.length > 0 ? (
            <GroupRecipientDetailWithoutAccess withoutAccess={withoutAccess} />
          ) : null}
        </div>
      }
    />
  )
}

export { GroupRecipientDetail }
