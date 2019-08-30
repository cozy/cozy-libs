import React, { Component } from 'react'
import { withRouter } from 'react-router'

import { ModalContent } from 'cozy-ui/transpiled/react/Modal'

import TriggerManager from '../components/TriggerManager'
import KonnectorModalHeader from './KonnectorModalHeader'
import * as triggersModel from '../helpers/triggers'

/**
 * We need to deal with `onLoginSuccess` and `onSucess` because we
 * can have a `onSuccess` without having a `onLoginSuccess` since only
 * few konnectors know if the login is success or not.
 *
 */
class NewAccountModal extends Component {
  render() {
    const { konnector, history } = this.props
    return (
      <>
        <KonnectorModalHeader konnector={konnector} />
        <ModalContent>
          <TriggerManager
            konnector={konnector}
            onLoginSuccess={trigger => {
              const accountId = triggersModel.getAccountId(trigger)
              history.push(`../accounts/${accountId}`)
            }}
            onSuccess={trigger => {
              const accountId = triggersModel.getAccountId(trigger)
              history.push(`../accounts/${accountId}`)
            }}
          />
        </ModalContent>
      </>
    )
  }
}

export default withRouter(NewAccountModal)
