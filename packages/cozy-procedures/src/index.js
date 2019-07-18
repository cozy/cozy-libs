import React, { createContext } from 'react'
import { Route, IndexRoute } from 'react-router'
import creditApplicationTemplate from './templates/creditApplicationTemplate'

import _App from './App'

import _Overview from './containers/Overview'
import _Amount from './containers/Amount'
import _Duration from './containers/Duration'
import _PersonalDataForm from './containers/PersonalDataForm'
import _DocumentsDataForm from './components/Documents'

import { PageLayout, PageFooter, PageContent } from 'cozy-ui/transpiled/react'

const ProcedureOptionsContext = createContext({})

const DEFAULT_OPTIONS = {
  components: {
    PageLayout,
    PageFooter,
    PageContent
  }
}

const optionsProvider = (Component, procedureOptions = DEFAULT_OPTIONS) => {
  const Wrapped = props => {
    return (
      <ProcedureOptionsContext.Provider value={procedureOptions}>
        <Component {...props} />
      </ProcedureOptionsContext.Provider>
    )
  }
  Wrapped.displayName = `procedureOptionsProvider(${Component.displayName ||
    Component.name})`
  return Wrapped
}

const optionsConsumer = Component => props => {
  const Wrapped = (
    <ProcedureOptionsContext.Consumer>
      {options => <Component {...options} {...props} />}
    </ProcedureOptionsContext.Consumer>
  )
  Wrapped.displayName = `procedureOptionsConsumer(${Component.displayName ||
    Component.name})`
  return Wrapped
}

const Amount = optionsConsumer(_Amount)
const Duration = optionsConsumer(_Duration)
const PersonalDataForm = optionsConsumer(_PersonalDataForm)
const DocumentsDataForm = optionsConsumer(_DocumentsDataForm)
const Overview = optionsConsumer(_Overview)

const injectProcedureRoutes = ({ root, ...options }) => (
  <Route path={root} component={optionsProvider(_App, options)}>
    <IndexRoute component={Overview} />
    <Route path="amount" component={Amount} />
    <Route path="duration" component={Duration} />
    <Route path="personal" component={PersonalDataForm} />
    <Route path="documents" component={DocumentsDataForm} />
  </Route>
)

export { creditApplicationTemplate }
export default injectProcedureRoutes
