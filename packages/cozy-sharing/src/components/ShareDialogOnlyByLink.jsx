import cx from 'classnames'
import React from 'react'
import { useI18n } from 'twake-i18n'

import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Typography from 'cozy-ui/transpiled/react/Typography'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import { default as DumbShareByLink } from './ShareByLink'
import WhoHasAccess from './WhoHasAccess'

const ShareDialogOnlyByLink = ({
  isOwner,
  onRevoke,
  onRevokeSelf,
  recipients,
  document,
  documentType,
  link,
  onClose,
  permissions
}) => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()

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
            onRevoke={onRevoke}
            onRevokeSelf={onRevokeSelf}
            recipients={recipients}
            link={link}
            permissions={permissions}
          />
          <div
            className={cx(
              'u-mt-half',
              isMobile ? 'u-ph-1 u-mb-1' : 'u-ph-2 u-mb-1-half'
            )}
          >
            <DumbShareByLink
              link={link}
              document={document}
              documentType={documentType}
            />
          </div>
        </>
      }
    />
  )
}
export default ShareDialogOnlyByLink
