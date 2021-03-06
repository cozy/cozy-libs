import React, { useState, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { Tab as UITab, Tabs } from 'cozy-ui/transpiled/react/MuiTabs'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Divider from 'cozy-ui/transpiled/react/MuiCozyTheme/Divider'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import WarningIcon from 'cozy-ui/transpiled/react/Icons/Warning'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import SwipeableViews from 'react-swipeable-views'

import useDOMMutations from '../hooks/useDOMMutations'
import FlowProvider from '../FlowProvider'
import DataTab from './DataTab'
import ConfigurationTab from './ConfigurationTab'
import tabSpecs from './tabSpecs'

const WarningError = () => {
  const { t } = useI18n()
  return (
    <span aria-label={t('badges.warning')}>
      <Icon icon={WarningIcon} size={13} className="u-error u-ml-half" />
    </span>
  )
}

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

export const KonnectorAccountTabsTabs = ({ tab, onChange, flowState }) => {
  const { t } = useI18n()
  const { error } = flowState
  return (
    <Tabs onChange={onChange} value={tab}>
      <Tab
        label={
          <>
            {t('modal.tabs.data')}
            {tabSpecs.data.errorShouldBeDisplayed(error, flowState) && (
              <WarningError />
            )}
          </>
        }
      />
      <Tab
        label={
          <>
            {t('modal.tabs.configuration')}
            {tabSpecs.configuration.errorShouldBeDisplayed(
              error,
              flowState
            ) && <WarningError />}
          </>
        }
      />
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
    doctypeToDataCard
  } = props
  const { isMobile } = useBreakpoints()
  const [tab, setTab] = useState(
    initialActiveTab
      ? tabIndexes[initialActiveTab]
      : hasLoginError
      ? tabIndexes.configuration
      : tabIndexes.data
  )
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

  return (
    <div ref={nodeRef}>
      <KonnectorAccountTabsTabs
        tab={tab}
        onChange={handleTabChange}
        flowState={flowState}
      />
      <Divider />
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
          doctypeToDataCard={doctypeToDataCard}
        />
        <ConfigurationTab
          konnector={konnector}
          account={account}
          flow={flow}
          addAccount={addAccount}
          onAccountDeleted={onAccountDeleted}
          showNewAccountButton={showNewAccountButton}
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
  initialActiveTab: PropTypes.oneOf(['configuration', 'data'])
}

export default KonnectorAccountTabs
