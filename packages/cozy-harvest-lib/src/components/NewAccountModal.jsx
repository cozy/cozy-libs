import React, { Component } from 'react'
import { withRouter } from 'react-router'
import Modal, {
  ModalContent,
  ModalHeader
} from 'cozy-ui/transpiled/react/Modal'
import TriggerManager from '../components/TriggerManager'
import KonnectorIcon from './KonnectorIcon'

class NewAccountModal extends Component {
  render() {
    const { konnector, history, onDismiss } = this.props
    return (
      <Modal dismissAction={onDismiss} mobileFullscreen size="small">
        <ModalHeader className="u-pr-2">
          <div className="u-flex u-flex-row u-w-100 u-flex-items-center">
            <div className="u-w-3 u-h-3 u-mr-half">
              <KonnectorIcon konnector={konnector} />
            </div>
            <div className="u-flex-grow-1 u-mr-half">
              <h3 className="u-title-h3 u-m-0">{konnector.name}</h3>
            </div>
          </div>
        </ModalHeader>
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
      </Modal>
    )
  }
}

export default withRouter(NewAccountModal)
