import React from 'react'
import PropTypes from 'prop-types'

import {
  Tab,
  Tabs,
  TabList,
  TabPanels,
  TabPanel
} from 'cozy-ui/transpiled/react/Tabs'
import Icon from 'cozy-ui/transpiled/react/Icon'

import FlowProvider from '../FlowProvider'
import DataTab from './DataTab'
import ConfigurationTab from './ConfigurationTab'
import tabSpecs from './tabSpecs'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'

const WarningError = () => (
  <Icon icon="warning" size={13} className="u-ml-half" />
)

export const KonnectorAccountTabs = ({
  konnector,
  trigger: initialTrigger,
  account,
  onAccountDeleted,
  initialActiveTab,

  // TODO rename to onAddAccount
  addAccount,
  showNewAccountButton
}) => {
  const { t } = useI18n()
  return (
    <FlowProvider initialTrigger={initialTrigger} konnector={konnector}>
      {({ flow }) => {
        const flowState = flow.getState()
        const { error } = flowState
        const hasError = !!error
        const hasLoginError = hasError && error.isLoginError()

        return (
          <Tabs
            initialActiveTab={
              initialActiveTab || (hasLoginError ? 'configuration' : 'data')
            }
          >
            <TabList>
              <Tab name="data">
                {t('modal.tabs.data')}
                {tabSpecs.data.errorShouldBeDisplayed(error, flowState) && (
                  <WarningError />
                )}
              </Tab>
              <Tab name="configuration">
                {t('modal.tabs.configuration')}
                {tabSpecs.configuration.errorShouldBeDisplayed(
                  error,
                  flowState
                ) && <WarningError />}
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel name="data" className="u-pt-1-half u-pb-0">
                <DataTab
                  konnector={konnector}
                  trigger={initialTrigger}
                  flow={flow}
                />
              </TabPanel>
              <TabPanel name="configuration" className="u-pt-0 u-pb-0">
                <ConfigurationTab
                  konnector={konnector}
                  account={account}
                  flow={flow}
                  addAccount={addAccount}
                  onAccountDeleted={onAccountDeleted}
                  showNewAccountButton={showNewAccountButton}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        )
      }}
    </FlowProvider>
  )
}

KonnectorAccountTabs.propTypes = {
  konnector: PropTypes.object.isRequired,
  trigger: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
  onAccountDeleted: PropTypes.func.isRequired,
  addAccount: PropTypes.func.isRequired,

  /** @type {string} Can be used to force the initial tab */
  initialActiveTab: PropTypes.oneOf(['configuration', 'data'])
}

export default KonnectorAccountTabs
