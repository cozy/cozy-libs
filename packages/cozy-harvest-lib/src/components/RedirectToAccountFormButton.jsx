import React, { useContext, useCallback } from 'react'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Button from 'cozy-ui/transpiled/react/Button'
import { getAccountId } from '../helpers/triggers'
import { MountPointContext } from './MountPointContext'

const RedirectToAccountFormButton = ({ trigger }) => {
  const { t } = useI18n()
  const accountId = getAccountId(trigger)
  const { pushHistory } = useContext(MountPointContext)
  const handleClick = useCallback(() => {
    pushHistory(`/accounts/${accountId}/edit?reconnect`)
  }, [accountId, pushHistory])
  return (
    <Button
      className="u-ml-0"
      theme="secondary"
      label={t('error.reconnect-via-form')}
      onClick={handleClick}
    />
  )
}

export default RedirectToAccountFormButton
