import React from 'react'
import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import { default as DumbShareByLink } from './ShareByLink'
import WhoHasAccess from './WhoHasAccess'
import Typography from 'cozy-ui/transpiled/react/Typography'

const ShareDialogOnlyByLink = ({
  isOwner,
  onRevoke,
  onRevokeSelf,
  recipients,
  document,
  documentType,
  link,
  onClose,
  onRevokeLink,
  onShareByLink,
  onUpdateShareLinkPermissions,
  permissions
}) => {
  const { t } = useI18n()
  return (
    <Dialog
      disableEnforceFocus
      open={true}
      onClose={onClose}
      title={t(`${documentType}.share.title`, {
        name: document.name || document.attributes.name
      })}
      content={
        <>
          <Typography variant="h6">
            {t('Share.contacts.whoHasAccess')}
          </Typography>
          <WhoHasAccess
            className="u-mt-half"
            document={document}
            documentType={documentType}
            isOwner={isOwner}
            onRevoke={onRevoke}
            onRevokeSelf={onRevokeSelf}
            recipients={recipients}
            link={link}
            permissions={permissions}
            onUpdateShareLinkPermissions={onUpdateShareLinkPermissions}
            onRevokeLink={onRevokeLink}
          />
          <DumbShareByLink
            checked={link !== null}
            document={document}
            documentType={documentType}
            link={link}
            onChangePermissions={onUpdateShareLinkPermissions}
            onDisable={onRevokeLink}
            onEnable={onShareByLink}
            permissions={permissions}
            popperOptions={{
              strategy: 'fixed'
            }}
          />
        </>
      }
    />
  )
}
export default ShareDialogOnlyByLink
