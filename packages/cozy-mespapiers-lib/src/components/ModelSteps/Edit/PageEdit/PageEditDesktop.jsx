import React from 'react'

import Button from 'cozy-ui/transpiled/react/Buttons'
import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const PageEditDesktop = ({ onClose, onConfirm, isBusy, children }) => {
  const { t } = useI18n()

  return (
    <Dialog
      open
      onClose={onClose}
      title={t('PageEdit.title')}
      content={children}
      actions={
        <Button
          label={t('common.apply')}
          onClick={() => onConfirm()}
          fullWidth
          busy={isBusy}
        />
      }
    />
  )
}

export default PageEditDesktop
