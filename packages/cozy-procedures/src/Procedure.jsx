import React from 'react'
import get from 'lodash/get'
import { withClient } from 'cozy-client'

import { creditApplicationTemplate } from 'cozy-procedures'

class Procedure extends React.Component {
  componentDidMount() {
    this.props.initPersonalData(
      get(creditApplicationTemplate, 'personalData.schema.properties', {})
    )
    this.props.fetchMyself(this.props.client)
  }

  render() {
    return <div className="u-p-1 u-maw-6">{this.props.children}</div>
  }
}

export default withClient(Procedure)
