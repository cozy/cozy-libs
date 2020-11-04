import React from 'react'
import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import { default as DumbShareByLink } from './ShareByLink'

const ShareDialogOnlyByLink = ({
  onClose,
  documentType,
  document,
  permissions,
  link,
  onShareByLink,
  onRevokeLink,
  onUpdateShareLinkPermissions
}) => {
  const { t } = useI18n()
  return (
    <Dialog
      disableEnforceFocus
      opened={true}
      onClose={onClose}
      title={t(`${documentType}.share.title`, {
        name: document.name || document.attributes.name
      })}
      content={
        <DumbShareByLink
          document={document}
          permissions={permissions}
          documentType={documentType}
          checked={link !== null}
          link={link}
          onEnable={onShareByLink}
          onDisable={onRevokeLink}
          onChangePermissions={onUpdateShareLinkPermissions}
          popperOptions={{
            strategy: 'fixed'
          }}
        />
      }
    />
  )
}
export default ShareDialogOnlyByLink
