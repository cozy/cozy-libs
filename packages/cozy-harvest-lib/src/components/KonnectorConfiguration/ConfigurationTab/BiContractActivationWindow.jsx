// @ts-check
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useClient } from 'cozy-client'
import Button from 'cozy-ui/transpiled/react/MuiCozyTheme/Buttons'
import ListItem from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem'
import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { findKonnectorPolicy } from '../../../konnector-policies'
import OAuthWindow from '../../OAuthWindow'
import withLocales from '../../hoc/withLocales'
import {
  intentsApiProptype,
  innerAccountModalOverridesProptype
} from '../../../helpers/proptypes'
import isEqual from 'lodash/isEqual'

const BIContractActivationWindow = ({
  konnector,
  account,
  t,
  intentsApi,
  innerAccountModalOverrides,
  onAccountDeleted
}) => {
  const [extraParams, setExtraParams] = useState(null)
  const [isWindowVisible, setWindowVisible] = useState(false)
  const [isDeleteConnectionDialogVisible, setDeleteConnectionDialogVisible] =
    useState(false)
  const [shouldRefreshContracts, setShouldRefreshContracts] = useState(false)

  const konnectorPolicy = findKonnectorPolicy(konnector)
  const client = useClient()

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
   * @typedef FinalOAuthRealtimeMessage
   * @property {String} finalLocation - url search param string from the final oauth location
   * @property {String|null} err - OAuth error message
   * @property {String} oAuthStateKey - OAuth key
   */

  /**
   *
   * @param {String} key - OAuth key
   * @param {FinalOAuthRealtimeMessage} [oauthData]
   */
  const onPopupClosed = (key, oauthData) => {
    setWindowVisible(false)
    if (oauthData && isBIConnectionRemoved(oauthData.finalLocation)) {
      setDeleteConnectionDialogVisible(true)
    } else {
      setShouldRefreshContracts(true)
    }
  }

  useEffect(() => {
    if (shouldRefreshContracts) {
      setShouldRefreshContracts(false)
      konnectorPolicy.refreshContracts({ client, account, konnector })
    }
  }, [account, client, konnectorPolicy, shouldRefreshContracts, konnector])

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
          onClick={() => setWindowVisible(true)}
        >
          {t('contracts.handle-synchronization')}
        </Button>
      </ButtonWrapper>
      <Dialog
        open={isDeleteConnectionDialogVisible}
        title={t('modal.deleteBIConnection.title')}
        content={t('modal.deleteBIConnection.description')}
        onClose={onAccountDeleted}
        actions={
          <>
            <Button
              variant="text"
              color="primary"
              aria-label="Close dialog"
              onClick={onAccountDeleted}
            >
              {t('close')}
            </Button>
          </>
        }
      />
      {isWindowVisible && (
        <OAuthWindow
          extraParams={extraParams}
          konnector={konnector}
          account={account}
          intentsApi={intentsApi}
          onSuccess={onPopupClosed}
          onCancel={onPopupClosed}
          manage={true}
        />
      )}
    </ListItem>
  )
}

BIContractActivationWindow.propTypes = {
  t: PropTypes.func,
  account: PropTypes.object,
  intentsApi: intentsApiProptype,
  innerAccountModalOverrides: innerAccountModalOverridesProptype,
  /** What to do when the current account is deleted */
  onAccountDeleted: PropTypes.func
}

// use isEqual to avoid an infinite rerender since the konnector object is a new one on each render
// when used in the home application
export default React.memo(withLocales(BIContractActivationWindow), isEqual)
