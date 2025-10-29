import React from 'react'
import { Route, IndexRoute } from 'react-router'

import _App from './App'
import { optionsConsumer, optionsProvider } from './ProcedureOptions'
import _DocumentsDataForm from './components/Documents'
import _Amount from './containers/Amount'
import _Duration from './containers/Duration'
import _Overview from './containers/Overview'
import _PersonalDataForm from './containers/PersonalDataForm'
import creditApplicationTemplate from './templates/creditApplicationTemplate'

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
