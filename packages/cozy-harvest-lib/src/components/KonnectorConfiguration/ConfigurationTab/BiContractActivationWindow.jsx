// @ts-check
import isEqual from 'lodash/isEqual'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'

import { useClient } from 'cozy-client'
import { useWebviewIntent } from 'cozy-intent'
import Button from 'cozy-ui/transpiled/react/Button'
import ListItem from 'cozy-ui/transpiled/react/ListItem'

import {
  intentsApiProptype,
  innerAccountModalOverridesProptype
} from '../../../helpers/proptypes'
import { findKonnectorPolicy } from '../../../konnector-policies'
import logger from '../../../logger'
import { useCozyConfirmDialog } from '../../CozyConfirmDialogProvider'
import { openOAuthWindow } from '../../OAuthService'
import withLocales from '../../hoc/withLocales'

const BIContractActivationWindow = ({
  konnector,
  account,
  t,
  intentsApi,
  innerAccountModalOverrides,
  onAccountDeleted
}) => {
  const [extraParams, setExtraParams] = useState(null)
  const konnectorPolicy = findKonnectorPolicy(konnector)
  const client = useClient()

  const webviewIntent = useWebviewIntent()
  const cozyConfirmDialog = useCozyConfirmDialog()

  /**
   * Detects if a BI connection has been removed
   *
   * @param {String} [finalLocation] - url search param string from the final oauth location
   * @returns {Boolean}
   */
  const isBIConnectionRemoved = finalLocation => {
    const queryParams = new URLSearchParams(finalLocation)
    return queryParams.get('connection_deleted') === 'true'
  }

  /**
   * Actions run after OAuthService has been resolved
   *
   * @param {import('../../OAuthService').OAuthServiceResult} result
   */
  const afterOAuthWindow = async result => {
    if (isBIConnectionRemoved(result?.data?.finalLocation)) {
      await cozyConfirmDialog.showDialog({
        title: t('modal.deleteBIConnection.title'),
        closeLabel: t('modal.deleteBIConnection.confirm-deletion'),
        description: t('modal.deleteBIConnection.description')
      })
      onAccountDeleted()
    }
    konnectorPolicy.refreshContracts({ client, account, konnector })
  }

  /**
   * @typedef FinalOAuthRealtimeMessage
   * @property {String} finalLocation - url search param string from the final oauth location
   * @property {String|null} err - OAuth error message
   * @property {String} oAuthStateKey - OAuth key
   */

  useEffect(() => {
    async function handleLinkFetch() {
      const result = await konnectorPolicy.fetchExtraOAuthUrlParams({
        client,
        account,
        konnector,
        manage: true
      })
      setExtraParams(result)
    }
    if (konnectorPolicy.fetchExtraOAuthUrlParams) {
      handleLinkFetch()
    }
  }, [konnector, account, client, konnectorPolicy])

  if (!konnectorPolicy.fetchExtraOAuthUrlParams) return null

  const ButtonWrapper = innerAccountModalOverrides?.SyncButtonWrapperComp
    ? innerAccountModalOverrides.SyncButtonWrapperComp
    : React.Fragment

  return (
    <ListItem>
      <ButtonWrapper>
        <Button
          variant="text"
          color="primary"
          disabled={!extraParams}
          onClick={async () => {
            try {
              const result = await openOAuthWindow({
                client,
                konnector,
                account,
                extraParams,
                intentsApi,
                webviewIntent,
                manage: true
              })
              await afterOAuthWindow(result)
            } catch (err) {
              logger.error('openOAuthWindow error', err)
            }
          }}
        >
          {t('contracts.handle-synchronization')}
        </Button>
      </ButtonWrapper>
    </ListItem>
  )
}

BIContractActivationWindow.propTypes = {
  t: PropTypes.func,
  account: PropTypes.object,
  intentsApi: intentsApiProptype,
  innerAccountModalOverrides: innerAccountModalOverridesProptype,
  onAccountDeleted: PropTypes.func
}

// use isEqual to avoid an infinite rerender since the konnector object is a new one on each render
// when used in the home application
export default React.memo(withLocales(BIContractActivationWindow), isEqual)
