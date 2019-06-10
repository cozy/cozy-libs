import React from 'react'
import { Route, IndexRoute } from 'react-router'

import Procedure from './Procedure'
import Overview from './containers/Overview'
import PersonalDataForm from './containers/PersonalDataForm'
import OtherForm from './components/OtherComp'

const injectProcedureRoutes = ({ root }) => (
  <Route path={root} component={Procedure}>
    <IndexRoute component={() => <Overview />} />
    <Route path="personal" component={() => <PersonalDataForm />} />
    <Route path="other" component={OtherForm} />
  </Route>
)

export default injectProcedureRoutes
