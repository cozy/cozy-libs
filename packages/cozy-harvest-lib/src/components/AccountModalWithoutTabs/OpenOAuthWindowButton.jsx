import PropTypes from 'prop-types'
import React, { useCallback } from 'react'

import { useClient } from 'cozy-client'
import flag from 'cozy-flags'
import { useWebviewIntent } from 'cozy-intent'
import Button from 'cozy-ui/transpiled/react/Buttons'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import { intentsApiProptype } from '../../helpers/proptypes'
import { OAUTH_SERVICE_OK, openOAuthWindow } from '../OAuthService'
import useOAuthExtraParams from '../hooks/useOAuthExtraParams'

const OpenOAuthWindowButton = ({ flow, account, konnector, intentsApi }) => {
  const { t } = useI18n()
  const client = useClient()
  const webviewIntent = useWebviewIntent()

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
      intentsApi,
      webviewIntent,
      reconnect: true
    })

    if (
      response.result === OAUTH_SERVICE_OK &&
      flag('harvest.bi.fullwebhooks')
    ) {
      flow.expectTriggerLaunch()
    }
  }, [account, client, extraParams, flow, konnector, webviewIntent, intentsApi])

  return (
    <Button
      variant="text"
      color="error"
      size="small"
      disabled={!extraParams}
      label={t('card.launchTrigger.button.label')}
      onClick={handleClick}
      busy={!extraParams}
    />
  )
}

OpenOAuthWindowButton.propTypes = {
  flow: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
  konnector: PropTypes.object.isRequired,
  intentsApi: intentsApiProptype
}

export default OpenOAuthWindowButton
