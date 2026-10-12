import cx from 'classnames'
import React from 'react'

import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Typography from 'cozy-ui/transpiled/react/Typography'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'twake-i18n'

import AntivirusAlert from './AntivirusAlert'
import { default as DumbShareByLink } from './ShareByLink'
import WhoHasAccess from './WhoHasAccess'
import { useSharingContext } from '../hooks/useSharingContext'

const ShareDialogOnlyByLink = ({
  isOwner,
  onRevoke,
  onRevokeSelf,
  recipients,
  document,
  documentType,
  onClose,
  permissions,
  showGenerateLinkButton,
  autoOpenShareRestriction,
  canManageMembers = true
}) => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const { getSharingLink } = useSharingContext()
  const displayedLink = getSharingLink(document._id || document.id)

  return (
    <Dialog
      disableGutters
      disableEnforceFocus
      open={true}
      onClose={onClose}
      title={t(`${documentType}.share.title`, {
        name: document.name || document.attributes.name
      })}
      content={
        <>
          <AntivirusAlert document={document} />
          <Typography
            variant="h6"
            className={cx(isMobile ? 'u-ph-1 u-mt-1' : 'u-ph-2 u-mt-1-half')}
          >
            {t('Share.contacts.whoHasAccess')}
          </Typography>
          <WhoHasAccess
            document={document}
            documentType={documentType}
            isOwner={isOwner}
            canManageMembers={canManageMembers}
            onRevoke={onRevoke}
            onRevokeSelf={onRevokeSelf}
            recipients={recipients}
            link={displayedLink}
            permissions={permissions}
          />
          <div
            className={cx(
              'u-mt-half',
              isMobile ? 'u-ph-1 u-mb-1' : 'u-ph-2 u-mb-1-half'
            )}
          >
            <DumbShareByLink
              link={displayedLink}
              document={document}
              documentType={documentType}
              showGenerateLinkButton={showGenerateLinkButton}
              autoOpenShareRestriction={autoOpenShareRestriction}
            />
          </div>
        </>
      }
    />
  )
}
export default ShareDialogOnlyByLink
