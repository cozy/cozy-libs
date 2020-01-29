import React from 'react'
import PropTypes from 'prop-types'
import flow from 'lodash/flow'

import {
  Tab,
  Tabs,
  TabList,
  TabPanels,
  TabPanel
} from 'cozy-ui/transpiled/react/Tabs'
import Icon from 'cozy-ui/transpiled/react/Icon'
import { translate } from 'cozy-ui/transpiled/react/I18n'

import TriggerLauncher from '../TriggerLauncher'
import DataTab from './DataTab'
import ConfigurationTab from './ConfigurationTab'

export const KonnectorAccountTabs = ({
  konnector,
  trigger: initialTrigger,
  account,
  onAccountDeleted,
  //TODO rename to onAddAccount
  addAccount,
  t
}) => {
  return (
    <TriggerLauncher initialTrigger={initialTrigger}>
      {({ error, running }) => {
        const hasError = !!error
        const shouldDisplayError = !running && hasError
        const hasLoginError = hasError && error.isLoginError()

        return (
          <Tabs initialActiveTab={hasLoginError ? 'configuration' : 'data'}>
            <TabList>
              <Tab name="data">
                {t('modal.tabs.data')}
                {// Login error should not be mentionned in data tab
                hasError && !hasLoginError && (
                  <Icon icon="warning" size={13} className="u-ml-half" />
                )}
              </Tab>
              <Tab name="configuration">
                {t('modal.tabs.configuration')}
                {shouldDisplayError && hasLoginError && (
                  <Icon icon="warning" size={13} className="u-ml-half" />
                )}
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel name="data" className="u-pt-1-half u-pb-0">
                <DataTab
                  konnector={konnector}
                  trigger={initialTrigger}
                  error={error}
                  shouldDisplayError={shouldDisplayError}
                  hasLoginError={hasLoginError}
                />
              </TabPanel>
              <TabPanel name="configuration" className="u-pt-1-half u-pb-0">
                <ConfigurationTab
                  konnector={konnector}
                  error={error}
                  account={account}
                  addAccount={addAccount}
                  onAccountDeleted={onAccountDeleted}
                  konnectorIsRunning={running}
                  shouldDisplayError={shouldDisplayError}
                  hasLoginError={hasLoginError}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        )
      }}
    </TriggerLauncher>
  )
}

KonnectorAccountTabs.propTypes = {
  konnector: PropTypes.object.isRequired,
  trigger: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
  onAccountDeleted: PropTypes.func.isRequired,
  addAccount: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
}

export default flow(translate())(KonnectorAccountTabs)
