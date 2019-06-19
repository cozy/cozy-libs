import React from 'react'
import { Route, IndexRoute } from 'react-router'

import App from './App'
import Overview from './containers/Overview'
import Amount from './components/Amount'
import Duration from './components/Duration'
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

export default injectProcedureRoutes
