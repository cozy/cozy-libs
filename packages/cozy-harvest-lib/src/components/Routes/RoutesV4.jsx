import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import flag from 'cozy-flags'

import { ViewerModal } from '../../datacards/ViewerModal'
import AccountModal from '../AccountModal'
import AccountModalContentWrapper from '../AccountModalWithoutTabs/ForV4Router/AccountModalContentWrapper'
import AccountModalWithoutTabs from '../AccountModalWithoutTabs/ForV4Router/AccountModalWithoutTabs'
import EditAccountModal from '../EditAccountModal'
import HarvestModalRoot from '../HarvestModalRoot'
import ConfigurationTab from '../KonnectorConfiguration/ConfigurationTab'
import DataTab from '../KonnectorConfiguration/DataTab'
import KonnectorSuccess from '../KonnectorSuccess'
import NewAccountModal from '../NewAccountModal'
import withAdaptiveRouter from '../hoc/withRouter'

const RoutesV4 = ({
  konnectorRoot,
  konnectorWithTriggers,
  accountsAndTriggers,
  historyAction,
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
        path={`${konnectorRoot}/viewer/:accountId/:folderToSaveId/:fileIndex`}
        exact
        render={routeComponentProps => <ViewerModal {...routeComponentProps} />}
      />
      {flag('harvest.inappconnectors.enabled') ? (
        <>
          <Route
            path={`${konnectorRoot}/accounts/:accountId`}
            exact
            render={({ match }) => (
              <AccountModalWithoutTabs
                konnector={konnectorWithTriggers}
                accountId={match.params.accountId}
                accountsAndTriggers={accountsAndTriggers}
                showNewAccountButton={!konnectorWithTriggers.clientSide}
                showAccountSelection={!konnectorWithTriggers.clientSide}
                onDismiss={onDismiss}
              >
                <AccountModalContentWrapper>
                  <DataTab
                    konnectorRoot={konnectorRoot}
                    konnector={konnectorWithTriggers}
                    showNewAccountButton={!konnectorWithTriggers.clientSide}
                    onDismiss={onDismiss}
                  />
                </AccountModalContentWrapper>
              </AccountModalWithoutTabs>
            )}
          />
          <Route
            path={`${konnectorRoot}/accounts/:accountId/config`}
            exact
            render={({ match }) => (
              <AccountModalWithoutTabs
                konnector={konnectorWithTriggers}
                accountId={match.params.accountId}
                accountsAndTriggers={accountsAndTriggers}
                showNewAccountButton={!konnectorWithTriggers.clientSide}
                showAccountSelection={!konnectorWithTriggers.clientSide}
                onDismiss={onDismiss}
              >
                <AccountModalContentWrapper>
                  <ConfigurationTab
                    konnector={konnectorWithTriggers}
                    showNewAccountButton={!konnectorWithTriggers.clientSide}
                    onAccountDeleted={onDismiss}
                    addAccount={() =>
                      historyAction(`${konnectorRoot}/new`, 'replace')
                    }
                  />
                </AccountModalContentWrapper>
              </AccountModalWithoutTabs>
            )}
          />
        </>
      ) : (
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
      )}

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

export default withAdaptiveRouter(RoutesV4)
