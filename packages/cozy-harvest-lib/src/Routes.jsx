import React from 'react'
import { Route, Redirect, withRouter } from 'react-router-dom'
import trimEnd from 'lodash/trimEnd'
import KonnectorAccounts from './components/KonnectorAccounts'
import AccountsListModal from './components/AccountsListModal'
import AccountModal from './components/AccountModal'
import KonnectorModal from './components/KonnectorModal'

const Wrapper = ({ konnector }) => {
  return (
    <KonnectorModal
      konnector={konnector}
      dismissAction={() => {
        history.push('/connected')
      }}
      createAction={() => {
        history.push(`/connected/${konnector.slug}/new`)
      }}
      onAccountChange={account => {
        history.push(`/connected/${konnector.slug}/accounts/${account._id}`)
      }}
    />
  )
}

const Routes = ({ konnectorRoot, konnector, location, onDismiss }) => (
  <KonnectorAccounts konnector={konnector}>
    {accounts => (
      <>
        <Route
          path={`${konnectorRoot}/`}
          exact
          component={() => (
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
          component={({ match }) => (
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
          component={() => <Wrapper konnector={konnector} />}
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
