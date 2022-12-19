import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import flag from 'cozy-flags'

import { ViewerModal } from '../../datacards/ViewerModal'
import AccountModal from '../AccountModal'
import NewAccountModal from '../NewAccountModal'
import EditAccountModal from '../EditAccountModal'
import KonnectorSuccess from '../KonnectorSuccess'
import HarvestModalRoot from '../HarvestModalRoot'

const RoutesV4 = ({
  konnectorRoot,
  konnectorWithTriggers,
  accountsAndTriggers,
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
        path={`${konnectorRoot}/accounts/:accountId`}
        exact
        render={({ match }) => (
          <AccountModal
            konnector={konnectorWithTriggers}
            accountId={match.params.accountId}
            accountsAndTriggers={accountsAndTriggers}
            onDismiss={onDismiss}
            showNewAccountButton={!konnectorWithTriggers.clientSide}
            showAccountSelection={!konnectorWithTriggers.clientSide}
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
        path={`${konnectorRoot}/viewer/:accountId/:folderToSaveId/:fileIndex`}
        exact
        render={routeComponentProps => <ViewerModal {...routeComponentProps} />}
      />
      <Route
        path={`${konnectorRoot}/new`}
        exact
        render={() => (
          <NewAccountModal
            konnector={konnectorWithTriggers}
            onDismiss={onDismiss}
          />
        )}
      />
      {!flag('harvest.inappconnectors.enabled') && (
        <Route
          path={`${konnectorRoot}/accounts/:accountId/success`}
          exact
          render={({ match }) => {
            return (
              <KonnectorSuccess
                konnector={konnectorWithTriggers}
                accountId={match.params.accountId}
                accounts={accountsAndTriggers}
                onDismiss={onDismiss}
              />
            )
          }}
        />
      )}
      <Redirect from={`${konnectorRoot}/*`} to={`${konnectorRoot}/`} />
    </Switch>
  )
}

export default RoutesV4
