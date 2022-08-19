import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import Button from 'cozy-ui/transpiled/react/Button'
import OAuthWindow from './OAuthWindow'
import compose from 'lodash/flowRight'
import withConnectionFlow from '../models/withConnectionFlow'
import withLocales from './hoc/withLocales'
import { findKonnectorPolicy } from '../konnector-policies'
import { intentsApiProptype } from '../helpers/proptypes'
import TriggerErrorInfo from './infos/TriggerErrorInfo'
import { ERROR_EVENT, LOGIN_SUCCESS_EVENT } from '../models/flowEvents'
import { KonnectorJobError } from '../helpers/konnectors'

/**
 * The OAuth Form is responsible for displaying a form for OAuth konnectors. It
 * starts the OAuth process
 */
export const OAuthForm = props => {
  const {
    account,
    client,
    flow,
    flowState,
    intentsApi,
    konnector,
    onSuccess,
    reconnect,
    t
  } = props

  const [needsExtraParams, setNeedsExtraParams] = useState(false)
  const [extraParams, setExtraParams] = useState(null)
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

  const handleAccountId = accountId => {
    if (typeof onSuccess === 'function') onSuccess(accountId)
  }

  const handleConnect = () => {
    setShowOAuthWindow(true)
  }

  const handleOAuthCancel = err => {
    flow.triggerEvent(ERROR_EVENT, translateOauthError(err))
    setShowOAuthWindow(false)
  }

  const handleLoginSuccess = () => {
    setShowOAuthWindow(false)
  }

  useEffect(() => {
    const konnectorPolicy = findKonnectorPolicy(konnector)

    if (konnectorPolicy.fetchExtraOAuthUrlParams) {
      setNeedsExtraParams(true)
      if (reconnect) {
        setShowOAuthWindow(true)
      }
      // eslint-disable-next-line promise/catch-or-return
      konnectorPolicy
        .fetchExtraOAuthUrlParams({
          account,
          konnector,
          client,
          reconnect
        })
        .then(setExtraParams)
    }
    flow.on(LOGIN_SUCCESS_EVENT, handleLoginSuccess)

    return () => {
      flow.removeListener(LOGIN_SUCCESS_EVENT, handleLoginSuccess)
    }
  }, [])

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
      {showOAuthWindow && (!needsExtraParams || extraParams) && (
        <OAuthWindow
          extraParams={extraParams}
          konnector={konnector}
          reconnect={reconnect}
          onSuccess={handleAccountId}
          onCancel={handleOAuthCancel}
          account={account}
          intentsApi={intentsApi}
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

export default compose(withLocales, withConnectionFlow())(OAuthForm)
