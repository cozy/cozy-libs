import PropTypes from 'prop-types'
import React, { useCallback } from 'react'

import { useClient } from 'cozy-client'
import { useWebviewIntent } from 'cozy-intent'
import Button from 'cozy-ui/transpiled/react/Buttons'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import SyncIcon from 'cozy-ui/transpiled/react/Icons/Sync'
import { ActionMenuItem } from 'cozy-ui/transpiled/react/deprecated/ActionMenu'

import { intentsApiProptype } from '../../helpers/proptypes'
import { OAUTH_SERVICE_OK, openOAuthWindow } from '../OAuthService'
import useOAuthExtraParams from '../hooks/useOAuthExtraParams'

const OpenOAuthWindowButton = ({
  flow,
  account,
  konnector,
  intentsApi,
  actionMenuItem = false,
  onClick
}) => {
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
    if (!extraParams) {
      return
    }
    const response = await openOAuthWindow({
      client,
      konnector,
      account,
      extraParams,
      intentsApi,
      webviewIntent,
      reconnect: true
    })

    if (response.result === OAUTH_SERVICE_OK) {
      flow.expectTriggerLaunch()
    }
  }, [account, client, flow, konnector, webviewIntent, intentsApi, extraParams])

  return actionMenuItem ? (
    <ActionMenuItem
      left={<Icon icon={SyncIcon} />}
      onClick={() => {
        handleClick()
        onClick()
      }}
    >
      {t('card.launchTrigger.button.label')}
    </ActionMenuItem>
  ) : (
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
  intentsApi: intentsApiProptype,
  actionMenuItem: PropTypes.bool,
  onClick: PropTypes.func
}

export default OpenOAuthWindowButton
