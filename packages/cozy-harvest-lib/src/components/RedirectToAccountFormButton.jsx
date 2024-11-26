import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import { triggers as triggersModel } from 'cozy-client/dist/models/trigger'
import Button from 'cozy-ui/transpiled/react/Buttons'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const RedirectToAccountFormButton = ({ trigger }) => {
  const { t } = useI18n()
  const navigate = useNavigate()

  const accountId = triggersModel.getAccountId(trigger)

  const handleClick = useCallback(() => {
    navigate(`../accounts/${accountId}/edit?reconnect`, { replace: true })
  }, [accountId, navigate])

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
