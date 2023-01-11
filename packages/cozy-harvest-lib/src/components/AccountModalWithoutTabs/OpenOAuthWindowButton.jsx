import React, { useCallback } from 'react'
import PropTypes from 'prop-types'

import flag from 'cozy-flags'
import { useClient } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { Button } from 'cozy-ui/transpiled/react/Button'

import useOAuthExtraParams from '../hooks/useOAuthExtraParams'
import { OAUTH_SERVICE_OK, openOAuthWindow } from '../OAuthService'

const OpenOAuthWindowButton = ({ flow, account, konnector }) => {
  const { t } = useI18n()
  const client = useClient()

  const { extraParams } = useOAuthExtraParams({
    account,
    client,
    konnector,
    reconnect: true
  })

  const handleClick = useCallback(async () => {
    const response = await openOAuthWindow({
      client,
      konnector,
      account,
      extraParams,
      reconnect: true
    })

    if (
      response.result === OAUTH_SERVICE_OK &&
      flag('harvest.bi.fullwebhooks')
    ) {
      flow.expectTriggerLaunch()
    }
  }, [account, client, extraParams, flow, konnector])

  return (
    <Button
      className="u-ml-0"
      variant="secondary"
      label={t('error.reconnect-via-form')}
      onClick={handleClick}
      disabled={!extraParams}
      busy={!extraParams}
    />
  )
}

OpenOAuthWindowButton.propTypes = {
  flow: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
  konnector: PropTypes.object.isRequired
}

export default OpenOAuthWindowButton
