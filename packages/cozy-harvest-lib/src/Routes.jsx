import { Route, Redirect, withRouter } from 'react-router-dom'
import trimEnd from 'lodash/trimEnd'
import KonnectorAccounts from './components/KonnectorAccounts'
import AccountsListModal from './components/AccountsListModal'
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

const Routes = ({ base, konnector, location, history }) => (
  <KonnectorAccounts konnector={konnector}>
    {accounts => (
      <>
        <Route
          path={`${base}/`}
          exact
          component={() => (
            <AccountsListModal konnector={konnector} accounts={accounts} />
          )}
        />
        <Route
          path={`${base}/accounts/:accountId`}
          exact
          component={() => <Wrapper konnector={konnector} />}
        />
        <Route
          path={`${base}/new`}
          exact
          component={() => <Wrapper konnector={konnector} />}
        />
        <Redirect
          from={base}
          to={trimEnd(location.pathname, '/') + '/'}
          exact
        />
      </>
    )}
  </KonnectorAccounts>
)

export default withRouter(Routes)
