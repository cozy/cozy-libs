import React from 'react'
import { Route, IndexRoute } from 'react-router'
import creditApplicationTemplate from './templates/creditApplicationTemplate'

import App from './App'
import Overview from './containers/Overview'
import Amount from './containers/Amount'
import Duration from './containers/Duration'
import PersonalDataForm from './containers/PersonalDataForm'
import Documents from './components/Documents'

const injectProcedureRoutes = ({ root }) => (
  <Route path={root} component={App}>
    <IndexRoute component={() => <Overview />} />
    <Route path="amount" component={() => <Amount />} />
    <Route path="duration" component={() => <Duration />} />
    <Route path="personal" component={() => <PersonalDataForm />} />
    <Route path="documents" component={() => <Documents />} />
  </Route>
)

export { creditApplicationTemplate }
export default injectProcedureRoutes
