import React from 'react'
import { useI18n } from 'twake-i18n'

import { useClient, generateWebLink } from 'cozy-client'
import Buttons from 'cozy-ui/transpiled/react/Buttons'
import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Empty from 'cozy-ui/transpiled/react/Empty'
import Typography from 'cozy-ui/transpiled/react/Typography'

import { GroupRecipientDetailWithAccess } from './GroupRecipientDetailWithAccess'
import { GroupRecipientDetailWithoutAccess } from './GroupRecipientDetailWithoutAccess'

const GroupRecipientDetail = ({ name, owner, members, onClose, isOwner }) => {
  const client = useClient()
  const { t } = useI18n()
  const withAccess = members.filter(
    member => !['revoked', 'mail-not-sent'].includes(member.status)
  )
  const withoutAccess = members.filter(member =>
    ['revoked', 'mail-not-sent'].includes(member.status)
  )

  const ownerName = owner.public_name
  const contactsLink = generateWebLink({
    cozyUrl: client.getStackClient().uri,
    slug: 'contacts',
    pathname: '/',
    subDomainType: client.getInstanceOptions().subdomain
  })

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
          {members.length === 0 ? (
            <Empty text={t('GroupRecipientDetail.empty.content')}>
              <Buttons
                component="a"
                className="u-mt-1"
                href={contactsLink}
                target="_blank"
                rel="noopener noreferrer"
                label={t('GroupRecipientDetail.empty.action')}
              />
            </Empty>
          ) : null}
          {withAccess.length > 0 ? (
            <GroupRecipientDetailWithAccess withAccess={withAccess} />
          ) : null}
          {withoutAccess.length > 0 ? (
            <GroupRecipientDetailWithoutAccess
              withoutAccess={withoutAccess}
              isOwner={isOwner}
            />
          ) : null}
        </div>
      }
    />
  )
}

export { GroupRecipientDetail }
