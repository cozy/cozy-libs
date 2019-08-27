import React, { Component } from 'react'
import get from 'lodash/get'
import { withMutations } from 'cozy-client'
import { withRouter } from 'react-router'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import Modal, {
  ModalContent,
  ModalHeader
} from 'cozy-ui/transpiled/react/Modal'
import Button from 'cozy-ui/transpiled/react/Button'
import { Text } from 'cozy-ui/transpiled/react/Text'

import accountMutations from '../connections/accounts'
import triggersMutations from '../connections/triggers'
import * as triggersModel from '../helpers/triggers'
import TriggerManager from './TriggerManager'

class EditAccountModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      trigger: null,
      account: null,
      fetching: true,
      error: false,
      isJobRunning: false,
      konnectorJobError: triggersModel.getError(props.trigger)
    }

    this.handleKonnectorJobError = this.handleKonnectorJobError.bind(this)
    this.handleKonnectorJobSuccess = this.handleKonnectorJobSuccess.bind(this)
    this.handleTriggerLaunch = this.handleTriggerLaunch.bind(this)
  }

  componentDidMount() {
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

  handleTriggerLaunch() {
    this.setState({ isJobRunning: true, konnectorJobError: null })
  }

  handleKonnectorJobSuccess() {
    this.setState({ isJobRunning: false })
    this.refetchTrigger()
    this.props.history.push('../')
  }

  handleKonnectorJobError(konnectorJobError) {
    this.setState({
      konnectorJobError,
      isJobRunning: false
    })

    this.refetchTrigger()
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
    const { konnector, onDismiss, t, history } = this.props
    const { trigger, account, fetching, isJobRunning } = this.state
    return (
      <Modal
        dismissAction={onDismiss}
        mobileFullscreen
        size="small"
        closable={false}
      >
        <ModalHeader className="u-bg-dodgerBlue u-p-0 u-h-3 u-flex u-flex-items-center">
          <Button
            onClick={() => history.push('../')}
            icon="previous"
            label={t('back')}
            iconOnly
            extension="narrow"
            className="u-m-0 u-p-1 u-pos-absolute u-h-3"
            style={{
              left: 0,
              top: 0
            }}
          />
          <div className="u-flex-grow-1 u-ta-center">
            <Text className="u-white">{konnector.name}</Text>
          </div>
        </ModalHeader>
        <ModalContent>
          {fetching ? (
            <div className="u-pv-2 u-ta-center">
              <Spinner size="xxlarge" />
            </div>
          ) : (
            <TriggerManager
              account={account}
              konnector={konnector}
              trigger={trigger}
              onLaunch={this.handleTriggerLaunch}
              onSuccess={this.handleKonnectorJobSuccess}
              onError={this.handleKonnectorJobError}
              showError={true}
            />
          )}
        </ModalContent>
      </Modal>
    )
  }
}

export default withMutations(accountMutations, triggersMutations)(
  withRouter(translate()(EditAccountModal))
)
