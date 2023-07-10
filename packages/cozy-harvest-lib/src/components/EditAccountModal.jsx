import flow from 'lodash/flow'
import get from 'lodash/get'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

import { withClient } from 'cozy-client'
import flag from 'cozy-flags'
import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

import { withMountPointProps } from './MountPointContext'
import LegacyTriggerManager from './TriggerManager'
import { withTracker } from './hoc/tracking'
import useTimeout from './hooks/useTimeout'
import { fetchAccount } from '../connections/accounts'
import { intentsApiProptype } from '../helpers/proptypes'
import * as triggersModel from '../helpers/triggers'
import logger from '../logger'

const showStyle = { opacity: 1, transition: 'opacity 0.3s ease' }
const hideStyle = { opacity: 0, transition: 'opacity 0.3s ease' }

const DumbEditAccountModal = withMountPointProps(
  ({
    konnector,
    account,
    trigger,
    fetching,
    redirectToAccount,
    location,
    reconnect,
    intentsApi
  }) => {
    /**
     * The TriggerManager can open the vault if necessary when it is mounted.
     * If the vault is opened, the EditAccountModal will be closed and will reappear
     * once the vault has been unlocked.
     * To prevent any jarring effect (open edit modal -> close edit modal -> open
     * vault modal), we delay a bit the appearing of the edit modal via CSS.
     */
    const shouldShow = useTimeout(500)

    // TODO Avoid passing reconnect in props,
    // prefer to use location instead.
    const fromReconnect = reconnect || location.search.endsWith('reconnect')
    // If we come from the reconnect button so focus on secret field
    const fieldOptions = {
      displaySecretPlaceholder: true,
      focusSecretField: fromReconnect
    }

    return (
      <Dialog
        aria-label={konnector.name}
        content={
          fetching ? (
            <div className="u-pv-2 u-ta-center">
              <Spinner size="xxlarge" />
            </div>
          ) : (
            <LegacyTriggerManager
              account={account}
              konnector={konnector}
              initialTrigger={trigger}
              onSuccess={redirectToAccount}
              showError={true}
              onVaultDismiss={redirectToAccount}
              fieldOptions={fieldOptions}
              reconnect={fromReconnect}
              intentsApi={intentsApi}
              onClose={redirectToAccount}
            />
          )
        }
        onBack={redirectToAccount}
        onClose={redirectToAccount}
        open
        size="medium"
        style={shouldShow ? showStyle : hideStyle}
        title={konnector.name}
      />
    )
  }
)

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

    this.props.trackPage('editer_identifiants')
  }
  /**
   * TODO use queryConnect to know if we're fetching or not
   */
  async fetchAccount(trigger) {
    const { client } = this.props
    this.setState({ fetching: true })

    try {
      const accountId = triggersModel.getAccountId(trigger)
      const account = await fetchAccount(client, accountId)
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
      flag('harvest.inappconnectors.enabled')
        ? this.props.replaceHistory(`/accounts/${account._id}/config`)
        : this.props.replaceHistory(`/accounts/${account._id}`)
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
    const { konnector, reconnect, intentsApi } = this.props
    const { trigger, account, fetching } = this.state
    return (
      <DumbEditAccountModal
        konnector={konnector}
        intentsApi={intentsApi}
        account={account}
        trigger={trigger}
        fetching={fetching}
        redirectToAccount={this.redirectToAccount}
        reconnect={reconnect}
      />
    )
  }
}

EditAccountModal.propTypes = {
  konnector: PropTypes.object.isRequired,
  accountId: PropTypes.string.isRequired,
  accounts: PropTypes.array.isRequired,
  reconnect: PropTypes.bool,
  intentsApi: intentsApiProptype
}

export default flow(
  withClient,
  withMountPointProps,
  withTracker
)(EditAccountModal)
