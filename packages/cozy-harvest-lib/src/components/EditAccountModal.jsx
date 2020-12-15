import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import get from 'lodash/get'
import flow from 'lodash/flow'
import { withClient } from 'cozy-client'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import CipherIcon from 'cozy-ui/transpiled/react/CipherIcon'
import Typography from 'cozy-ui/transpiled/react/Typography'

import { fetchAccount } from '../connections/accounts'
import * as triggersModel from '../helpers/triggers'
import TriggerManager from './TriggerManager'
import { withMountPointPushHistory } from './MountPointContext'
import logger from '../logger'
import { withTracker } from './hoc/tracking'

import Dialog, { DialogTitle } from 'cozy-ui/transpiled/react/Dialog'
import {
  DialogCloseButton,
  useCozyDialog
} from 'cozy-ui/transpiled/react/CozyDialogs'
import DialogContent from '@material-ui/core/DialogContent'

const DumbEditAccountModal = ({
  konnector,
  account,
  trigger,
  fetching,
  redirectToAccount
}) => {
  const { dialogProps, dialogTitleProps } = useCozyDialog({
    open: true,
    size: 'm',
    onClose: redirectToAccount
  })
  return (
    <Dialog
      aria-label={konnector.name}
      {...dialogProps}
      onClose={redirectToAccount}
    >
      <DialogCloseButton onClick={redirectToAccount} />
      <DialogTitle
        {...dialogTitleProps}
        className={cx(dialogTitleProps.className, 'u-flex u-flex-items-center')}
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
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

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
   * TODO use queryConnect to know if we're fecthing or not
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
      <DumbEditAccountModal
        konnector={konnector}
        account={account}
        trigger={trigger}
        fetching={fetching}
        redirectToAccount={this.redirectToAccount}
      />
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
  withMountPointPushHistory,
  withTracker
)(EditAccountModal)
