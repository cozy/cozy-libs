import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useClient } from 'cozy-client'
import Button from 'cozy-ui/transpiled/react/MuiCozyTheme/Buttons'
import ListItem from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem'
import { findKonnectorPolicy } from '../../../konnector-policies'
import OAuthWindow from '../../OAuthWindow'
import withLocales from '../../hoc/withLocales'
import {
  intentsApiProptype,
  innerAccountModalOverridesProptype
} from '../../../helpers/proptypes'

const BIContractActivationWindow = ({
  konnector,
  account,
  t,
  intentsApi,
  innerAccountModalOverrides
}) => {
  const [extraParams, setExtraParams] = useState(null)
  const [isWindowVisible, setWindowVisible] = useState(false)
  const [shouldRefreshContracts, setShouldRefreshContracts] = useState(false)

  const konnectorPolicy = findKonnectorPolicy(konnector)
  const client = useClient()

  const onPopupClosed = () => {
    setWindowVisible(false)
    setShouldRefreshContracts(true)
  }

  useEffect(() => {
    async function refreshContracts() {
      await konnectorPolicy.refreshContracts({ client, account, konnector })
      setShouldRefreshContracts(false)
    }
    if (shouldRefreshContracts) {
      refreshContracts()
    }
  }, [account, client, konnectorPolicy, shouldRefreshContracts, konnector])

  useEffect(() => {
    async function handleLinkFetch() {
      const result = await konnectorPolicy.fetchExtraOAuthUrlParams({
        client,
        account,
        konnector
      })
      setExtraParams(result)
    }
    if (konnectorPolicy.fetchExtraOAuthUrlParams) {
      handleLinkFetch()
    }
  }, [konnector.slug, account, client, konnectorPolicy])

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
      {isWindowVisible && (
        <OAuthWindow
          extraParams={extraParams}
          konnector={konnector}
          account={account}
          intentsApi={intentsApi}
          onSuccess={onPopupClosed}
          onCancel={onPopupClosed}
        />
      )}
    </ListItem>
  )
}

BIContractActivationWindow.propTypes = {
  t: PropTypes.func,
  account: PropTypes.object,
  intentsApi: intentsApiProptype,
  innerAccountModalOverrides: innerAccountModalOverridesProptype
}

export default withLocales(BIContractActivationWindow)
