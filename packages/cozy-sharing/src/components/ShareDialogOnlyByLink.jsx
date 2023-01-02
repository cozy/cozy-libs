import React from 'react'
import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import { default as DumbShareByLink } from './ShareByLink'
import Typography from 'cozy-ui/transpiled/react/Typography'

const ShareDialogOnlyByLink = ({
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
          <Typography variant="h6" className="u-mb-1-half">
            {t('Share.contacts.whoHasAccess')}
          </Typography>
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
