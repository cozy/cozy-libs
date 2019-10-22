import React, { Component } from 'react'
import PropTypes from 'prop-types'

import get from 'lodash/get'
import flow from 'lodash/flow'
import { withMutations } from 'cozy-client'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import Modal, {
  ModalContent,
  ModalHeader
} from 'cozy-ui/transpiled/react/Modal'
import CipherIcon from 'cozy-ui/transpiled/react/CipherIcon'

import accountMutations from '../connections/accounts'
import triggersMutations from '../connections/triggers'
import * as triggersModel from '../helpers/triggers'
import TriggerManager from './TriggerManager'
import { withMountPointPushHistory } from './MountPointContext'

export class EditAccountModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      trigger: null,
      account: null,
      fetching: true,
      error: false
    }
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
    if (matchingTrigger) this.fetchAccount(matchingTrigger)
  }
  /**
   * TODO use queryConnect to know if we're fecthing or not
   */
  async fetchAccount(trigger) {
    const { findAccount } = this.props
    this.setState({ fetching: true })

    try {
      const account = await findAccount(triggersModel.getAccountId(trigger))
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

  render() {
    /**
     * We don't use the dismiss action pros that we can have from our
     * Routes component since this modal has to be on top on the previous one
     * So when we quit it, we have to go back to the previous one.
     *
     * When we are on mobile, we display a back button
     * On desktop we display a cross
     */
    const { konnector, pushHistory } = this.props
    const { trigger, account, fetching } = this.state
    return (
      <Modal
        dismissAction={() => pushHistory(`/accounts/${account._id}`)}
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
              onSuccess={() => pushHistory(`/accounts/${account._id}`)}
              showError={true}
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
  accounts: PropTypes.array.isRequired,
  findAccount: PropTypes.func.isRequired,
  fetchTrigger: PropTypes.func.isRequired
}

export default flow(
  withMutations(accountMutations, triggersMutations),
  withMountPointPushHistory
)(EditAccountModal)
