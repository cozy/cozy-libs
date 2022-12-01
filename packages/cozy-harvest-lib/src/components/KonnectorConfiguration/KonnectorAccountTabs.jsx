import React, { useState, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useClient } from 'cozy-client'
import flag from 'cozy-flags'

import { makeStyles } from '@material-ui/core/styles'
import { Tab as UITab, Tabs } from 'cozy-ui/transpiled/react/MuiTabs'
import Divider from 'cozy-ui/transpiled/react/MuiCozyTheme/Divider'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import SwipeableViews from 'react-swipeable-views'
import Button from 'cozy-ui/transpiled/react/Buttons'

import useDOMMutations from '../hooks/useDOMMutations'
import FlowProvider from '../FlowProvider'
import DataTab from './DataTab'
import ConfigurationTab from './ConfigurationTab'
import TriggerErrorInfo from '../infos/TriggerErrorInfo'
import RedirectToAccountFormButton from '../RedirectToAccountFormButton'
import useOAuthExtraParams from '../hooks/useOAuthExtraParams'
import { findKonnectorPolicy } from '../../konnector-policies'
import useMaintenanceStatus from '../hooks/useMaintenanceStatus'
import {
  intentsApiProptype,
  innerAccountModalOverridesProptype
} from '../../helpers/proptypes'
import { OAUTH_SERVICE_OK, openOAuthWindow } from '../OAuthService'
import { useWebviewIntent } from 'cozy-intent'

const tabIndexes = {
  data: 0,
  configuration: 1
}

const useTabStyles = makeStyles({
  wrapper: {
    flexDirection: 'row'
  }
})

const Tab = props => {
  const classes = useTabStyles()
  return <UITab classes={classes} {...props} />
}

export const KonnectorAccountTabsTabs = ({ tab, onChange }) => {
  const { t } = useI18n()
  return (
    <Tabs onChange={onChange} value={tab}>
      <Tab label={<>{t('modal.tabs.data')}</>} />
      <Tab label={<>{t('modal.tabs.configuration')}</>} />
    </Tabs>
  )
}

const domMutationsConfig = { childList: true, subtree: true }

const DumbKonnectorAccountTabs = props => {
  const {
    konnector,
    initialTrigger,
    account,
    onAccountDeleted,
    initialActiveTab,
    // TODO rename to onAddAccount
    addAccount,
    showNewAccountButton,
    flow,
    intentsApi,
    innerAccountModalOverrides
  } = props

  const client = useClient()
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const [tab, setTab] = useState(
    initialActiveTab
      ? tabIndexes[initialActiveTab]
      : hasLoginError
      ? tabIndexes.configuration
      : tabIndexes.data
  )
  const {
    data: { isInMaintenance }
  } = useMaintenanceStatus(client, konnector)

  const webviewIntent = useWebviewIntent()

  const handleTabChange = (ev, newTab) => setTab(newTab)

  const flowState = flow.getState()
  const { error } = flowState
  const hasError = !!error
  const hasLoginError = hasError && error.isLoginError()

  const swipeableActions = useRef()
  const nodeRef = useRef()

  const updateSwiperHeight = useCallback(
    () => swipeableActions.current.updateHeight(),
    [swipeableActions]
  )
  useDOMMutations(nodeRef.current, domMutationsConfig, updateSwiperHeight)

  const konnectorPolicy = findKonnectorPolicy(konnector)
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
  }, [account, client, extraParams, flow, intentsApi, konnector, webviewIntent])
  const errorActionButton = konnectorPolicy.isBIWebView ? (
    <Button
      className="u-ml-0"
      variant="secondary"
      label={t('error.reconnect-via-form')}
      onClick={handleClick}
      disabled={!extraParams}
      busy={!extraParams}
    />
  ) : (
    <RedirectToAccountFormButton
      konnector={konnector}
      trigger={initialTrigger}
    />
  )

  return (
    <div ref={nodeRef}>
      <KonnectorAccountTabsTabs
        tab={tab}
        onChange={handleTabChange}
        flowState={flowState}
      />
      <Divider />

      {error && !isInMaintenance && (
        <TriggerErrorInfo
          error={error}
          konnector={konnector}
          action={error.isSolvableViaReconnect() ? errorActionButton : null}
          className="u-mt-1"
        />
      )}
      <SwipeableViews
        animateHeight={true}
        index={tab}
        disabled
        animateTransitions={isMobile}
        action={actions => {
          swipeableActions.current = actions
        }}
      >
        <DataTab
          konnector={konnector}
          trigger={initialTrigger}
          flow={flow}
          account={account}
        />
        <ConfigurationTab
          konnector={konnector}
          account={account}
          flow={flow}
          addAccount={addAccount}
          onAccountDeleted={onAccountDeleted}
          showNewAccountButton={showNewAccountButton}
          intentsApi={intentsApi}
          innerAccountModalOverrides={innerAccountModalOverrides}
        />
      </SwipeableViews>
    </div>
  )
}

export const KonnectorAccountTabs = props => {
  return (
    <FlowProvider
      initialTrigger={props.initialTrigger}
      konnector={props.konnector}
    >
      {({ flow }) => <DumbKonnectorAccountTabs {...props} flow={flow} />}
    </FlowProvider>
  )
}

KonnectorAccountTabs.propTypes = {
  konnector: PropTypes.object.isRequired,
  initialTrigger: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
  onAccountDeleted: PropTypes.func.isRequired,
  addAccount: PropTypes.func.isRequired,
  /** @type {string} Can be used to force the initial tab */
  initialActiveTab: PropTypes.oneOf(['configuration', 'data']),
  intentsApi: intentsApiProptype,
  innerAccountModalOverrides: innerAccountModalOverridesProptype
}

export default KonnectorAccountTabs
