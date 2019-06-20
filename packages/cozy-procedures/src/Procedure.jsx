import React from 'react'
import get from 'lodash/get'
import { withClient } from 'cozy-client'

import creditApplicationTemplate from './templates/creditApplicationTemplate'

class Procedure extends React.Component {
  componentDidMount() {
    this.props.initPersonalData(
      get(creditApplicationTemplate, 'personalData.schema.properties', {})
    )
    this.props.fetchMyself(this.props.client)
  }

  render() {
    return this.props.children
  }
}

export default withClient(Procedure)
