import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import get from 'lodash/get'
import flow from 'lodash/flow'

import { withClient } from 'cozy-client'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import CipherIcon from 'cozy-ui/transpiled/react/CipherIcon'
import Typography from 'cozy-ui/transpiled/react/Typography'
import Dialog, { DialogTitle } from 'cozy-ui/transpiled/react/Dialog'
import {
  DialogCloseButton,
  useCozyDialog
} from 'cozy-ui/transpiled/react/CozyDialogs'
import DialogContent from 'cozy-ui/transpiled/react/DialogContent'

import { fetchAccount } from '../connections/accounts'
import * as triggersModel from '../helpers/triggers'
import TriggerManager from './TriggerManager'
import { withMountPointProps } from './MountPointContext'
import logger from '../logger'
import { withTracker } from './hoc/tracking'
import useTimeout from './hooks/useTimeout'
import { intentsApiProptype } from '../helpers/proptypes'

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
    const { dialogProps, dialogTitleProps } = useCozyDialog({
      open: true,
      size: 'm',
      onClose: redirectToAccount
    })

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
        style={shouldShow ? showStyle : hideStyle}
        aria-label={konnector.name}
        {...dialogProps}
        onClose={redirectToAccount}
      >
        <DialogCloseButton onClick={redirectToAccount} />
        <DialogTitle
          {...dialogTitleProps}
          className={cx(
            dialogTitleProps.className,
            'u-flex u-flex-items-center'
          )}
          disableTypography
        >
          <CipherIcon konnector={konnector.slug} className="u-mr-1" />
          <Typography variant="h5">{konnector.name}</Typography>
        </DialogTitle>
        <DialogContent className="u-pt-0">
          {fetching ? (
            <div className="u-pv-2 u-ta-center">
              <Spinner size="xxlarge" />
            </div>
          ) : (
            <TriggerManager
              account={account}
              konnector={konnector}
              initialTrigger={trigger}
              onSuccess={redirectToAccount}
              showError={true}
              onVaultDismiss={redirectToAccount}
              fieldOptions={fieldOptions}
              reconnect={fromReconnect}
              intentsApi={intentsApi}
            />
          )}
          <div className="u-mb-2" />
        </DialogContent>
      </Dialog>
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
      this.props.replaceHistory(`/accounts/${account._id}`)
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
