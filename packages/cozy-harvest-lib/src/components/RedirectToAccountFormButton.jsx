import React, { useContext, useCallback } from 'react'

import Button from 'cozy-ui/transpiled/react/deprecated/Button'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { MountPointContext } from './MountPointContext'
import { getAccountId } from '../helpers/triggers'

const RedirectToAccountFormButton = ({ trigger }) => {
  const { t } = useI18n()
  const accountId = getAccountId(trigger)
  const { replaceHistory } = useContext(MountPointContext)
  const handleClick = useCallback(() => {
    replaceHistory(`/accounts/${accountId}/edit?reconnect`)
  }, [accountId, replaceHistory])
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
