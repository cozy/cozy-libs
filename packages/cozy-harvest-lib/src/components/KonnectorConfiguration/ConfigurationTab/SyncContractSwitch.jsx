import React from 'react'
import { withClient, queryConnect } from 'cozy-client'
import compose from 'lodash/flowRight'

import { models } from 'cozy-client'
import Switch from 'cozy-ui/transpiled/react/MuiCozyTheme/Switch'

import { createAccountQuerySpec } from '../../../connections/accounts'

import { findKonnectorPolicy } from '../../../konnector-policies'

const { account: accountModel } = models

export class DumbSyncContractSwitch extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      syncStatus: accountModel.DEFAULT_CONTRACT_SYNC_STATUS,
      syncStatusLoading: false
    }
    this.handleSetSyncStatus = this.handleSetSyncStatus.bind(this)
    this.checkToUpdateContractState({ mounting: true })
  }

  componentDidUpdate() {
    this.checkToUpdateContractState()
  }

  checkToUpdateContractState({ mounting = false } = {}) {
    const { accountCol, contract } = this.props
    if (
      accountCol.fetchStatus === 'loaded' &&
      !this.hasSetSyncStatusFromAccount
    ) {
      this.hasSetSyncStatusFromAccount = true
      const account = accountCol.data
      const relSyncStatus = accountModel.getContractSyncStatusFromAccount(
        account,
        contract._id
      )
      if (relSyncStatus !== null) {
        if (mounting) {
          // eslint-disable-next-line react/no-direct-mutation-state
          this.state.syncStatus = relSyncStatus
        } else {
          this.setState({ syncStatus: relSyncStatus })
        }
      }
    }
  }

  async handleSetSyncStatus(ev) {
    ev.preventDefault()
    const { client, konnector, contract, accountCol } = this.props
    const { data: account } = accountCol
    const { syncStatus } = this.state
    const newSyncStatus = !syncStatus
    const policy = findKonnectorPolicy(konnector)
    this.setState({ syncStatus: newSyncStatus, syncStatusLoading: true })
    try {
      await policy.setSync({
        client,
        account,
        konnector,
        contract,
        syncStatus: newSyncStatus
      })
      const updatedAccount = accountModel.setContractSyncStatusInAccount(
        account,
        contract._id,
        newSyncStatus
      )
      await client.save(updatedAccount)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Could not set sync status', e)
    } finally {
      this.setState({ syncStatusLoading: false })
    }
  }

  render() {
    const { accountCol, switchProps } = this.props
    const { syncStatus, syncStatusLoading } = this.state

    if (accountCol.fetchStatus === 'loading') {
      return null
    }

    return (
      <Switch
        color="primary"
        disabled={syncStatusLoading}
        onClick={this.handleSetSyncStatus}
        checked={syncStatus}
        {...switchProps}
      />
    )
  }
}

const SyncContractSwitch = compose(
  withClient,
  queryConnect({
    accountCol: props => createAccountQuerySpec(props.accountId)
  })
)(DumbSyncContractSwitch)

export default SyncContractSwitch
