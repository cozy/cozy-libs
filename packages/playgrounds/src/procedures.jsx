import React from 'react'
import ReactDOM from 'react-dom'
import { Route } from 'react-router'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import App from './common/App'
import client from './common/client'
import 'cozy-ui/transpiled/react/stylesheet.css'
import 'cozy-ui/dist/cozy-ui.min.css'
// import Comp from 'cozy-procedures'
import injectProcedureRoutes from '../../cozy-procedures/dist'

const reducer = combineReducers({
  cozy: client.reducer()
})

const store = createStore(reducer)

const OtherRouteComponent = () => {
  return <div>yo</div>
}

ReactDOM.render(
  <Provider store={store}>
    <App client={client} existingStore={store}>
      <Route path="/whatever" component={OtherRouteComponent} />
      {injectProcedureRoutes({ root: '/' })}
    </App>
  </Provider>,
  document.querySelector('#app')
)
