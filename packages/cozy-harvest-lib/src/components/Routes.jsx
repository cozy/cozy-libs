import React, { useEffect } from 'react'
import { Switch, Route, Redirect } from 'react-router'
import { withStyles } from '@material-ui/core/styles'

import Alerter from 'cozy-ui/transpiled/react/Alerter'
import Dialog from 'cozy-ui/transpiled/react/Dialog'
import {
  DialogCloseButton,
  useCozyDialog
} from 'cozy-ui/transpiled/react/CozyDialogs'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import {
  useVaultUnlockContext,
  VaultUnlockProvider,
  VaultUnlockPlaceholder
} from 'cozy-keys-lib'

import KonnectorAccounts from './KonnectorAccounts'
import AccountModal from './AccountModal'
import NewAccountModal from './NewAccountModal'
import EditAccountModal from './EditAccountModal'
import KonnectorSuccess from './KonnectorSuccess'
import HarvestModalRoot from './HarvestModalRoot'
import HarvestVaultProvider from './HarvestVaultProvider'
import { MountPointProvider } from './MountPointContext'
import DialogContext from './DialogContext'
import { DatacardOptions } from './Datacards/DatacardOptionsContext'

import { ViewerModal } from '../datacards/ViewerModal'
import { useKonnectorWithTriggers } from '../helpers/useKonnectorWithTriggers'

/**
 * Dialog will not be centered vertically since we need the modal to "stay in place"
 * when changing tabs. Since tabs content's height is not the same between the data
 * tab and the configuration, having the modal vertically centered makes it "jump"
 * when changing tabs.
 */
const HarvestDialog = withStyles({
  scrollPaper: {
    alignItems: 'start'
  },

  // Necessary to prevent warnings at runtime
  paper: {}
})(props => {
  const { showingUnlockForm } = useVaultUnlockContext()
  if (showingUnlockForm) {
    return null
  }

  return <Dialog disableRestoreFocus {...props} />
})

const Routes = ({
  konnectorRoot,
  konnector,
  konnectorSlug,
  onDismiss,
  datacardOptions
}) => {
  const { t } = useI18n()
  const dialogContext = useCozyDialog({
    size: 'l',
    open: true,
    onClose: onDismiss
  })

  const { konnectorWithTriggers, fetching, notFoundError } =
    useKonnectorWithTriggers(konnectorSlug, konnector)

  useEffect(() => {
    if (notFoundError) {
      onDismiss()
      Alerter.error(t('error.application-not-found'))
    }
  }, [notFoundError, onDismiss, t])

  return (
    <DatacardOptions options={datacardOptions}>
      <MountPointProvider baseRoute={konnectorRoot}>
        <DialogContext.Provider value={dialogContext}>
          <HarvestVaultProvider>
            <VaultUnlockProvider>
              <HarvestDialog
                {...dialogContext.dialogProps}
                aria-label={konnectorWithTriggers.name}
              >
                <DialogCloseButton onClick={onDismiss} />
                {fetching ? (
                  <div className="u-pv-2 u-ta-center">
                    <Spinner size="xxlarge" />
                  </div>
                ) : (
                  <KonnectorAccounts konnector={konnectorWithTriggers}>
                    {accountsAndTriggers => (
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
                              showNewAccountButton={
                                !konnectorWithTriggers.clientSide
                              }
                              showAccountSelection={
                                !konnectorWithTriggers.clientSide
                              }
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
                          render={routeComponentProps => (
                            <ViewerModal {...routeComponentProps} />
                          )}
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
                        <Redirect
                          from={`${konnectorRoot}/*`}
                          to={`${konnectorRoot}/`}
                        />
                      </Switch>
                    )}
                  </KonnectorAccounts>
                )}
              </HarvestDialog>
              <VaultUnlockPlaceholder />
            </VaultUnlockProvider>
          </HarvestVaultProvider>
        </DialogContext.Provider>
      </MountPointProvider>
    </DatacardOptions>
  )
}

export default Routes
