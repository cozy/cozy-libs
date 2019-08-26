import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { ModalContent } from 'cozy-ui/transpiled/react/Modal'
import TriggerManager from '../components/TriggerManager'
import KonnectorModalHeader from './KonnectorModalHeader'

class NewAccountModal extends Component {
  render() {
    const { konnector, history } = this.props
    return (
      <>
        <KonnectorModalHeader konnector={konnector} />
        <ModalContent>
          <TriggerManager
            konnector={konnector}
            onLoginSuccess={(trigger, account) =>
              history.push(`../accounts/${account._id}`)
            }
            onSuccess={(trigger, account) =>
              history.push(`../accounts/${account._id}`)
            }
          />
        </ModalContent>
      </>
    )
  }
}

export default withRouter(NewAccountModal)
