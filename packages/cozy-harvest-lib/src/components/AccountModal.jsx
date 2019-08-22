import React, { Component } from 'react'
import get from 'lodash/get'
import { withMutations } from 'cozy-client'
import accountMutations from '../connections/accounts'
import triggersMutations from '../connections/triggers'
import * as triggersModel from '../helpers/triggers'
import KonnectorConfiguration from './KonnectorConfiguration/KonnectorConfiguration'
import KonnectorIcon from './KonnectorIcon'
import { withRouter } from 'react-router'
import Modal, {
  ModalContent,
  ModalHeader
} from 'cozy-ui/transpiled/react/Modal'

class AccountModal extends Component {
  state = {
    trigger: null,
    account: null,
    fetching: true,
    error: false
  }
  componentDidMount() {
    this.loadSelectedAccountId()
  }

  loadSelectedAccountId() {
    const { accountId, accounts } = this.props
    const matchingTrigger = get(
      accounts.find(account => account.account._id === accountId),
      'trigger'
    )
    if (matchingTrigger) this.fetchAccount(matchingTrigger)
  }

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

  async refetchTrigger() {
    const { fetchTrigger } = this.props
    const { trigger } = this.state

    const upToDateTrigger = await fetchTrigger(trigger._id)
    this.setState({
      trigger: upToDateTrigger
    })
  }

  render() {
    const { konnector, onDismiss, history } = this.props
    const { trigger, account, fetching } = this.state
    if (fetching) return 'loading'
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
          <KonnectorConfiguration
            konnector={konnector}
            trigger={trigger}
            account={account}
            onAccountDeleted={onDismiss}
            addAccount={() => history.push('../../new')}
            refetchTrigger={this.refetchTrigger}
          />
        </ModalContent>
      </Modal>
    )
  }
}

export default withMutations(accountMutations, triggersMutations)(
  withRouter(AccountModal)
)
