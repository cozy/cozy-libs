import React from 'react'
import ReactDOM from 'react-dom'
import { Route } from 'react-router'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'

import { withClient, queryConnect } from 'cozy-client'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

import App from '../common/App'
import client from '../common/client'

const reducer = combineReducers({
  cozy: client.reducer()
})

const store = createStore(reducer)

class _AppList extends React.Component {
  render() {
    if (this.props.apps.fetchStatus === 'loading') {
      return <Spinner />
    }
    return (
      <div>
        {this.props.apps.data.map(app => (
          <div key={app.slug}>
            {app.slug}: {app.name}
          </div>
        ))}
      </div>
    )
  }
}

const LogoutButton = withClient(({ client }) => {
  return <button onClick={() => client.logout()}>Logout</button>
})

const AppList = queryConnect({
  apps: {
    query: client => client.all('io.cozy.apps'),
    as: 'apps'
  }
})(_AppList)

class LoggedIn extends React.Component {
  render() {
    return (
      <div>
        <AppList />
        <LogoutButton />
      </div>
    )
  }
}

ReactDOM.render(
  <Provider store={store}>
    <App client={client} existingStore={store}>
      <Route path="/" component={LoggedIn} />
    </App>
  </Provider>,
  document.querySelector('#app')
)
