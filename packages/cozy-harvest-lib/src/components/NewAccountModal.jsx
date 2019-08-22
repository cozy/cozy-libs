import React, { Component } from 'react'
import { withRouter } from 'react-router'

import TriggerManager from '../components/TriggerManager'

class NewAccountModal extends Component {
  render() {
    const { konnector, history } = this.props
    return (
      <TriggerManager
        konnector={konnector}
        onLoginSuccess={(trigger, account) =>
          history.push(`../accounts/${account._id}`)
        }
        onSuccess={(trigger, account) =>
          history.push(`../accounts/${account._id}`)
        }
      />
    )
  }
}

export default withRouter(NewAccountModal)
