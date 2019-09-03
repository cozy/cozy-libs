import React from 'react'
import { Switch, Route, Redirect } from 'react-router'
import Modal from 'cozy-ui/transpiled/react/Modal'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import MuiCozyTheme from 'cozy-ui/transpiled/react/MuiCozyTheme'

import KonnectorAccounts from './KonnectorAccounts'
import AccountModal from './AccountModal'
import NewAccountModal from './NewAccountModal'
import EditAccountModal from './EditAccountModal'
import KonnectorSuccess from './KonnectorSuccess'
import HarvestVaultProvider from './HarvestVaultProvider'
import HarvestModalRoot from './HarvestModalRoot'
import { MountPointProvider } from './MountPointContext'

const Routes = ({ konnectorRoot, konnector, onDismiss }) => {
  return (
    <MountPointProvider baseRoute={konnectorRoot}>
      <Modal dismissAction={onDismiss} mobileFullscreen size="small">
        <MuiCozyTheme>
          <HarvestVaultProvider>
            <KonnectorAccounts konnector={konnector}>
              {accounts => (
                <Switch>
                  <Route
                    path={`${konnectorRoot}/`}
                    exact
                    render={() => (
                      <HarvestModalRoot
                        accounts={accounts}
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
                        accounts={accounts}
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
                        accounts={accounts}
                      />
                    )}
                  />
                  <Route
                    path={`${konnectorRoot}/new`}
                    exact
                    render={() => <NewAccountModal konnector={konnector} />}
                  />
                  <Route
                    path={`${konnectorRoot}/accounts/:accountId/success`}
                    exact
                    render={({ match }) => {
                      return (
                        <KonnectorSuccess
                          konnector={konnector}
                          accountId={match.params.accountId}
                          accounts={accounts}
                          onDismiss={onDismiss}
                        />
                      )
                    }}
                  />
                  <Redirect
                    from={`${konnectorRoot}/*`}
                    to={`${konnectorRoot}/`}
                  />
                </Switch>
              )}
            </KonnectorAccounts>
          </HarvestVaultProvider>
        </MuiCozyTheme>
      </Modal>
    </MountPointProvider>
  )
}

export default translate()(Routes)
