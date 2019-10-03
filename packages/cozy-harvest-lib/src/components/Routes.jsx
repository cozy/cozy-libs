import React from 'react'
import { Route, Redirect, withRouter } from 'react-router'
import trimEnd from 'lodash/trimEnd'
import Modal from 'cozy-ui/transpiled/react/Modal'

import KonnectorAccounts from './KonnectorAccounts'
import AccountsListModal from './AccountsListModal'
import AccountModal from './AccountModal'
import NewAccountModal from './NewAccountModal'
import EditAccountModal from './EditAccountModal'
import KonnectorSuccess from './KonnectorSuccess'

const Routes = ({ konnectorRoot, konnector, location, history, onDismiss }) => (
  <Modal dismissAction={onDismiss} mobileFullscreen size="small">
    <KonnectorAccounts konnector={konnector}>
      {accounts => (
        <>
          <Route
            path={`${konnectorRoot}/`}
            exact
            render={() => {
              if (accounts.length === 0) {
                history.push('./new')
                return null
              } else if (accounts.length === 1) {
                history.push(`./accounts/${accounts[0].account._id}`)
                return null
              } else {
                return (
                  <AccountsListModal
                    konnector={konnector}
                    accounts={accounts}
                  />
                )
              }
            }}
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
          {/* TODO redirect render twice the component */}
          <Redirect
            from={konnectorRoot}
            to={trimEnd(location.pathname, '/') + '/'}
            exact
          />
        </>
      )}
    </KonnectorAccounts>
  </Modal>
)

export default withRouter(Routes)
