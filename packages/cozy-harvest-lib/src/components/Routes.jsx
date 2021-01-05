import React from 'react'
import { Switch, Route, Redirect } from 'react-router'
import KonnectorAccounts from './KonnectorAccounts'

import AccountModal from './AccountModal'
import NewAccountModal from './NewAccountModal'
import EditAccountModal from './EditAccountModal'
import KonnectorSuccess from './KonnectorSuccess'
import HarvestModalRoot from './HarvestModalRoot'
import HarvestVaultProvider from './HarvestVaultProvider'
import { MountPointProvider } from './MountPointContext'
import Dialog from 'cozy-ui/transpiled/react/Dialog'
import {
  DialogCloseButton,
  useCozyDialog
} from 'cozy-ui/transpiled/react/CozyDialogs'
import DialogContext from './DialogContext'

const Routes = ({ konnectorRoot, konnector, onDismiss }) => {
  const dialogContext = useCozyDialog({
    size: 'l',
    open: true,
    onClose: onDismiss
  })
  return (
    <MountPointProvider baseRoute={konnectorRoot}>
      <DialogContext.Provider value={dialogContext}>
        <HarvestVaultProvider>
          <Dialog {...dialogContext.dialogProps} aria-label={konnector.name}>
            <DialogCloseButton onClick={onDismiss} />
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
                  <Redirect
                    from={`${konnectorRoot}/*`}
                    to={`${konnectorRoot}/`}
                  />
                </Switch>
              )}
            </KonnectorAccounts>
          </Dialog>
        </HarvestVaultProvider>
      </DialogContext.Provider>
    </MountPointProvider>
  )
}

export default Routes
