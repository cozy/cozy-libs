import React from 'react'
import { Switch, Route, Redirect } from 'react-router'
import Modal from 'cozy-ui/transpiled/react/Modal'

import KonnectorAccounts from './KonnectorAccounts'
import AccountModal from './AccountModal'
import NewAccountModal from './NewAccountModal'
import EditAccountModal from './EditAccountModal'
import KonnectorSuccess from './KonnectorSuccess'
import HarvestModalRoot from './HarvestModalRoot'
import { MountPointProvider } from './MountPointContext'

const Routes = ({ konnectorRoot, konnector, onDismiss }) => {
  return (
    <MountPointProvider baseRoute={konnectorRoot}>
      <Modal
        dismissAction={onDismiss}
        mobileFullscreen
        size="small"
        aria-label={konnector.name}
      >
        <KonnectorAccounts konnector={konnector}>
          {accountsAndTriggers => (
            <Switch>
              <Route
                path={`${konnectorRoot}/`}
                exact
                render={() => (
                  <HarvestModalRoot
                    accounts={accountsAndTriggers}
                    konnector={konnector}
                  />
                )}
              />
              <Route
                path={`${konnectorRoot}/accounts/:accountId`}
                exact
                render={({ match }) => (
                  <AccountModal
                    konnector={konnector}
                    accountId={match.params.accountId}
                    accountsAndTriggers={accountsAndTriggers}
                    onDismiss={onDismiss}
                  />
                )}
              />
              <Route
                path={`${konnectorRoot}/accounts/:accountId/edit`}
                exact
                render={({ match }) => (
                  <EditAccountModal
                    konnector={konnector}
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
                    konnector={konnector}
                    onDismiss={onDismiss}
                  />
                )}
              />
              <Route
                path={`${konnectorRoot}/accounts/:accountId/success`}
                exact
                render={({ match }) => {
                  return (
                    <KonnectorSuccess
                      konnector={konnector}
                      accountId={match.params.accountId}
                      accounts={accountsAndTriggers}
                      onDismiss={onDismiss}
                    />
                  )
                }}
              />
              <Redirect from={`${konnectorRoot}/*`} to={`${konnectorRoot}/`} />
            </Switch>
          )}
        </KonnectorAccounts>
      </Modal>
    </MountPointProvider>
  )
}

export default Routes
