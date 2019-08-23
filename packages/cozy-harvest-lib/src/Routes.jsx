import React from 'react'
import { Route, Redirect, withRouter } from 'react-router-dom'
import trimEnd from 'lodash/trimEnd'
import KonnectorAccounts from './components/KonnectorAccounts'
import AccountsListModal from './components/AccountsListModal'
import AccountModal from './components/AccountModal'
import NewAccountModal from './components/NewAccountModal'

const Routes = ({ konnectorRoot, konnector, location, onDismiss }) => (
  <KonnectorAccounts konnector={konnector}>
    {accounts => (
      <>
        <Route
          path={`${konnectorRoot}/`}
          exact
          render={() => (
            <AccountsListModal
              konnector={konnector}
              accounts={accounts}
              onDismiss={onDismiss}
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
          path={`${konnectorRoot}/new`}
          exact
          render={() => <NewAccountModal konnector={konnector} onDismiss={onDismiss} />}
        />
        {/* TODO redirect render twice the component */}
        <Redirect
          from={konnectorRoot}
          to={trimEnd(location.pathname, '/') + '/'}
          exact
        />
      </>
    )}
  </KonnectorAccounts>
)

export default withRouter(Routes)
