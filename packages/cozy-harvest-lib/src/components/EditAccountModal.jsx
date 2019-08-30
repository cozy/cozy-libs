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
import { withBreakpoints } from 'cozy-ui/transpiled/react'
import palette from 'cozy-ui/transpiled/react/palette'

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
      error: false
    }

    this.handleKonnectorJobSuccess = this.handleKonnectorJobSuccess.bind(this)
  }

  componentDidMount() {
    const { accountId, accounts } = this.props
    /**
     * @TODO In theory we can have several trigger for the same account
     * so this code will not work as excepted.
     */

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

  handleKonnectorJobSuccess() {
    //this.refetchTrigger()
    this.props.history.push('../')
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
    /**
     * We don't use the dismiss action pros that we can have from our
     * Routes component since this modal has to be on top on the previous one
     * So when we quit it, we have to go back to the previous one.
     *
     * When we are on mobile, we displayed a back button
     * On desktop we display a cross
     */
    const {
      konnector,
      t,
      history,
      breakpoints: { isMobile }
    } = this.props
    const { trigger, account, fetching } = this.state
    return (
      <Modal
        dismissAction={() => history.push('../')}
        mobileFullscreen
        size="small"
        closable={isMobile ? false : true}
        closeBtnColor={palette.white}
      >
        <ModalHeader className="u-bg-dodgerBlue u-p-0 u-h-3 u-flex u-flex-items-center">
          {isMobile && (
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
          )}
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
              initialTrigger={trigger}
              onSuccess={this.handleKonnectorJobSuccess}
              showError={true}
            />
          )}
        </ModalContent>
      </Modal>
    )
  }
}

export default withMutations(accountMutations, triggersMutations)(
  withBreakpoints()(withRouter(translate()(EditAccountModal)))
)
