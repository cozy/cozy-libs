// @ts-check
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useClient } from 'cozy-client'
import Button from 'cozy-ui/transpiled/react/MuiCozyTheme/Buttons'
import ListItem from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem'
import { findKonnectorPolicy } from '../../../konnector-policies'
import withLocales from '../../hoc/withLocales'
import {
  intentsApiProptype,
  innerAccountModalOverridesProptype
} from '../../../helpers/proptypes'
import isEqual from 'lodash/isEqual'
import { openOAuthWindow } from '../../OAuthService'
import { useWebviewIntent } from 'cozy-intent'
import logger from '../../services/logger'

const BIContractActivationWindow = ({
  konnector,
  account,
  t,
  intentsApi,
  innerAccountModalOverrides
}) => {
  const [extraParams, setExtraParams] = useState(null)
  const konnectorPolicy = findKonnectorPolicy(konnector)
  const client = useClient()

  const webviewIntent = useWebviewIntent()

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

  const afterOAuthWindow = async () => {
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
          onClick={() => {
            openOAuthWindow({
              client,
              konnector,
              account,
              extraParams,
              intentsApi,
              webviewIntent,
              manage: true
            })
              .then(afterOAuthWindow)
              .catch(err => {
                logger.error('openOAuthWindow error', err)
              })
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
  innerAccountModalOverrides: innerAccountModalOverridesProptype
}

// use isEqual to avoid an infinite rerender since the konnector object is a new one on each render
// when used in the home application
export default React.memo(withLocales(BIContractActivationWindow), isEqual)
