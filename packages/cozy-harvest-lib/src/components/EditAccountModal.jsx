import React, { Component } from 'react'
import PropTypes from 'prop-types'

import get from 'lodash/get'
import flow from 'lodash/flow'
import { withClient } from 'cozy-client'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import Modal, {
  ModalContent,
  ModalHeader
} from 'cozy-ui/transpiled/react/Modal'
import CipherIcon from 'cozy-ui/transpiled/react/CipherIcon'

import { findAccount } from '../connections/accounts'
import * as triggersModel from '../helpers/triggers'
import TriggerManager from './TriggerManager'
import { withMountPointPushHistory } from './MountPointContext'
import logger from '../logger'

export class EditAccountModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      trigger: null,
      account: null,
      fetching: true,
      error: false
    }

    this.redirectToAccount = this.redirectToAccount.bind(this)
  }

  componentDidMount() {
    const { accountId, accounts } = this.props

    /**
     * @TODO In theory we can have several trigger for the same account.
     * If so this code will not work as excepted. This case is theoretical
     */
    const matchingTrigger = get(
      accounts.find(account => account.account._id === accountId),
      'trigger'
    )
    if (matchingTrigger) {
      this.fetchAccount(matchingTrigger)
    } else {
      logger.warn('No matching trigger for account', accountId)
    }
  }
  /**
   * TODO use queryConnect to know if we're fecthing or not
   */
  async fetchAccount(trigger) {
    const { client } = this.props
    this.setState({ fetching: true })

    try {
      const accountId = triggersModel.getAccountId(trigger)
      const account = await findAccount(client, accountId)
      this.setState({
        account,
        trigger
      })
      return account
    } catch (error) {
      this.setState({
        error
      })
    } finally {
      this.setState({
        fetching: false
      })
    }
  }

  redirectToAccount() {
    const { account } = this.state
    if (account) {
      this.props.pushHistory(`/accounts/${account._id}`)
    } else {
      this.props.pushHistory(`/accounts`)
    }
  }

  render() {
    /**
     * We don't use the dismiss action pros that we can have from our
     * Routes component since this modal has to be on top on the previous one
     * So when we quit it, we have to go back to the previous one.
     *
     * When we are on mobile, we display a back button
     * On desktop we display a cross
     */
    const { konnector } = this.props
    const { trigger, account, fetching } = this.state
    return (
      <Modal
        dismissAction={this.redirectToAccount}
        mobileFullscreen
        size="small"
      >
        <ModalHeader
          title={
            <div className="u-flex u-flex-items-center">
              <CipherIcon konnector={konnector.slug} className="u-mr-1" />
              {konnector.name}
            </div>
          }
        />
        <ModalContent>
          {fetching ? (
            <div className="u-pv-2 u-ta-center">
              <Spinner size="xxlarge" />
            </div>
          ) : (
            <TriggerManager
              account={account}
              konnector={konnector}
              initialTrigger={trigger}
              onSuccess={this.redirectToAccount}
              showError={true}
              onVaultDismiss={this.redirectToAccount}
            />
          )}
        </ModalContent>
      </Modal>
    )
  }
}

EditAccountModal.propTypes = {
  konnector: PropTypes.object.isRequired,
  accountId: PropTypes.string.isRequired,
  accounts: PropTypes.array.isRequired
}

export default flow(
  withClient,
  withMountPointPushHistory
)(EditAccountModal)
