import React, { Component } from 'react'
import PropTypes from 'react-proptypes'

import { withMutations } from 'cozy-client'
import { translate } from 'cozy-ui/react/I18n'

import AccountForm from './AccountForm'
import accountsMutations from '../connections/accounts'
import { triggersMutations } from '../connections/triggers'
import filesMutations from '../connections/files'
import permissionsMutations from '../connections/permissions'
import accounts from '../helpers/accounts'
import cron from '../helpers/cron'
import konnectors from '../helpers/konnectors'
import { slugify } from '../helpers/slug'
import triggers from '../helpers/triggers'

const IDLE = 'IDLE'
const RUNNING = 'RUNNING'

/**
 * Deals with konnector configuration, i.e encapsulate account creation or
 * edition
 * @type {Component}
 */
export class TriggerManager extends Component {
  state = {
    account: null,
    status: IDLE
  }

  constructor(props) {
    super(props)

    this.handleAccountCreationSuccess = this.handleAccountCreationSuccess.bind(
      this
    )
    this.handleAccountUpdateSuccess = this.handleAccountUpdateSuccess.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    this.state = {
      account: props.account,
      status: IDLE
    }
  }

  /**
   * Account creation success handler
   * @param  {Object}  account Created io.cozy.accounts document
   * @return {Object}          io.cozy.jobs document, runned with account data
   */
  async handleAccountCreationSuccess(account) {
    const {
      addPermission,
      addReferencesTo,
      createDirectoryByPath,
      createTrigger,
      statDirectoryByPath,
      konnector,
      t
    } = this.props

    this.setState({
      account
    })

    let folder
    if (konnectors.needsFolder(konnector)) {
      const path = `${t('default.baseDir')}/${konnector.name}/${slugify(
        accounts.getLabel(account)
      )}`

      folder =
        (await statDirectoryByPath(path)) || (await createDirectoryByPath(path))

      await addPermission(konnector, konnectors.buildFolderPermission(folder))
      await addReferencesTo(konnector, [folder])
    }

    const trigger = await createTrigger(
      triggers.buildAttributes({
        account,
        cron: cron.fromKonnector(konnector),
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
      account
    })

    const { trigger } = this.props
    return await this.launch(trigger)
  }

  async handleSubmit(data) {
    const { konnector, saveAccount } = this.props

    const { account } = this.state
    const isUpdate = !!account

    this.setState({
      status: RUNNING
    })

    const savedAccount = accounts.mergeAuth(
      await saveAccount(
        konnector,
        isUpdate
          ? accounts.mergeAuth(account, data)
          : accounts.build(konnector, data)
      ),
      data
    )

    return isUpdate
      ? this.handleAccountUpdateSuccess(savedAccount)
      : this.handleAccountCreationSuccess(savedAccount)
  }

  /**
   * Launches a trigger
   * @param  {Object}  trigger io.cozy.triggers document
   * @return {Promise}         [description]
   */
  async launch(trigger) {
    const {
      launchTrigger,
      onLoginSuccess,
      onSuccess,
      waitForLoginSuccess
    } = this.props

    const job = await waitForLoginSuccess(await launchTrigger(trigger))

    this.setState({
      status: IDLE
    })

    if (['queued', 'running'].includes(job.state)) {
      return onLoginSuccess(trigger)
    }

    return onSuccess(trigger)
  }

  render() {
    const { konnector, running } = this.props
    const { account, error, status } = this.state
    const submitting = status === RUNNING || running

    return (
      <AccountForm
        account={account}
        error={error}
        konnector={konnector}
        onSubmit={this.handleSubmit}
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
  addReferencesTo: PropTypes.func,
  createTrigger: PropTypes.func.isRequired,
  createDirectoryByPath: PropTypes.func,
  launchTrigger: PropTypes.func.isRequired,
  saveAccount: PropTypes.func.isRequired,
  statDirectoryByPath: PropTypes.func,
  waitForLoginSuccess: PropTypes.func.isRequired,
  // hooks
  onLoginSuccess: PropTypes.func.isRequired,
  onSuccess: PropTypes.func
}

export default translate()(
  withMutations(
    accountsMutations,
    filesMutations,
    permissionsMutations,
    triggersMutations
  )(TriggerManager)
)
