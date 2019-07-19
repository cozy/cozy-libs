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
import { PageLayout, PageFooter, PageContent } from 'cozy-ui/transpiled/react'

const padded = Component => {
  const Wrapped = ({ children }) => (
    <Component>
      <div className="u-m-1">{children}</div>
    </Component>
  )
  Wrapped.displayName = `padded(${Component.displayName || Component.name})`
  return Wrapped
}
const PROCEDURE_OPTIONS = {
  root: '/',
  components: {
    PageLayout,
    PageFooter: padded(PageFooter),
    PageContent: padded(PageContent)
  }
}

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
      {injectProcedureRoutes(PROCEDURE_OPTIONS)}
    </App>
  </Provider>,
  document.querySelector('#app')
)
