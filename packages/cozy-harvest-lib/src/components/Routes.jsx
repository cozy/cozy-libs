import React from 'react'
import { Switch, Route, Redirect } from 'react-router'
import { withStyles } from '@material-ui/core/styles'

import Dialog from 'cozy-ui/transpiled/react/Dialog'
import {
  DialogCloseButton,
  useCozyDialog
} from 'cozy-ui/transpiled/react/CozyDialogs'

import KonnectorAccounts from './KonnectorAccounts'
import AccountModal from './AccountModal'
import NewAccountModal from './NewAccountModal'
import EditAccountModal from './EditAccountModal'
import KonnectorSuccess from './KonnectorSuccess'
import HarvestModalRoot from './HarvestModalRoot'
import HarvestVaultProvider from './HarvestVaultProvider'
import { MountPointProvider } from './MountPointContext'
import DialogContext from './DialogContext'
import {
  useVaultUnlockContext,
  VaultUnlockProvider,
  VaultUnlockPlaceholder
} from './vaultUnlockContext'

/**
 * Dialog will not be centered vertically since we need the modal to "stay in place"
 * when changing tabs. Since tabs content's height is not the same between the data
 * tab and the configuration, having the modal vertically centered makes it "jump"
 * when changing tabs.
 */
const HarvestDialog = withStyles({
  scrollPaper: {
    alignItems: 'start'
  }
})(props => {
  const { showingUnlockForm } = useVaultUnlockContext()
  if (showingUnlockForm) {
    return null
  }
  return <Dialog disableRestoreFocus {...props} />
})

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
          <VaultUnlockProvider>
            <HarvestDialog
              {...dialogContext.dialogProps}
              aria-label={konnector.name}
            >
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
            </HarvestDialog>
            <VaultUnlockPlaceholder />
          </VaultUnlockProvider>
        </HarvestVaultProvider>
      </DialogContext.Provider>
    </MountPointProvider>
  )
}

export default Routes
