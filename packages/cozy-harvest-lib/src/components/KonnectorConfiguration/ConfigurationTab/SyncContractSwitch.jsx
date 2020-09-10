import React from 'react'
import { withClient, queryConnect } from 'cozy-client'
import compose from 'lodash/flowRight'

import {
  setContractSyncStatusInAccount,
  getContractSyncStatusFromAccount,
  DEFAULT_CONTRACT_SYNC_STATUS
} from '../../../connections/accounts'

import Switch from 'cozy-ui/transpiled/react/MuiCozyTheme/Switch'

import { createAccountQuerySpec } from '../../../connections/accounts'
import { findKonnectorPolicy } from '../../../konnector-policies'

class DumbSyncContractSwitch extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      syncStatus: DEFAULT_CONTRACT_SYNC_STATUS,
      syncStatusLoading: false
    }
    this.handleSetSyncStatus = this.handleSetSyncStatus.bind(this)
  }

  componentDidUpdate() {
    const { accountCol, contract } = this.props
    if (
      accountCol.fetchStatus === 'loaded' &&
      !this.hasSetSyncStatusFromAccount
    ) {
      this.hasSetSyncStatusFromAccount = true
      const account = accountCol.data
      const relSyncStatus = getContractSyncStatusFromAccount(
        account,
        contract._id
      )
      this.setState({ syncStatus: relSyncStatus })
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
      const updatedAccount = setContractSyncStatusInAccount(
        account,
        contract._id,
        newSyncStatus
      )
      await client.save(updatedAccount)
    } finally {
      this.setState({ syncStatusLoading: false })
    }
  }

  render() {
    const { accountCol } = this.props
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
