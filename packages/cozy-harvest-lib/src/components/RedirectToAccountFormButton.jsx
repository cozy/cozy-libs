import React, { useContext, useCallback } from 'react'

import { triggers as triggersModel } from 'cozy-client/dist/models/trigger'
import Button from 'cozy-ui/transpiled/react/Buttons'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { MountPointContext } from './MountPointContext'

const RedirectToAccountFormButton = ({ trigger }) => {
  const { t } = useI18n()
  const accountId = triggersModel.getAccountId(trigger)
  const { replaceHistory } = useContext(MountPointContext)
  const handleClick = useCallback(() => {
    replaceHistory(`/accounts/${accountId}/edit?reconnect`)
  }, [accountId, replaceHistory])
  return (
    <Button
      className="u-ml-0"
      variant="primary"
      color="error"
      label={t('error.reconnect-via-form')}
      onClick={handleClick}
    />
  )
}

export default RedirectToAccountFormButton
