import React from 'react'
import ReactDOM from 'react-dom'
import { Route } from 'react-router'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import App from './common/App'
import client from './common/client'
import { LogoutButton, AppList } from './common/components'
import Nav from './common/Nav'

const reducer = combineReducers({
  cozy: client.reducer()
})

const store = createStore(reducer)

class LoggedIn extends React.Component {
  render() {
    return (
      <div>
        <Nav />
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
