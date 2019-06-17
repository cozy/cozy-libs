import React from 'react'
import { Provider, connect } from 'react-redux'
import get from 'lodash/get'

import store from './redux/store'
import Context from './redux/context'
import creditApplicationTemplate from './templates/creditApplicationTemplate'
import { init as initPersonalData } from './redux/personalDataSlice'
import withLocales from './withLocales'

class Procedure extends React.Component {
  componentDidMount() {
    this.props.initPersonalData(
      get(creditApplicationTemplate, 'personalData.schema.properties', {})
    )
  }

  render() {
    return this.props.children
  }
}

const mapDispatchToProps = dispatch => ({
  initPersonalData: template => dispatch(initPersonalData(template))
})

const ProcedureContainer = withLocales(
  connect(
    null,
    mapDispatchToProps,
    null,
    { context: Context }
  )(Procedure)
)

const ProcedureWithStore = props => (
  <Provider store={store} context={Context}>
    <ProcedureContainer {...props} />
  </Provider>
)

export default ProcedureWithStore
