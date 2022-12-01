import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import compose from 'lodash/flowRight'

import Button from 'cozy-ui/transpiled/react/Button'

import { useFlowState } from '../models/withConnectionFlow'
import useOAuthExtraParams from './hooks/useOAuthExtraParams'
import withLocales from './hoc/withLocales'
import { intentsApiProptype } from '../helpers/proptypes'
import TriggerErrorInfo from './infos/TriggerErrorInfo'
import { ERROR_EVENT, LOGIN_SUCCESS_EVENT } from '../models/flowEvents'
import { KonnectorJobError } from '../helpers/konnectors'
import { findKonnectorPolicy } from '../konnector-policies'
import flag from 'cozy-flags'
import isEqual from 'lodash/isEqual'
import { useClient } from 'cozy-client'
import {
  OAUTH_SERVICE_ERROR,
  OAUTH_SERVICE_OK,
  openOAuthWindow
} from './OAuthService'
import { useWebviewIntent } from 'cozy-intent'

/**
 * The OAuth Form is responsible for displaying a form for OAuth konnectors. It
 * starts the OAuth process
 */
export const OAuthForm = props => {
  const { account, flow, intentsApi, konnector, onSuccess, reconnect, t } =
    props
  const client = useClient()
  const flowState = useFlowState(flow)
  const webviewIntent = useWebviewIntent()
  const { extraParams, needsExtraParams } = useOAuthExtraParams({
    account,
    client,
    konnector,
    reconnect
  })
  const [showOAuthWindow, setShowOAuthWindow] = useState(false)

  // Helpers

  /**
   *  Translates errors from oauth redirection url to harvest know error messages
   *
   * @param {String} err - original error message in redirection url
   * @returns {KonnectorJobError|String}
   */
  const translateOauthError = err => {
    if (err === 'access_denied') {
      return new KonnectorJobError('OAUTH_CANCELED')
    } else {
      return err
    }
  }

  // Callbacks

  const handleConnect = useCallback(async () => {
    setShowOAuthWindow(true)
    const response = await openOAuthWindow({
      client,
      konnector,
      account,
      extraParams,
      intentsApi,
      webviewIntent,
      reconnect
    })
    setShowOAuthWindow(false)
    if (response.result === OAUTH_SERVICE_OK) {
      const konnectorPolicy = findKonnectorPolicy(konnector)
      if (konnectorPolicy.isBIWebView && flag('harvest.bi.fullwebhooks')) {
        flow.expectTriggerLaunch({ konnector })
      }
      const accountId = response.key
      if (typeof onSuccess === 'function') onSuccess(accountId)
    } else if (response.result === OAUTH_SERVICE_ERROR) {
      flow.triggerEvent(ERROR_EVENT, translateOauthError(response.error))
    }
  }, [
    account,
    client,
    extraParams,
    flow,
    intentsApi,
    konnector,
    onSuccess,
    reconnect,
    webviewIntent
  ])

  const handleLoginSuccess = () => {
    setShowOAuthWindow(false)
  }

  useEffect(() => {
    if (reconnect && extraParams) {
      handleConnect()
    }
    flow.on(LOGIN_SUCCESS_EVENT, handleLoginSuccess)

    return () => {
      flow.removeListener(LOGIN_SUCCESS_EVENT, handleLoginSuccess)
    }
  }, [extraParams, flow, handleConnect, reconnect])

  const { error } = flowState
  const isBusy =
    showOAuthWindow || flowState.running || (needsExtraParams && !extraParams)
  const isBankingKonnector = konnector.categories?.includes('banking')
  const buttonLabel = reconnect
    ? isBankingKonnector
      ? 'oauth.banking.reconnect.label'
      : 'oauth.reconnect.label'
    : isBankingKonnector
    ? 'oauth.banking.connect.label'
    : 'oauth.connect.label'

  return (
    <>
      {error && (
        <TriggerErrorInfo
          className="u-mb-1"
          error={error}
          konnector={konnector}
        />
      )}
      {!reconnect && (
        <Button
          className="u-mt-1"
          busy={isBusy}
          disabled={isBusy}
          extension="full"
          label={t(buttonLabel)}
          onClick={handleConnect}
        />
      )}
    </>
  )
}

OAuthForm.propTypes = {
  /** Existing account */
  account: PropTypes.object,
  /** Related Konnector */
  konnector: PropTypes.object.isRequired,
  /** Success callback, takes account as parameter */
  onSuccess: PropTypes.func,
  /** Translation function */
  t: PropTypes.func.isRequired,
  /** Is it a reconnection or not */
  reconnect: PropTypes.bool,
  /** custom intents api. Can have fetchSessionCode, showInAppBrowser, closeInAppBrowser at the moment */
  intentsApi: intentsApiProptype
}

// use isEqual to avoid an infinite rerender since the konnector object is a new one on each render
// when used in the home application
export default React.memo(compose(withLocales)(OAuthForm), isEqual)
