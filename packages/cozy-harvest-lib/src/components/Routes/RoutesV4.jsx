import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import flag from 'cozy-flags'

import AccountModal from '../AccountModal'
import EditAccountModal from '../EditAccountModal'
import HarvestModalRoot from '../HarvestModalRoot'
import ConfigurationTab from '../KonnectorConfiguration/ConfigurationTab'
import DataTab from '../KonnectorConfiguration/DataTab'
import NewAccountModal from '../NewAccountModal'
import withAdaptiveRouter from '../hoc/withRouter'

const RoutesV4 = ({
  konnectorRoot,
  konnectorWithTriggers,
  accountsAndTriggers,
  onSuccess,
  onDismiss
}) => {
  return (
    <Switch>
      <Route
        path={`${konnectorRoot}/`}
        exact
        render={() => (
          <HarvestModalRoot
            accounts={accountsAndTriggers}
            konnector={konnectorWithTriggers}
          />
        )}
      />
      <Route
        path={`${konnectorRoot}/accounts/:accountId/edit`}
        exact
        render={({ match }) => (
          <EditAccountModal
            konnector={konnectorWithTriggers}
            accountId={match.params.accountId}
            accounts={accountsAndTriggers}
          />
        )}
      />
      <Route
        path={`${konnectorRoot}/new`}
        exact
        render={() => (
          <NewAccountModal
            konnector={konnectorWithTriggers}
            onSuccess={onSuccess}
            onDismiss={onDismiss}
          />
        )}
      />
      <Route
        path={`${konnectorRoot}/accounts/:accountId`}
        exact
        render={({ match }) => (
          <AccountModal
            konnector={konnectorWithTriggers}
            accountId={match.params.accountId}
            accountsAndTriggers={accountsAndTriggers}
            onDismiss={onDismiss}
            showNewAccountButton={flag('clisk.multi-accounts')}
            showAccountSelection={flag('clisk.multi-accounts')}
            Component={DataTab}
          />
        )}
      />
      <Route
        path={`${konnectorRoot}/accounts/:accountId/config`}
        exact
        render={({ match }) => (
          <AccountModal
            konnector={konnectorWithTriggers}
            accountId={match.params.accountId}
            accountsAndTriggers={accountsAndTriggers}
            onDismiss={onDismiss}
            showNewAccountButton={flag('clisk.multi-accounts')}
            showAccountSelection={flag('clisk.multi-accounts')}
            Component={ConfigurationTab}
          />
        )}
      />
      <Redirect from={`${konnectorRoot}/*`} to={`${konnectorRoot}/`} />
    </Switch>
  )
}

export default withAdaptiveRouter(RoutesV4)
