import React, { Component } from 'react'
import PropTypes from 'react-proptypes'

import { withMutations } from 'cozy-client'
import { translate } from 'cozy-ui/react/I18n'

import AccountCreator from './AccountCreator'
import AccountEditor from './AccountEditor'
import TriggerSuccessMessage from './TriggerSuccessMessage'
import { triggersMutations } from '../connections/triggers'
import filesMutations from '../connections/files'
import permissionsMutations from '../connections/permissions'
import accounts from '../helpers/accounts'
import konnectors from '../helpers/konnectors'
import { slugify } from '../helpers/slug'
import triggers from '../helpers/triggers'

const IDLE = 'IDLE'
const RUNNING = 'RUNNING'
const LOGGED = 'LOGGED'
const SUCCESS = 'SUCCESS'

/**
 * Deals with konnector configuration, i.e encapsulate account creation or
 * edition
 * @type {Component}
 */
export class TriggerManager extends Component {
  state = {
    status: IDLE
  }

  constructor(props) {
    super(props)

    this.handleAccountCreationSuccess = this.handleAccountCreationSuccess.bind(
      this
    )
    this.handleAccountMutation = this.handleAccountMutation.bind(this)
    this.handleAccountUpdateSuccess = this.handleAccountUpdateSuccess.bind(this)
  }

  /**
   * Creation/update start handler
   * Set the status to RUNNING as soon as an account is being created
   * or updated.
   */
  handleAccountMutation() {
    this.setState({
      status: RUNNING
    })
  }

  /**
   * Account creation success handler
   * @param  {Object}  account Created io.cozy.accounts document
   * @return {Object}          io.cozy.jobs document, runned with account data
   */
  async handleAccountCreationSuccess(account) {
    const {
      addPermission,
      createDirectoryByPath,
      createTrigger,
      statDirectoryByPath,
      konnector,
      t
    } = this.props

    this.setState({
      createdAccount: account
    })

    let folder
    if (konnectors.needsFolder(konnector)) {
      const path = `${t('default.baseDir')}/${konnector.name}/${slugify(
        accounts.getLabel(account)
      )}`

      folder =
        (await statDirectoryByPath(path)) || (await createDirectoryByPath(path))

      await addPermission(konnector, konnectors.buildFolderPermission(folder))
    }

    const trigger = await createTrigger(
      triggers.buildAttributes({
        account,
        cron: triggers.buildCron(konnector),
        folder,
        konnector
      })
    )

    return await this.launch(trigger)
  }

  /**
   * Account update success handler
   * @param  {Object}  account Updated io.cozy.accounts document
   * @return {Object}          io.cozy.jobs document, runned with account data
   */
  async handleAccountUpdateSuccess(account) {
    this.setState({
      updatedAccount: account
    })

    const { trigger } = this.props
    return await this.launch(trigger)
  }

  /**
   * Launches a trigger
   * @param  {Object}  trigger io.cozy.triggers document
   * @return {Promise}         [description]
   */
  async launch(trigger) {
    const { launchTrigger, onLoginSuccess, waitForLoginSuccess } = this.props

    const job = await waitForLoginSuccess(await launchTrigger(trigger))

    if (['queued', 'running'].includes(job.state)) {
      onLoginSuccess(trigger)
      this.setState({
        status: LOGGED
      })
    }

    this.setState({
      status: SUCCESS
    })
  }

  render() {
    const { account, konnector, onDone, running } = this.props
    const { createdAccount, status, updatedAccount } = this.state
    const succeed = createdAccount && [LOGGED, SUCCESS].includes(status)
    const editing = account && !createdAccount
    const submitting = status === RUNNING
    return succeed ? (
      <TriggerSuccessMessage onDone={onDone} />
    ) : editing ? (
      <AccountEditor
        account={updatedAccount || account}
        konnector={konnector}
        onBeforeUpdate={this.handleAccountMutation}
        onUpdateSuccess={this.handleAccountUpdateSuccess}
        submitting={submitting || running}
      />
    ) : (
      <AccountCreator
        account={createdAccount}
        konnector={konnector}
        onBeforeCreate={this.handleAccountMutation}
        onCreateSuccess={this.handleAccountCreationSuccess}
        submitting={submitting}
      />
    )
  }
}

TriggerManager.propTypes = {
  account: PropTypes.object,
  konnector: PropTypes.object.isRequired,
  trigger: PropTypes.object,
  running: PropTypes.bool,
  // mutations
  addPermission: PropTypes.func,
  createTrigger: PropTypes.func.isRequired,
  createDirectoryByPath: PropTypes.func,
  statDirectoryByPath: PropTypes.func,
  launchTrigger: PropTypes.func.isRequired,
  waitForLoginSuccess: PropTypes.func.isRequired,
  // hooks
  onDone: PropTypes.func.isRequired,
  onLoginSuccess: PropTypes.func.isRequired
}

export default translate()(
  withMutations(filesMutations, permissionsMutations, triggersMutations)(
    TriggerManager
  )
)
