// @ts-check
import React from 'react'
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
import { useCozyConfirmDialog } from '../../CozyConfirmDialogProvider'
import logger from '../../../logger'
import useOAuthExtraParams from '../../hooks/useOAuthExtraParams'

const BIContractActivationWindow = ({
  konnector,
  account,
  t,
  intentsApi,
  innerAccountModalOverrides,
  onAccountDeleted
}) => {
  const konnectorPolicy = findKonnectorPolicy(konnector)
  const client = useClient()

  const webviewIntent = useWebviewIntent()
  const cozyConfirmDialog = useCozyConfirmDialog()

  const { extraParams } = useOAuthExtraParams({
    client,
    account,
    konnector,
    manage: true
  })

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
        closeLabel: t('close'),
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
